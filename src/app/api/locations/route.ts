import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  const db = await getDatabase();
  const locations = await db.collection("locations").find().toArray();
  return NextResponse.json(locations.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDatabase();
  const result = await db.collection("locations").insertOne({
    ...body,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ id: result.insertedId.toString(), ...body }, { status: 201 });
}
