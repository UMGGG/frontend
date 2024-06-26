"use client";

import { LogoHorizontal } from "../../components/LogoSvg";
import styles from "@/styles/containers/main/_mainPage.module.scss";

import Link from "next/link";
import { useEffect, useState } from "react";
import CardSlider from "@/components/CardSlider";
import GlobalAlertModal from "@/components/GlobalAlertModal";
import { DefaultCollectionCard } from "@/components/CollectionCard";

import RecommendCollectionCard from "@/containers/main/RecommendCollectionCard";
import fetchGetCollectionInfo from "@/utils/collections/fetchGetCollectionInfo";
import fetchGetCollectionAllPins from "@/utils/collections/fetchGetCollectionAllPins";
import fetchGetTopCollection from "@/utils/collections/fetchGetTopCollection";
import { CollectionDetail } from "@/types/Collection";
import Pin from "@/types/Pin";

import {
  DefaultCollectionSkeleton,
  DetailCollectionSkeleton,
} from "@/components/loading/SkeletonImage";

import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [isLoading3, setIsLoading3] = useState<boolean>(false);
  const [isLoading4, setIsLoading4] = useState<boolean>(false);

  const [inputCollectionSearch, setInputCollectionSearch] = useState("");
  const [topCollectionDatas, setTopCollectionDatas] = useState<
    CollectionDetail[]
  >([]);

  const [michelinCollectionDatas, setMichelinCollectionDatas] =
    useState<CollectionDetail>();
  const [michelinPinDatas, setMichelinPinDatas] = useState<Pin[]>([]);
  const [ddoGanZipCollectionDatas, setDdoGanZipCollectionDatas] =
    useState<CollectionDetail>();
  const [ddoGanZipPinDatas, setDdoGanZipPinDatas] = useState<Pin[]>([]);
  const [bluerCollectionDatas, setBluerCollectionDatas] =
    useState<CollectionDetail>();
  const [bluerPinDatas, setBluerPinDatas] = useState<Pin[]>([]);

  const onChangeCollection = (e: any) => {
    setInputCollectionSearch(e.target.value);
  };

  const SkeletonSliderRenderer = () => {
    return (
      <CardSlider scrollCardNumber={1}>
        <DefaultCollectionSkeleton />
        <DefaultCollectionSkeleton />
        <DefaultCollectionSkeleton />
        <DefaultCollectionSkeleton />
      </CardSlider>
    );
  };

  const SkeletonCollectionRenderer = () => {
    return <DetailCollectionSkeleton />;
  };

  const getTopCollectionData = async (ids: number[]) => {
    const { collectionData, errorMessage } = await fetchGetTopCollection(ids);
    if (!collectionData || errorMessage) {
      console.error(errorMessage);
    } else {
      setTopCollectionDatas(collectionData);
      setIsLoading1(true);
    }
  }

  const getBluerData = async (id: number) => {
    const { collectionInfo, errorMessage } = await fetchGetCollectionInfo(id);
    if (!collectionInfo || errorMessage) {
      console.error(errorMessage);
    } else {
      setBluerCollectionDatas(collectionInfo);
    }
    const { pinList, errorMessage: err } = await fetchGetCollectionAllPins(id);
    if (!pinList || errorMessage) {
      console.error(err);
    } else {
      setBluerPinDatas(pinList);
      setIsLoading3(true);
    }
  };

  const getDdoGanZipData = async (id: number) => {
    const { collectionInfo, errorMessage } = await fetchGetCollectionInfo(id);
    if (!collectionInfo || errorMessage) {
      console.error(errorMessage);
    } else {
      setDdoGanZipCollectionDatas(collectionInfo);
    }
    const { pinList, errorMessage: err } = await fetchGetCollectionAllPins(id);
    if (!pinList || errorMessage) {
      console.error(err);
    } else {
      setDdoGanZipPinDatas(pinList);
      setIsLoading2(true);
    }
  };

  const getMichelinData = async (id: number) => {
    const { collectionInfo, errorMessage } = await fetchGetCollectionInfo(id);
    if (!collectionInfo || errorMessage) {
      console.error(errorMessage);
    } else {
      setMichelinCollectionDatas(collectionInfo);
    }
    const { pinList, errorMessage: err } = await fetchGetCollectionAllPins(id);
    if (!pinList || errorMessage) {
      console.error(err);
    } else {
      setMichelinPinDatas(pinList);
      setIsLoading4(true);
    }
  };

  useEffect(() => {
    getTopCollectionData([146,147,148]);
    getMichelinData(146);
    getDdoGanZipData(147);
    getBluerData(148);
  }, []);

  const enterKeyDown = (e: any) => {
    if (e.key === "Enter" && inputCollectionSearch != "") {
      const keyword = encodeURIComponent(inputCollectionSearch);
      router.push(`/search?keyword=${keyword}`);
    }
  };

  const searchButtonClick = () => {
    if (inputCollectionSearch != "") {
      const keyword = encodeURIComponent(inputCollectionSearch);
      router.push(`/search?keyword=${keyword}`);
    }
  };

  return (
    <section className={styles.alertModalSection}>
      <section className={styles.container}>
        <section className={styles.topper}>
          <LogoHorizontal />
          <div className={styles.inputContainer}>
            <button className={styles.inputButton}>
              <img
                src="/icon/search_plain.svg"
                alt="search icon"
                className={styles.icon}
                onClick={searchButtonClick}
              />
            </button>
            <input
              className={styles.input}
              onChange={onChangeCollection}
              value={inputCollectionSearch}
              placeholder="장소와 컬렉션을 검색해 보세요 ! 강릉, 맛집,  디저트 ... !"
              onKeyDown={enterKeyDown}
            />
          </div>
        </section>
        <section className={styles.gradationBox}>
          <div>
            <span>내가 좋아하는 </span>
            <span className={styles.bold}>장소</span>
            <span>에</span> <span className={styles.bold}>핀</span>
            <span>을 찍고</span>
            <br />
            <span className={styles.bold}>컬렉션</span>
            <span>을 만들고, 친구들과 공유해보세요!</span>
          </div>
        </section>
        {/* <section className={styles.recommendCard}>
          <CardSlider scrollCardNumber={1}>
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
        </section> */}
        <section className={styles.recommendListContainer}>
          <section className={styles.popularTop}>
            <p className={styles.popularTopText}>인기 추천 컬렉션 TOP10</p>
            <div className={styles.cardSliderContainer}>
              {isLoading1 ? (
                <CardSlider scrollCardNumber={2}>
                  {topCollectionDatas.map((collection, index) => (
                    <DefaultCollectionCard
                      key={index}
                      collectionData={collection}
                      // linkDisabled={true}
                    />
                  ))}
                </CardSlider>
              ) : (
                <SkeletonSliderRenderer />
              )}
            </div>
          </section>
          <section className={styles.popularTop} style={{ height: "430px" }}>
            <p className={styles.popularTopText}>미쉐린 가이드 IN 서울</p>
            <div className={styles.recommendCollectionContainer}>
              {isLoading4 && michelinCollectionDatas ? (
                <RecommendCollectionCard
                  collection={michelinCollectionDatas}
                  pinList={michelinPinDatas}
                />
              ) : (
                <SkeletonCollectionRenderer />
              )}
            </div>
          </section>
          <section className={styles.popularTop} style={{ height: "430px" }}>
            <p className={styles.popularTopText}>블루리본 서베이 선정 맛집</p>
            <div className={styles.recommendCollectionContainer}>
              {isLoading3 && bluerCollectionDatas ? (
                <RecommendCollectionCard
                  collection={bluerCollectionDatas}
                  pinList={bluerPinDatas}
                />
              ) : (
                <SkeletonCollectionRenderer />
              )}
            </div>
          </section>
          <section className={styles.popularTop} style={{ height: "430px" }}>
            <p className={styles.popularTopText}>또간집 선정 맛집</p>
            <div className={styles.recommendCollectionContainer}>
              {isLoading2 && ddoGanZipCollectionDatas ? (
                <RecommendCollectionCard
                  collection={ddoGanZipCollectionDatas}
                  pinList={ddoGanZipPinDatas}
                />
              ) : (
                <SkeletonCollectionRenderer />
              )}
            </div>
          </section>
        </section>
        <footer className={styles.footer}>
        <Link href="/policy/terms">서비스 이용약관</Link>
        <p>|</p>
        <Link href="/policy/privacy">개인정보 처리방침</Link>
        <br/>
        <span>문의 : pintogether.ko@gmail.com</span>
      </footer>
      </section>
      <GlobalAlertModal />
    </section>
  );
}
