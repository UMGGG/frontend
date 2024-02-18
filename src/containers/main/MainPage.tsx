"use client";

import { LogoHorizontal } from "../../components/LogoSvg";
import styles from "@/styles/containers/main/_mainPage.module.scss";
import { useState } from "react";
import CardSlider from "@/components/CardSlider";

export default function MainPage() {
  const [inputCollectionSearch, setInputCollectionSearch] = useState("");
  const onChangeCollection = (e: any) => {
    setInputCollectionSearch(e.target.value);
  };

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
            placeholder="다른 사람의 컬렉션을 검색해 보세요 !  추천 키워드  :  강릉, 맛집,  디저트 ... !"
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
          <CardSlider scrollCardNumber={5}>
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
          </CardSlider>
        </section>
        <section className={styles.popularTop}>
          <p className={styles.popularTopText}>별로 안 추천 컬렉션 TOP10</p>
          <CardSlider scrollCardNumber={5}>
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
          </CardSlider>
        </section>
        <section className={styles.popularTop}>
          <p className={styles.popularTopText}>적당히 추천 컬렉션 TOP10</p>
          <CardSlider scrollCardNumber={5}>
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
            <img src="https://picsum.photos/170/200" alt="image" />
          </CardSlider>
        </section>
      </section>
    </section>
  );
}
