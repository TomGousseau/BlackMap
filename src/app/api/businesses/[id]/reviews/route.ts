import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await req.json();
  const db = await getDatabase();

  // Push review and recalculate reputation
  const biz = await db.collection("businesses").findOne({ id });
  if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newReviews = [...(biz.reviews || []), review];
  const avgRep = newReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / newReviews.length;

  await db.collection("businesses").updateOne(
    { id },
    { $set: { reviews: newReviews, reputation: Math.round(avgRep * 10) / 10 } }
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
