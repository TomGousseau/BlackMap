import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  const db = await getDatabase();
  const businesses = await db.collection("businesses").find().toArray();
  return NextResponse.json(businesses.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDatabase();
  const result = await db.collection("businesses").insertOne({
    ...body,
    approved: false,
    reviews: [],
    reputation: 0,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ id: result.insertedId.toString(), ...body, approved: false, reviews: [], reputation: 0 }, { status: 201 });
}
