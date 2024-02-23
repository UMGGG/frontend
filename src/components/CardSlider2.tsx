"use client";

// import styles from "@/styles/components/Cardslider.module.scss";
import {
  useState,
  useRef,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import styles from "@/styles/components/_cardslider2.module.scss";
import pxToRem from "@/utils/pxToRem";

export default function CardSlider2({
  children,
  width,
  height,
  selectedCardId,
  // setSelectedCardId,
}: {
  children: ReactNode[];
  width?: number;
  height?: number;
  selectedCardId?: number;
  // setSelectedCardId?: Dispatch<SetStateAction<number>>;
}) {
  const [isFirstCard, setIsFirstCard] = useState(true);
  const [isLastCard, setIsLastCard] = useState(false);

  const cardContainerRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    showSlide(selectedCardId || 0);
  }, [selectedCardId]);

  // cardRefs를 초기화하고, children 배열의 변화에 따라 업데이트합니다.
  useEffect(() => {
    cardRefs.current = children.map(
      (_, index) => cardRefs.current[index] || null
    );
    setWidthStyle({
      width: width ? width : "100%",
      height: cardRefs.current[0]?.clientHeight
        ? cardRefs.current[0]?.clientHeight
        : "100%",
    });
    const newCardWidth = pxToRem(cardRefs.current[0]?.clientWidth || 0);
    setDefaultScrollSize((newCardWidth || cardWidth) + defaultgap);
    console.log(
      "cardRefs.current[0]?.clientWidth",
      cardRefs.current[0]?.clientWidth
    );
    showSlide(selectedCardId || 0);
  }, [selectedCardId, children.length]);

  const [widthStyle, setWidthStyle] = useState({
    width: width ? width : "100%",
    height: height ? height : "100%",
  });

  const cardWidth = 4; // rem
  const defaultgap = 1;
  const [defaultScrollSize, setDefaultScrollSize] = useState(
    cardWidth + defaultgap
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  const showSlide = (slideIndex: number) => {
    {
      cardRefs.current.forEach((cardRef, index) => {
        if (index === slideIndex) {
          cardRef?.classList.add(styles.activeCard);
          cardRef?.classList.remove(styles.deactiveCard);
        } else {
          cardRef?.classList.remove(styles.activeCard);
          cardRef?.classList.add(styles.deactiveCard);
        }
      });
      setCurrentSlide(slideIndex);
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      let currentScrollSizePx = defaultScrollSize * slideIndex * rootFontSize;
      cardContainerRef.current!.scrollLeft = currentScrollSizePx;

      if (slideIndex <= 0) setIsFirstCard(true);
      else setIsFirstCard(false);
      if (slideIndex >= children.length - 1) setIsLastCard(true);
      else setIsLastCard(false);
    }

    // console.log("aa", selectedCardId, slideIndex);
    // cardId 설정
    // const element = cardRefs?.current[slideIndex];
    // element?.firstChild instanceof HTMLElement
    //   ? element?.firstChild?.click()
    //   : null;

    // if (selectedCardId !== slideIndex) {
    //   const element = cardRefs?.current[slideIndex];
    //   const cardId =
    //     element?.firstChild instanceof Element
    //       ? element.firstChild?.getAttribute("data-cardid")
    //       : null;
    //   console.log("currentSlide", element);
    //   console.log("currentSlide", cardId);
    //   if (setSelectedCardId && cardId) setSelectedCardId(Number(cardId));
    // }
  };

  const handleLeftClick = () => {
    if (isFirstCard) return;
    showSlide(currentSlide - 1);
  };

  const handleRightClick = () => {
    if (isLastCard) return;
    showSlide(currentSlide + 1);
  };

  const handleOnClick = (index: number, test: any) => {
    showSlide(index);
    console.log(test);
  };

  return (
    <section style={widthStyle} className={styles.cardSlider}>
      {/* Card Container */}
      <div className={styles.cardContainer} ref={cardContainerRef}>
        {children?.map((child, index) => {
          if (index === 0) {
            return (
              <article
                key={index}
                className={styles.activeCard}
                // ref={cardRefs.current[index]}
                ref={(el) => (cardRefs.current[index] = el as HTMLDivElement)}
                onClick={() => handleOnClick(index, child)}
              >
                {child}
              </article>
            );
          }
          return (
            <article
              key={index}
              className={styles.deactiveCard}
              // ref={cardRefs.current[index]}
              ref={(el) => (cardRefs.current[index] = el as HTMLDivElement)}
              onClick={() => handleOnClick(index, child)}
            >
              {child}
            </article>
          );
        })}
      </div>
      {/* Left Button */}
      {!isFirstCard && (
        <button className={styles.leftButton} onClick={handleLeftClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}
      {/* Right Button */}
      {!isLastCard && (
        <button className={styles.rightButton} onClick={handleRightClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </section>
  );
}