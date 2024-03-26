"use client";

import { LogoHorizontal } from "../../components/LogoSvg";
import styles from "@/styles/containers/main/_mainPage.module.scss";
import { useEffect, useState } from "react";
import CardSlider2 from "@/components/CardSlider2";
import CardSlider from "@/components/CardSlider";
import GlobalAlertModal from "@/components/GlobalAlertModal";
import {
  DefaultCollectionCard,
  SimpleCollectionCard,
} from "@/components/CollectionCard";
import { CollectionDetail } from "@/types/Collection";
import { DefaultCollectionSkeleton } from "@/components/loading/SkeletonImage";

export default function MainPage() {
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [inputCollectionSearch, setInputCollectionSearch] = useState("");
  const [topCollectionDatas, setTopCollectionDatas] = useState<
    CollectionDetail[]
  >([]);
  const [
    officialRecomendedCollectionDatas,
    setOfficialRecomendedCollectionDatas,
  ] = useState<CollectionDetail[]>([]);
  const onChangeCollection = (e: any) => {
    setInputCollectionSearch(e.target.value);
  };

  const SkeletonRenderer = () => {
    return (
      <CardSlider scrollCardNumber={1}>
        <DefaultCollectionSkeleton />
        <DefaultCollectionSkeleton />
        <DefaultCollectionSkeleton />
        <DefaultCollectionSkeleton />
      </CardSlider>
    );
  };

  const getTopCollectionData = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/collections/top?cnt=10`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Top10 컬렉션 정보 가져오기를 실패했습니다.`);
        }
        return res.json();
      })
      .then((res) => {
        setTopCollectionDatas(res.results);
        setIsLoading1(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getOfficialCollectionData = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/members/12/collections?page=0&size=20`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`12 컬렉션 정보 가져오기를 실패했습니다.`);
        }
        return res.json();
      })
      .then((res) => {
        setOfficialRecomendedCollectionDatas(res.results);
        setIsLoading2(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getTopCollectionData();
    getOfficialCollectionData();
  }, []);

  return (
    <section className={styles.container}>
      <section className={styles.topper}>
        <LogoHorizontal />
        <div className={styles.inputContainer}>
          <button className={styles.inputButton}>
            <img
              src="/icon/search_plain.svg"
              alt="search icon"
              className={styles.icon}
            />
          </button>
          <input
            className={styles.input}
            onChange={onChangeCollection}
            value={inputCollectionSearch}
            placeholder="다른 사람의 컬렉션을 검색해 보세요 ! 강릉, 맛집,  디저트 ... !"
          />
          <select className={styles.selectSearchType}>
            <option value="0">전체 검색</option>
            <option value="1">컬렉션 검색</option>
            <option value="2">핀 검색</option>
            <option value="3">장소 검색</option>
          </select>
        </div>
      </section>
      <section className={styles.gradationBox}>
        <p>
          내가 좋아하는 <b>장소</b>에 <b>핀</b>을 찍고
          <br />
          <b>컬렉션</b>을 만들고, 친구들과 공유해보세요!
        </p>
      </section>
      <section className={styles.recommendCard}>
        <CardSlider scrollCardNumber={2}>
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
          <img src="https://picsum.photos/500/300" alt="image" />
        </CardSlider>
      </section>
      <section className={styles.recommendListContainer}>
        <section className={styles.popularTop}>
          <p className={styles.popularTopText}>인기 추천 컬렉션 TOP10</p>
          <div className={styles.popularTopSlider}></div>
          {isLoading1 ? (
            <CardSlider>
              {topCollectionDatas.map((collection, index) => (
                <DefaultCollectionCard
                  key={index}
                  collectionData={collection}
                  linkDisabled={true}
                />
              ))}
            </CardSlider>
          ) : (
            <SkeletonRenderer />
          )}
          <div />
        </section>
        <section className={styles.popularTop}>
          <p className={styles.popularTopText}>수석 디자이너의 컬렉션 추천</p>
          <div className={styles.popularTopSlider}>
            {isLoading2 ? (
              <CardSlider>
                {officialRecomendedCollectionDatas.map((collection, index) => (
                  <DefaultCollectionCard
                    key={index}
                    collectionData={collection}
                    linkDisabled={true}
                  />
                ))}
              </CardSlider>
            ) : (
              <SkeletonRenderer />
            )}
          </div>
        </section>
        <section className={styles.popularTop}>
          <p className={styles.popularTopText}>적당히 추천 컬렉션 TOP10</p>
          <div className={styles.popularTopSlider}></div>
          <CardSlider scrollCardNumber={5}>
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
          </CardSlider>
          <div />
        </section>
      </section>
      <GlobalAlertModal />
    </section>
  );
}
