import MarkerData from "@/types/Marker";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMarkerData(count: number): MarkerData[] {
  const markerData: MarkerData[] = [];
  const placeNames = ['치킨가게 ', '라멘가게 ', '고기집 ', '디저트카페 ', '횟집 '];

  for (let i = 1; i <= count; i++) {
    const id = i;
    const placeId = i * 10;
    const placeName = placeNames[getRandomNumber(0, placeNames.length - 1)];
    const pinCount = getRandomNumber(0, 200);
    const latitude = getRandomNumber(33000, 38500) / 1000; // 위도
    const longitude = getRandomNumber(125000, 131000) / 1000; // 경도

    markerData.push({ id, placeId, placeName, pinCount, latitude, longitude });
  }

  return markerData;
}

export {generateMarkerData}

