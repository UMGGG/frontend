"use client";

import { useState, useEffect } from "react";

import styles from "@/styles/containers/profile/_followPage.module.scss";
import SubPageLayout from "@/containers/layout/SubPageLayout";
import { SlideMenu, SlideMenuInnerPage } from "@/components/SlideMenu";
import { ProfileFollower } from "@/types/Profile";
import UserCard from "@/components/UserCard";

import { useGetMyProfile } from "@/hooks/myProfileHooks";
import fetchGetMyFollowers from "@/utils/members/fetchGetMyFollowers";
import fetchGetMyFollowings from "@/utils/members/fetchGetMyFollowings";

const FollowPage = ({ userId }: { userId: number }) => {
  const profile = useGetMyProfile(); // 유저 정보 가져오기

  const [followers, setFollowers] = useState<ProfileFollower[]>([]); // 팔로워 목록
  const [followings, setFollowings] = useState<ProfileFollower[]>([]); // 팔로잉 목록

  const [isLoading, setIsLoading] = useState(false); // 로딩 중 여부
  const [followerErrorMessage, setFollowerErrorMessage] = useState("");
  const [follwingErrorMessage, setFollwingErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!profile || isLoading) return;
      console.log("fetchData");
      setIsLoading(true);
      const { followers, errorMessage } = await fetchGetMyFollowers();
      if (errorMessage || !followers) setFollowerErrorMessage(errorMessage);
      else setFollowers(followers);

      const { followings, errorMessage: errorMessage2 } =
        await fetchGetMyFollowings();
      if (errorMessage2 || !followings) setFollwingErrorMessage(errorMessage2);
      else setFollowings(followings);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <SubPageLayout topperMsg="팔로우">
      <SlideMenu menuTitleList={[`팔로워 목록`, `팔로잉 목록`]}>
        <SlideMenuInnerPage key={0}>
          {followerErrorMessage && (
            <div className={styles.errorMessage}>{followerErrorMessage}</div>
          )}
          <div className={styles.userCardList}>
            {followers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </SlideMenuInnerPage>
        <SlideMenuInnerPage key={1}>
          {follwingErrorMessage && (
            <div className={styles.errorMessage}>{follwingErrorMessage}</div>
          )}
          <div className={styles.userCardList}>
            {followings.map((user) => (
              <UserCard key={user.id} user={user} showUnfollowButton={true} />
            ))}
          </div>
        </SlideMenuInnerPage>
      </SlideMenu>
    </SubPageLayout>
  );
};
export default FollowPage;
