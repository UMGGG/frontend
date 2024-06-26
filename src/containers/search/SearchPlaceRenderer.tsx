"use client";

import { useAppDispatch } from "@/redux/hooks";
import { useState, useRef, useEffect } from "react";
import useIntersectionObserver from "@/hooks/useInteresectionObserver";
import { PlaceDetail } from "@/types/Place";
import styles from "@/styles/containers/search/_searchPage.module.scss";
import PlaceCard from "@/components/PlaceCard";
import BouncingLoader from "@/components/BouncingLoader";
import fetchGetSearchPlace from "@/utils/search/fetchGetSearchPlace";
import {
  markerDataByAmount,
  cleanSelectedCollectionByAmount,
} from "@/redux/locationSlice";
import { RangeFilter } from "./SearchPage";
import { SearchRangeFilter } from "@/types/SearchRangeFilter";
import MarkerData from "@/types/Marker";

export default function SearchPlaceRender({
  searchKeyword,
  rangeFilter,
  mapRange,
  setRangeFilterType,
}: {
  searchKeyword: string;
  rangeFilter: RangeFilter;
  mapRange: SearchRangeFilter | null;
  setRangeFilterType: (rangeFilter: RangeFilter) => void;
}) {
  const dispatch = useAppDispatch();

  const pageNum = useRef(0);
  const pageEndDiv = useRef<HTMLDivElement>(null);
  const [placeDatas, setPlaceDatas] = useState<PlaceDetail[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const option = {
    root: null,
    rootMargin: "0px", // viewport 기준으로 얼마나 더 감지할 것인가
    threshold: 0.5, // 0.0 ~ 1.0, 1.0이면 완전히 보이는 상태
  };
  const isIntersecting = useIntersectionObserver(pageEndDiv, option);

  const resetSearch = () => {
    pageNum.current = 0;
    setPlaceDatas([]);
    setIsEnd(false);
    setIsLoading(false);
    setErrorMessage("");
  };

  useEffect(() => {
    resetSearch();
  }, [searchKeyword, rangeFilter, mapRange]);

  useEffect(() => {
    if (isIntersecting && !isLoading && !isEnd) {
      searchPlace(searchKeyword);
    }
  }, [isIntersecting, searchKeyword, isEnd]);

  const searchPlace = async (searchKeyword: string) => {
    const size = 10;
    const page = pageNum.current;
    const filter: SearchRangeFilter | null = mapRange;

    if (isLoading || isEnd) return;
    setIsLoading(true);
    const { placeDatas: newPlaceDatas, errorMessage } =
      await fetchGetSearchPlace(searchKeyword, page, size, filter);
    if (newPlaceDatas.length > 0) {
      setPlaceDatas((prev) => [...prev, ...newPlaceDatas]);
      pageNum.current += 1;
      makeMarker([...placeDatas, ...newPlaceDatas]);
    } else {
      setErrorMessage(errorMessage);
      setIsEnd(true);
    }
    setIsLoading(false);
  };

  const onClickRangeFilter = (rangeFilter: RangeFilter) => {
    setRangeFilterType(rangeFilter);
  };

  const makeMarker = (placeDatas: PlaceDetail[]) => {
    // 마커 리스트를 생성하고 Map에 전달 및 center 좌표 변경
    if (!placeDatas) return;
    const markerList: MarkerData[] = [];
    for (let i = 0; i < placeDatas.length; i++) {
      markerList.push({
        id: placeDatas[i].id,
        placeId: placeDatas[i].id,
        placeName: placeDatas[i].name,
        pinCount: placeDatas[i].placePinCnt,
        latitude: placeDatas[i].latitude,
        longitude: placeDatas[i].longitude,
      });
    }
    dispatch(markerDataByAmount(markerList));
    dispatch(cleanSelectedCollectionByAmount(true));
  };

  return (
    <section className={styles.searchListContainer}>
      <div className={styles.rangeButtons}>
        {rangeFilter == RangeFilter.MAP ? (
          <>
            <button
              className={styles.active}
              onClick={() => onClickRangeFilter(RangeFilter.MAP)}
            >
              지도범위
            </button>
            <button
              className={styles.deactive}
              onClick={() => onClickRangeFilter(RangeFilter.ALL)}
            >
              전체
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.deactive}
              onClick={() => onClickRangeFilter(RangeFilter.MAP)}
            >
              지도범위
            </button>
            <button
              className={styles.active}
              onClick={() => onClickRangeFilter(RangeFilter.ALL)}
            >
              전체
            </button>
          </>
        )}
      </div>
      {placeDatas.length === 0 ? (
        isLoading ? (
          <BouncingLoader />
        ) : (
          <p className={styles.searchMessage}>{errorMessage}</p>
        )
      ) : (
        <>
          {placeDatas.map((data, index) => (
            <PlaceCard key={index} place={data} />
          ))}
          {isLoading && <BouncingLoader />}
        </>
      )}
      <br />
      <div
        ref={pageEndDiv}
        style={{ height: "5px", display: `${isEnd ? "none" : "block"}` }}
      ></div>
    </section>
  );
}
