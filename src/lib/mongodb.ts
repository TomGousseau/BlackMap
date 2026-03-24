import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the client across HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  const db = client.db("blackrock");
  await ensureIndexes(db);
  return db;
}

// Track whether indexes have been created to avoid re-running on every request
const globalWithIndexes = globalThis as typeof globalThis & { _indexesCreated?: boolean };

async function ensureIndexes(db: Db): Promise<void> {
  if (globalWithIndexes._indexesCreated) return;
  globalWithIndexes._indexesCreated = true;

  // createIndex is idempotent in MongoDB — safe to call even if index already exists
  await Promise.all([
    db.collection("persons").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("persons").createIndex({ approved: 1 }),
    db.collection("businesses").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("businesses").createIndex({ approved: 1 }),
    db.collection("locations").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("locations").createIndex({ approved: 1 }),
  ]).catch(() => {
    // Non-fatal: index creation failures should not break requests
    globalWithIndexes._indexesCreated = false;
  });
}
