import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await req.json();
  const db = await getDatabase();

  const loc = await db.collection("locations").findOne({ id });
  if (!loc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newReviews = [...(loc.reviews || []), review];
  const avgRating = newReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / newReviews.length;

  await db.collection("locations").updateOne(
    { id },
    { $set: { reviews: newReviews, rating: Math.round(avgRating * 10) / 10 } }
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
