const collection: CollectionDetail = {
  id: 1,
  title: "강릉 주민 맛집 맛집 맛집!",
  writerId: 1,
  writerMembername: "잠자는_짱구의_콧털",
  thumbnail: "https://picsum.photos/id/326/300",
  // details: "강릉 주민들이 자주 가는 맛집 모음집입니다.",
  details:
    "이백오십짜짜리 컬렉션 설명이다 이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션 설명이다이백오십짜짜리 컬렉션",
  likeCnt: 12,
  pinCnt: 5,
  scrapCnt: 3,
  scrapped: true,
  liked: false,
  tags: ["강릉", "맛집", "주민"],
};

const pinData: Pin = {
  id: 1,
  placeId: 13,
  collectionId: 1,
  writerMembername: "잠자는_짱구의_콧털",
  review: "포카리스웨트 강남역점은 맛있는 음식을 먹을 수 있는 곳입니다.",
  createdAt: "2021-08-01",
  saveCnt: 3,
  roadNameAddress: "서울특별시 강남구 역삼동 123-45",
  placeName: "포카리스웨트 강남역점",
  latitude: 37.123456,
  longitude: 127.123456,
  starred: true,
  category: "FOOD",
  tags: ["포카리스웨트", "강남역점"],
  imagePaths: [
    "https://picsum.photos/200",
    "https://picsum.photos/200",
    "https://picsum.photos/200",
  ],
  collectionTitle: "강릉 주민 맛집",
};

const reviewData: Pin = {
  id: 1,
  placeId: 13,
  collectionId: 2,
  writerMembername: "JaneDoe",
  review: "Great place to visit, loved the atmosphere!",
  createdAt: "2023-01-20T14:30:00Z",
  saveCnt: 42,
  roadNameAddress: "123 Main St, Anytown, AN",
  placeName: "Coffee Corner",
  latitude: 37.5665,
  longitude: 126.978,
  starred: true,
  category: "Cafe",
  tags: ["coffee", "cozy", "wifi"],
  collectionTitle: "Favorite Spots",
  imagePaths: [
    "https://picsum.photos/200",
    "https://picsum.photos/200",
    "https://picsum.photos/200",
  ],
  // collectionTitle: "강릉 주민 맛집",
};

