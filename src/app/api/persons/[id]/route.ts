import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { isAuthenticated } from "@/lib/auth";

// Helper to build query - handle both ObjectId and custom string IDs
function buildIdQuery(id: string) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return { _id: new ObjectId(id) };
  }
  return { id }; // Custom string ID like "person-123456789"
}

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
    buildIdQuery(id),
    { $set: allowedFields }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getDatabase();
  await db.collection("persons").deleteOne(buildIdQuery(id));

  return NextResponse.json({ success: true });
}
