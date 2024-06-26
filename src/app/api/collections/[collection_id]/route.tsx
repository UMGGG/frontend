import { CollectionDetail } from "@/types/Collection";
import { NextResponse, NextRequest } from "next/server";

/* 특정 콜렉션 정보 조회 */
export async function GET(
  request: NextRequest,
  { params }: { params: { collection_id: string } }
) {
  console.log("GET /api/collections/[collection_id]/route.tsx");
  console.log("params", params);
  if (params.collection_id == "0") {
    return NextResponse.json(
      {
        status: {
          code: 404,
          message: "Not Found",
        },
        metadata: {
          resultCount: 0,
        },
        results: [],
      },
      {
        status: 404,
      }
    );
  }
  return NextResponse.json({
    status: {
      code: 200,
      message: "OK",
    },
    metadata: {
      resultCount: 1,
    },
    results: [result],
  });
}

const result: CollectionDetail = {
  id: 114,
  title: "eunjil's kitchen",
  details: "진짜 맛집",
  writerId: 8,
  writerMembername: "eunji_princess_11",
  thumbnail: "https://picsum.photos/200",
  likeCnt: 0,
  collectionPinCnt: 1,
  scrapCnt: 0,
  // tags: ["abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"],
  tags: [
    "s",
    "abcdefghijklmnopqrstuvwxyz",
    "맛집맛집맛집맛집맛집",
    "맛집",
    "고기",
  ],
  scrapped: false,
  liked: false,
};
