import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = await getDatabase();

  await db.collection("businesses").updateOne(
    { _id: id as unknown as import("mongodb").ObjectId },
    { $set: body }
  );

  // Also try string id match
  await db.collection("businesses").updateOne(
    { id },
    { $set: body }
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
