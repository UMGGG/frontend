import APIResponse from "@/types/APIResponse";
import { PlaceDetail } from "@/types/Place";
import { logout } from "@/hooks/useLogout";
import { SearchRangeFilter } from "@/types/SearchRangeFilter";

const fetchGetSearchPlace = async (
  searchKeyword: string,
  page: number = 0,
  size: number = 10,
  filter?: SearchRangeFilter | null
): Promise<{
  placeDatas: PlaceDetail[];
  errorMessage: string;
}> => {
  const reqeustUrl = filter
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/search/places?query=${searchKeyword}&page=${page}&size=${size}&filter=${filter.leftBottomLatitude},${filter.leftBottomLongitude},${filter.rightTopLatitude},${filter.rightTopLongitude}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/search/places?query=${searchKeyword}&page=${page}&size=${size}`;
  try {
    const res = await fetch(reqeustUrl, {
      credentials: "include",
    });
    if (res.status === 401) {
      logout();
      return {
        placeDatas: [],
        errorMessage: "로그인이 필요합니다.",
      };
    }
    if (!res.ok) throw new Error("검색에 실패했습니다.");
    const data: APIResponse = await res.json();
    if (data.metadata.resultCount == 0) {
      return {
        placeDatas: [],
        errorMessage: "검색 키워드에 맞는 장소가 없습니다.",
      };
    }
    const placeDatas: PlaceDetail[] = data.results;
    return { placeDatas, errorMessage: "" };
  } catch (err: any) {
    console.error(err);
    return {
      placeDatas: [],
      errorMessage: "검색에 실패했습니다.",
    };
  }
};
export default fetchGetSearchPlace;
