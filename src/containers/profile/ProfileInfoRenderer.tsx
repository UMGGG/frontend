"use client";
import styles from "@/styles/containers/profile/_profilePage.module.scss";
import { SettingIcon } from "@/components/IconSvg";
import { ProfileOthers } from "@/types/Profile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import fetchPostFollow from "@/utils/members/fetchPostFollow";
import fetchDeleteFollow from "@/utils/members/fetchDeleteFollow";
import { useGetMyProfile } from "@/hooks/myProfileHooks";
import MultilineTextRenderer from "@/components/MultilineTextRenderer";

const ProfileInfoRenderer = ({
  userId,
  profileInfo,
  errorMessage,
  isMyProfile,
}: {
  userId: number;
  profileInfo: ProfileOthers | null;
  errorMessage: string;
  isMyProfile: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const myProfile = useGetMyProfile();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const router = useRouter();

  const handleClickFollowButton = async () => {
    if (!myProfile) {
      router.push("/login");
      return;
    }
    if (profileInfo && !isLoading && !isMyProfile) {
      setIsLoading(true);
      const { success, errorMessage } = await fetchPostFollow(userId);
      if (!success) {
        console.error(errorMessage);
      } else {
        profileInfo.followerCnt++;
        setIsFollowed(true);
      }
      setIsLoading(false);
    }
  };

  const handleClickUnfollowButton = async () => {
    if (!myProfile) {
      router.push("/login");
      return;
    }
    if (profileInfo && !isLoading && !isMyProfile) {
      setIsLoading(true);
      const { success, errorMessage } = await fetchDeleteFollow(userId);
      if (!success) {
        console.error(errorMessage);
      } else {
        profileInfo.followerCnt--;
        setIsFollowed(false);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profileInfo) setIsFollowed(profileInfo.followed);
  }, [profileInfo]);

  return (
    <section id={styles.profileDataContainer}>
      {!profileInfo ? (
        `${errorMessage}`
      ) : (
        <div className={styles.profileData}>
          <Image
            src={profileInfo.avatar}
            alt="profile img"
            className={styles.profileImage}
            width={100}
            height={100}
          />
          <div className={styles.profileName}>
            <div></div>
            <div className={styles.names}>
              <div className={styles.name}>{profileInfo.name}</div>
              <div
                className={styles.membername}
              >{`@${profileInfo.membername}`}</div>
            </div>
            {!myProfile ? (
              <></>
            ) : isMyProfile ? (
              <Link href={"/profile/setting"}>
                <SettingIcon className={styles.icon} />
              </Link>
            ) : isFollowed ? (
              <button
                className={styles.followButton}
                onClick={handleClickUnfollowButton}
                disabled={isLoading}
              >
                팔로우 취소
              </button>
            ) : (
              <button
                className={styles.followButton}
                onClick={handleClickFollowButton}
                disabled={isLoading}
              >
                팔로우
              </button>
            )}
            <p className={styles.bio}>
              <MultilineTextRenderer text={profileInfo.bio} />
            </p>
          </div>
          <div className={styles.profileLog}>
            <div className={styles.profileLogBox}>
              <b className={styles.number}>{profileInfo.collectionCnt}</b>
              <p className={styles.text}>컬렉션</p>
            </div>
            <div className={styles.profileLogBox}>
              <b className={styles.number}>
                {profileInfo.scrappedCollectionCnt}
              </b>
              <p className={styles.text}>스크랩</p>
            </div>
            {isMyProfile ? (
              <Link className={styles.profileLogBox} href={`/profile/follow`}>
                <b className={styles.number}>{profileInfo.followerCnt}</b>
                <p className={styles.text}>팔로워</p>
              </Link>
            ) : (
              <div className={styles.profileLogBox}>
                <b className={styles.number}>{profileInfo.followerCnt}</b>
                <p className={styles.text}>팔로워</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default ProfileInfoRenderer;
