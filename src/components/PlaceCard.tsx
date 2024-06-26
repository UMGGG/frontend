"use client";

import styles from "@/styles/components/_placecard.module.scss";
import {
  AddRoundIcon,
  LocationIcon,
  PinFillIcon,
  PinIcon,
  StarIcon,
  ZimmIcon,
} from "@/components/IconSvg";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Place, { PlaceDetail, PlaceStarred } from "@/types/Place";
import { useState } from "react";
import { StarFilledIcon } from "@/components/IconSvg";
import fetchPostStarPlace from "@/utils/stars/fetchPostStarPlace";
import fetchDeleteStarPlace from "@/utils/stars/fetchDeleteStarPlace";

import { useAppDispatch } from "@/redux/hooks";
import { addAlertMessage } from "@/redux/globalAlertSlice";
import { makeMarker } from "@/utils/map/makeMarker";

export { PlaceCard, SimplePlaceCard };

const PlaceCard = ({ place }: { place: PlaceDetail | PlaceStarred }) => {
  const dispatchMarker = useAppDispatch();
  const router = useRouter();
  return (
    <article className={styles.placeCard}>
      {"starred" in place && (
        <div className={styles.starredContainer}>
          <Starred placeId={place.id} starred={place.starred ? true : false} />
        </div>
      )}

      <div className={styles.mainInfo}>
        <LocationIcon className={styles.pinIcon} />
        <button
          //href={`/place/${place.id}`}
          className={styles.placeNameContainer}
          // aria-label={`${place.name} - ${place.category}`}
          onClick={(e) => {
            makeMarker(
              place.id,
              place.id,
              place.name,
              place.placePinCnt,
              place.latitude,
              place.longitude,
              dispatchMarker
            );
            router.push(`/place/${place.id}`);
          }}
        >
          <h3 className={styles.placeName}>{place.name}</h3>
          <span className={styles.category}>{place.category}</span>
        </button>
        <address className={styles.address}>{place.roadNameAddress}</address>
        <div className={styles.buttonContainer}>
          <div className={styles.pinCnt}>
            {`${place.placePinCnt}개 핀`}
            <PinIcon />
          </div>
          <Link href={`/collection/select?placeId=${place.id}`}>
            {`컬렉션에 추가하기`}
            <AddRoundIcon />
          </Link>
          <button
            onClick={(e) => {
              makeMarker(
                place.id,
                place.id,
                place.name,
                place.placePinCnt,
                place.latitude,
                place.longitude,
                dispatchMarker
              );
            }}
          >
            {`지도에서 보기`}
            <AddRoundIcon />
          </button>
        </div>
      </div>
    </article>
  );
};
export default PlaceCard;

const SimplePlaceCard = ({
  place,
}: {
  place: PlaceDetail | PlaceStarred;
  phoneNumber?: string;
}) => {
  return (
    <article className={styles.simplePlaceCard}>
      <div className={styles.titleContainer}>
        {/* <LocationIcon className={styles.pinIcon} /> */}
        <h3 className={styles.placeName}>{place.name}</h3>
        <span className={styles.category}>{place.category}</span>
      </div>
      {/* <div className={styles.subDataContainer}> */}
      <address className={styles.address}>{place.roadNameAddress}</address>
      {place.placePinCnt ? (
        <div className={styles.pinCnt}>
          <PinIcon />
          <div>{`${place.placePinCnt}개 핀`}</div>
        </div>
      ) : null}
      {/* </div> */}
    </article>
  );
};

/* utils */
const Starred = ({
  placeId,
  starred,
}: {
  placeId: number;
  starred: boolean;
}) => {
  const [isStared, setIsStarred] = useState(starred ? starred : false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleStar = () => {
    if (isStared) {
      unStarPlace();
    } else {
      starPlace();
    }
  };

  const starPlace = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { success, errorMessage } = await fetchPostStarPlace(placeId);
    if (!success) {
      dispatch(addAlertMessage(errorMessage));
    } else {
      setIsStarred(!isStared);
    }
    setIsLoading(false);
  };

  const unStarPlace = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { success, errorMessage } = await fetchDeleteStarPlace(placeId); //
    if (!success) {
      dispatch(addAlertMessage(errorMessage));
    } else {
      setIsStarred(!isStared);
    }
    setIsLoading(false);
  };

  return isStared ? (
    <StarFilledIcon className={styles.starred} onClick={handleStar} />
  ) : (
    <StarIcon onClick={handleStar} />
  );
};
