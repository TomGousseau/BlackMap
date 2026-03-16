import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/auth";

// Truncate text to max 200 chars and sanitize
function sanitizeText(text: string | undefined, maxLength = 200): string | undefined {
  if (!text) return undefined;
  return text.slice(0, maxLength);
}

export async function GET() {
  const db = await getDatabase();
  const persons = await db.collection("persons").find().toArray();
  return NextResponse.json(persons.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDatabase();
  
  // Auto-approve if admin is creating
  const adminCreating = await isAuthenticated();
  const approved = adminCreating ? true : false;
  
  // Sanitize text fields with 200 char limit
  const sanitizedBody = {
    ...body,
    about: sanitizeText(body.about),
    reason: sanitizeText(body.reason),
    notableAction: sanitizeText(body.notableAction),
    workedFor: sanitizeText(body.workedFor),
    age: sanitizeText(body.age, 50),
    name: sanitizeText(body.name, 100),
    signature: sanitizeText(body.signature, 20),
  };
  
  const result = await db.collection("persons").insertOne({
    ...sanitizedBody,
    approved,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ id: result.insertedId.toString(), ...sanitizedBody, approved }, { status: 201 });
}
