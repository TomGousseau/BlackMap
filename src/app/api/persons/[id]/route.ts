import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = await getDatabase();

  const allowedFields: Record<string, unknown> = {};
  if (typeof body.approved === "boolean") allowedFields.approved = body.approved;
  if (typeof body.important === "boolean") allowedFields.important = body.important;

  await db.collection("persons").updateOne(
    { _id: new ObjectId(id) },
    { $set: allowedFields }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getDatabase();
  await db.collection("persons").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}
