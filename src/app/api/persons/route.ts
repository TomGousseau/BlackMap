import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/auth";

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
  
  const result = await db.collection("persons").insertOne({
    ...body,
    approved,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ id: result.insertedId.toString(), ...body, approved }, { status: 201 });
}
