import PinCard from "@/components/PinCard";
import ReviewCard from "@/components/ReviewCard";
// import PinReview from "@/types/PinReview";
import Pin from "@/types/Pin";

const pinData: Pin = {
  id: 1,
  placeId: 13,
  collectionId: 1,
  writerMembername: "잠자는_짱구의_콧털",
  review: `포카리스웨트 강남역점은
맛있는 음식을 먹을 수 있는 곳입니다.
무엇보다도 가격이 저렴하고
서비스가 좋아서 자주 방문하게 되네요.`,

  createdAt: "2023-02-15T12:34:56",
  placePinCnt: 25,
  roadNameAddress: "서울특별시 강남구 어딘가",
  placeName: "포카리스웨트 강남역점",
  latitude: 37.1234,
  longitude: 127.1234,
  starred: true,
  category: "카페",
  tags: ["커피", "디저트", "휴식"],
  collectionTitle: "서울 핫플레이스",
  imagePaths: ["image_path1.jpg", "image_path2.jpg", "image_path3.jpg"],
};

const commentList: Pin[] = [
  {
    id: 1,
    placeId: 13,
    collectionId: 1,
    writerMembername: "user123",
    review: "아름다운 경치와 맛있는 음식",
    createdAt: "2023-02-15T12:34:56",
    placePinCnt: 25,
    roadNameAddress: "서울특별시 강남구 어딘가",
    placeName: "멋진 카페",
    latitude: 37.1234,
    longitude: 127.1234,
    starred: true,
    category: "카페",
    tags: ["커피", "디저트", "휴식"],
    collectionTitle: "서울 핫플레이스",
    imagePaths: ["image_path1.jpg", "image_path2.jpg", "image_path3.jpg"],
  },
  {
    id: 2,
    placeId: 13,
    collectionId: 2,
    writerMembername: "user456",
    review: "편안한 분위기에서 즐기는 최고의 커피",
    createdAt: "2023-03-01T15:20:30",
    placePinCnt: 40,
    roadNameAddress: "서울특별시 종로구 다른 곳",
    placeName: "조용한 북카페",
    latitude: 37.5759,
    longitude: 126.9769,
    starred: false,
    category: "북카페",
    tags: ["책", "커피", "조용함"],
    collectionTitle: "서울의 숨겨진 보석",
    imagePaths: ["image_path4.jpg", "image_path5.jpg"],
  },
  {
    id: 3,
    placeId: 13,
    collectionId: 3,
    writerMembername: "user789",
    review: "경치가 뛰어나고 음식도 훌륭한 곳",
    createdAt: "2023-04-10T18:45:00",
    placePinCnt: 55,
    roadNameAddress: "서울특별시 용산구 또 다른 곳",
    placeName: "전망 좋은 레스토랑",
    latitude: 37.5283,
    longitude: 126.9827,
    starred: true,
    category: "레스토랑",
    tags: ["전망", "고급", "스테이크"],
    collectionTitle: "서울 미식 탐방",
    imagePaths: ["image_path6.jpg", "image_path7.jpg", "image_path8.jpg"],
  },
];

export default function PinPage({ pinId }: { pinId?: string }) {
  return (
    <>
      {pinId}
      <PinCard pinData={pinData}>
        {commentList && (
          <>
            {commentList.map((comment) => (
              <li key={comment.id}>
                <ReviewCard reviewData={comment} />
              </li>
            ))}
          </>
        )}
      </PinCard>
    </>
  );
}