const commentList: Pin[] = [
  {
    id: 1,
    placeId: 13,
    collectionId: 1,
    writerMembername: "user123",
    review: "아름다운 경치와 맛있는 음식",
    createdAt: "2023-02-15T12:34:56",
    saveCnt: 25,
    roadNameAddress: "서울특별시 강남구 어딘가",
    placeName: "멋진 카페 멋진 카페 멋진 카페 멋진 카페",
    latitude: 37.1234,
    longitude: 127.1234,
    starred: true,
    category: "카페",
    tags: ["커피", "디저트", "휴식"],
    collectionTitle: "서울 핫플레이스",
    imagePaths: [
      "https://picsum.photos/200",
      "https://picsum.photos/200",
      "https://picsum.photos/200",
    ],
  },
  {
    id: 2,
    placeId: 13,
    collectionId: 2,
    writerMembername: "user456",
    review: "편안한 분위기에서 즐기는 최고의 커피",
    createdAt: "2023-03-01T15:20:30",
    saveCnt: 40,
    roadNameAddress:
      "서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳",
    placeName: "조용한 북카페",
    latitude: 37.5759,
    longitude: 126.9769,
    starred: false,
    category: "북카페",
    tags: ["책", "커피", "조용함"],
    collectionTitle: "서울의 숨겨진 보석",
    imagePaths: [],
    // imagePaths: ["https://picsum.photos/200", "https://picsum.photos/200"],
  },
  {
    id: 3,
    placeId: 13,
    collectionId: 3,
    writerMembername: "user789",
    review: "경치가 뛰어나고 음식도 훌륭한 곳",
    createdAt: "2023-04-10T18:45:00",
    saveCnt: 55,
    roadNameAddress: "서울특별시 용산구 또 다른 곳",
    placeName: "전망 좋은 레스토랑",
    latitude: 37.5283,
    longitude: 126.9827,
    starred: true,
    category: "레스토랑",
    tags: ["전망", "고급", "스테이크"],
    collectionTitle: "서울 미식 탐방",
    imagePaths: ["https://picsum.photos/200", "https://picsum.photos/200"],
  },
  {
    id: 4,
    placeId: 13,
    collectionId: 1,
    writerMembername: "user123",
    review: "아름다운 경치와 맛있는 음식",
    createdAt: "2023-02-15T12:34:56",
    saveCnt: 25,
    roadNameAddress: "서울특별시 강남구 어딘가",
    placeName: "멋진 카페 멋진 카페 멋진 카페 멋진 카페",
    latitude: 37.1234,
    longitude: 127.1234,
    starred: true,
    category: "카페",
    tags: ["커피", "디저트", "휴식"],
    collectionTitle: "서울 핫플레이스",
    imagePaths: [
      "https://picsum.photos/200",
      "https://picsum.photos/200",
      "https://picsum.photos/200",
    ],
  },
  {
    id: 5,
    placeId: 13,
    collectionId: 2,
    writerMembername: "user456",
    review: "편안한 분위기에서 즐기는 최고의 커피",
    createdAt: "2023-03-01T15:20:30",
    saveCnt: 40,
    roadNameAddress:
      "서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳",
    placeName: "조용한 북카페",
    latitude: 37.5759,
    longitude: 126.9769,
    starred: false,
    category: "북카페",
    tags: ["책", "커피", "조용함"],
    collectionTitle: "서울의 숨겨진 보석",
    imagePaths: [],
    // imagePaths: ["https://picsum.photos/200", "https://picsum.photos/200"],
  },
  {
    id: 6,
    placeId: 13,
    collectionId: 3,
    writerMembername: "user789",
    review: "경치가 뛰어나고 음식도 훌륭한 곳",
    createdAt: "2023-04-10T18:45:00",
    saveCnt: 55,
    roadNameAddress: "서울특별시 용산구 또 다른 곳",
    placeName: "전망 좋은 레스토랑",
    latitude: 37.5283,
    longitude: 126.9827,
    starred: true,
    category: "레스토랑",
    tags: ["전망", "고급", "스테이크"],
    collectionTitle: "서울 미식 탐방",
    imagePaths: ["https://picsum.photos/200", "https://picsum.photos/200"],
  },
  {
    id: 7,
    placeId: 13,
    collectionId: 1,
    writerMembername: "user123",
    review: "아름다운 경치와 맛있는 음식",
    createdAt: "2023-02-15T12:34:56",
    saveCnt: 25,
    roadNameAddress: "서울특별시 강남구 어딘가",
    placeName: "멋진 카페 멋진 카페 멋진 카페 멋진 카페",
    latitude: 37.1234,
    longitude: 127.1234,
    starred: true,
    category: "카페",
    tags: ["커피", "디저트", "휴식"],
    collectionTitle: "서울 핫플레이스",
    imagePaths: [
      "https://picsum.photos/200",
      "https://picsum.photos/200",
      "https://picsum.photos/200",
    ],
  },
  {
    id: 8,
    placeId: 13,
    collectionId: 2,
    writerMembername: "user456",
    review: "편안한 분위기에서 즐기는 최고의 커피",
    createdAt: "2023-03-01T15:20:30",
    saveCnt: 40,
    roadNameAddress:
      "서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳 서울특별시 종로구 다른 곳",
    placeName: "조용한 북카페",
    latitude: 37.5759,
    longitude: 126.9769,
    starred: false,
    category: "북카페",
    tags: ["책", "커피", "조용함"],
    collectionTitle: "서울의 숨겨진 보석",
    imagePaths: [],
    // imagePaths: ["https://picsum.photos/200", "https://picsum.photos/200"],
  },
  {
    id: 9,
    placeId: 13,
    collectionId: 3,
    writerMembername: "user789",
    review: "경치가 뛰어나고 음식도 훌륭한 곳",
    createdAt: "2023-04-10T18:45:00",
    saveCnt: 55,
    roadNameAddress: "서울특별시 용산구 또 다른 곳",
    placeName: "전망 좋은 레스토랑",
    latitude: 37.5283,
    longitude: 126.9827,
    starred: true,
    category: "레스토랑",
    tags: ["전망", "고급", "스테이크"],
    collectionTitle: "서울 미식 탐방",
    imagePaths: ["https://picsum.photos/200", "https://picsum.photos/200"],
  },
];

import styles from "@/styles/containers/main/_recommendCollectionCard.module.scss";
import { CollectionDetail } from "@/types/Collection";
import Pin from "@/types/Pin";

import RecommendCollectionCard from "@/containers/main/RecommendCollectionCard";

export default function Page() {
  return (
    <div className={styles.page}>
      <RecommendCollectionCard collection={collection} pinList={commentList} />
    </div>
  );
}
