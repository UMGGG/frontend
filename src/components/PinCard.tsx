"use client";

import styles from "@/styles/components/_pincard.module.scss";
import { AddRoundIcon, EditIcon, PinIcon } from "@/components/IconSvg";
import Pin from "@/types/Pin";
import { MyReviewCard } from "./ReviewCard";
import { HTMLAttributes, useRef, useState } from "react";
import Link from "next/link";
import { makeMarker } from "@/utils/map/makeMarker";
import { PlatformType } from "@/types/Report";

// pinEdit
import { useRouter } from "next/navigation";
import { initialPinEditState } from "@/redux/pinEditSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useCheckIsMyId } from "@/hooks/myProfileHooks";

export { PinCard, SimplePinCard };

interface PinCardProps extends HTMLAttributes<HTMLDivElement> {
  pinData: Pin;
  showReview?: boolean;
  showSubButtons?: boolean;
  showCollectionTitle?: boolean;
}
export default function PinCard({
  pinData,
  showReview = true,
  showSubButtons = true,
  showCollectionTitle = false,
  ...props
}: PinCardProps) {
  const dispatch = useAppDispatch();
  const isMyId = useCheckIsMyId(pinData.writerId || -1);

  return (
    <article className={styles.pinCard} {...props}>
      <div className={styles.mainInfo}>
        <PinIcon className={styles.pinIcon} />
        {showCollectionTitle ? (
          <Link
            href={`/collection/${pinData.collectionId}`}
            className={styles.collectionTitle}
          >
            {`${pinData.collectionTitle}`}
          </Link>
        ) : (
          <></>
        )}
        <button className={styles.placeNameContainer}>
          <h3 className={styles.placeName}>{pinData.placeName}</h3>
          <span className={styles.category}>{pinData.category}</span>
        </button>
        <address className={styles.address}>{pinData.roadNameAddress}</address>
        <div className={styles.tagContainer}>
          {pinData.tags.map((tag, idx) => (
            <span key={idx}>{tag}</span>
          ))}
        </div>
        {showSubButtons && (
          <div className={styles.buttonContainer}>
            <Link href={`/collection/select?placeId=${pinData.placeId}`}>
              {`컬렉션에 추가하기`}
              <AddRoundIcon />
            </Link>
            <Link href={`/place/${pinData.placeId}`}>
              {`장소 더보기`}
              <AddRoundIcon />
            </Link>
            <button
              onClick={(e) => {
                makeMarker(
                  pinData.id,
                  pinData.placeId,
                  pinData.placeName,
                  pinData.placePinCnt,
                  pinData.latitude,
                  pinData.longitude,
                  dispatch
                );
              }}
            >
              {`지도에서 보기`}
              <AddRoundIcon />
            </button>
          </div>
        )}
      </div>
      {showReview && (pinData.review || pinData.imagePaths.length) ? (
        <ul className={styles.commentContaier}>
          <MyReviewCard reviewData={pinData} />
        </ul>
      ) : (
        <></>
      )}
      <div className={styles.miniButton}>
        {isMyId && (
          <SubButton pinId={pinData.id} pinData={pinData} isMine={isMyId} />
        )}
      </div>
      <div className={styles.createdAt}>{pinData.createdAt}</div>
    </article>
  );
}

interface SimplePinCardProps extends HTMLAttributes<HTMLDivElement> {
  pinData: Pin;
  className?: string;
  showSubButtons?: boolean;
  buttonDisabled?: boolean;
  activeShowDetail?: boolean;
}
const SimplePinCard = ({
  pinData,
  className,
  showSubButtons = false,
  buttonDisabled = false,
  activeShowDetail = false,
  ...props
}: SimplePinCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showDetail, setShowDetail] = useState(false);
  const dispatch = useAppDispatch();
  const isMyId = useCheckIsMyId(pinData.writerId || -1);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("click");
    if (activeShowDetail) setShowDetail(!showDetail);
    if (activeShowDetail && !showDetail) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.onClick?.(e);
  };

  return (
    <article
      className={`${styles.simplePinCard} ${className}`}
      ref={ref}
      {...props}
      onClick={onClick}
    >
      {!showDetail ? (
        <div className={styles.simpleMainInfo}>
          <PinIcon className={styles.pinIcon} />
          <button
            className={styles.placeNameContainer}
            disabled={buttonDisabled}
          >
            <h3 className={styles.placeName}>{pinData.placeName}</h3>
            <span className={styles.category}>{pinData.category}</span>
            <address className={styles.address}>
              {pinData.roadNameAddress}
            </address>
          </button>
          {/* {isMyId && <EditButton pinId={pinData.id} pinData={pinData} />} */}
        </div>
      ) : (
        <div className={styles.mainInfo}>
          <PinIcon className={styles.pinIcon} />
          <button className={styles.placeNameContainer}>
            <h3 className={styles.placeName}>{pinData.placeName}</h3>
            <span className={styles.category}>{pinData.category}</span>
          </button>
          <address className={styles.address}>
            {pinData.roadNameAddress}
          </address>
          <div className={styles.tagContainer}>
            {pinData.tags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
          <ul className={styles.commentContaier}>
            <MyReviewCard reviewData={pinData} />
          </ul>
          <SubButton pinId={pinData.id} pinData={pinData} isMine={isMyId} />
        </div>
      )}
      {showSubButtons && (
        <div className={styles.buttonContainer}>
          <Link href={`/collection/select?placeId=${pinData.placeId}`}>
            {`컬렉션에 추가하기`}
            <AddRoundIcon />
          </Link>
          <Link href={`/place/${pinData.placeId}`}>
            {`장소 더보기`}
            <AddRoundIcon />
          </Link>
          <button
            onClick={(e) => {
              makeMarker(
                pinData.id,
                pinData.placeId,
                pinData.placeName,
                1,
                pinData.latitude,
                pinData.longitude,
                dispatch
              );
            }}
          >
            {`지도에서 보기`}
            <AddRoundIcon />
          </button>
        </div>
      )}
    </article>
  );
};

// Utils

const SubButton = ({
  pinId,
  pinData,
  isMine,
}: {
  pinId: number;
  pinData: Pin;
  isMine: boolean;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    // redux
    if (pinData) {
      dispatch(initialPinEditState(pinData));
    }
    router.push(`/pin/edit/${pinId}`);
  };

  return isMine ? (
    <button className={styles.editButton} onClick={handleClick}>
      <EditIcon />
    </button>
  ) : (
    <Link
      className={styles.editButton}
      href={`/report?type=${PlatformType.PIN}&id=${pinData.id}`}
    >
      <span>신고</span>
    </Link>
  );
};
