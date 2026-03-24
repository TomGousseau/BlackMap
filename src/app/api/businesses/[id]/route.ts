import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = await getDatabase();

  // Whitelist allowed fields to prevent overwriting sensitive data
  const allowedFields: Record<string, unknown> = {};
  if (typeof body.approved === "boolean") allowedFields.approved = body.approved;
  if (typeof body.important === "boolean") allowedFields.important = body.important;
  if (typeof body.verified === "boolean") allowedFields.verified = body.verified;

  if (Object.keys(allowedFields).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  await db.collection("businesses").updateOne(
    { id },
    { $set: allowedFields }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getDatabase();

  await db.collection("businesses").deleteOne({ id });

  return NextResponse.json({ success: true });
}
