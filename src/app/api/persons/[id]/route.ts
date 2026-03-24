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
  if (typeof body.verified === "boolean") allowedFields.verified = body.verified;
  if (typeof body.rating === "number") allowedFields.rating = body.rating;
  if (body.status && ['Updated', 'Terminated', 'Outdated'].includes(body.status)) allowedFields.status = body.status;

  await db.collection("persons").updateOne(
    buildIdQuery(id),
    { $set: allowedFields }
  );

  return NextResponse.json({ success: true });
}

// PUT - Full person update (for editing)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = await getDatabase();

  // Build update object with all person fields
  const updateData: Record<string, unknown> = {
    name: body.name,
    lat: body.lat,
    lng: body.lng,
    imageUrl: body.imageUrl || null,
    imageUrls: body.imageUrls || null,
    about: body.about || null,
    reason: body.reason || null,
    notableAction: body.notableAction || null,
    workedFor: body.workedFor || null,
    discord: body.discord || null,
    youtube: body.youtube || null,
    discordId: body.discordId || null,
    phone: body.phone || null,
    telegram: body.telegram || null,
    telegramId: body.telegramId || null,
    vk: body.vk || null,
    github: body.github || null,
    steam: body.steam || null,
    website: body.website || null,
    nationality: body.nationality || null,
    relations: body.relations || null,
    age: body.age || null,
    signature: body.signature || null,
    status: body.status || null,
    approved: false, // Always require re-approval after edits
    updatedAt: new Date().toISOString(),
  };

  await db.collection("persons").updateOne(
    buildIdQuery(id),
    { $set: updateData }
  );

  // Return updated person
  const updated = await db.collection("persons").findOne(buildIdQuery(id));
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  return NextResponse.json({
    ...updated,
    id: updated.id || updated._id.toString(),
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getDatabase();
  await db.collection("persons").deleteOne(buildIdQuery(id));

  return NextResponse.json({ success: true });
}
