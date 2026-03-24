import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await req.json();
  const db = await getDatabase();

  // Use an aggregation pipeline update to push the review and recalculate the
  // average rating atomically in a single round-trip instead of findOne + updateOne.
  const result = await db.collection("locations").updateOne(
    { id },
    [
      { $set: { reviews: { $concatArrays: [{ $ifNull: ["$reviews", []] }, [review]] } } },
      { $set: { rating: { $round: [{ $avg: "$reviews.rating" }, 1] } } },
    ]
  );

  if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true }, { status: 201 });
}
