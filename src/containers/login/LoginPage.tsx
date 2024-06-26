"use client";

import { LogoHorizontal } from "@/components/LogoSvg";
import styles from "@/styles/containers/login/_login.module.scss";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Cookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { clearMyProfile, setMyProfile } from "@/redux/profileSlice";
import fetchGetMyProfile from "@/utils/members/fetchGetMyProfile";
import Link from "next/link";

export enum LoginStatusMessage {
  SOURCE_LOGIN_POPUP = "source-login-popup",
  LOGIN_SUCCESS = "login-success",
  LOGIN_FAILED = "login-failed",
}

// for development
// import { ProfileMine } from "@/types/Profile";

export default function LoginPage() {
  const [externalPopup, setExternalPopup] = useState<Window | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const oauth = new Cookies().get("Authorization");
    if (oauth) {
      getMyInfo();
    }

    // for development
    // const myProfile: ProfileMine = {
    //   id: 2,
    //   nickname: "사용자1",
    //   avatar: "https://picsum.photos/200",
    //   collectionCnt: 10,
    //   scrappedCollectionCnt: 2,
    //   followerCnt: 200,
    //   followingCnt: 150,
    //   registrationSource: "KAKAO",
    //   role: "ROLE_MEMBER",
    // };
    // localStorage.setItem("myProfile", JSON.stringify(myProfile));

    window.addEventListener("message", checkLoginStatus);
    return () => {
      window.removeEventListener("message", checkLoginStatus);
    };
  }, []);

  const checkLoginStatus = (e: MessageEvent) => {
    if (e.origin !== process.env.NEXT_PUBLIC_FRONTEND_URL) return;
    if (e.data.source !== LoginStatusMessage.SOURCE_LOGIN_POPUP) return;
    const oauth = new Cookies().get("Authorization");
    if (
      oauth &&
      !isLoading &&
      e.data.status === LoginStatusMessage.LOGIN_SUCCESS
    ) {
      getMyInfo();
      setErrorMessage("");
    } else setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
  };

  const getMyInfo = async () => {
    const { profileInfo, errorMessage } = await fetchGetMyProfile();
    if (errorMessage || !profileInfo) {
      setErrorMessage(errorMessage);
      return;
    }
    dispatch(setMyProfile(profileInfo));
    router.push("/");
  };

  /* popup */
  const handleClick = ({
    loginType,
  }: {
    loginType: "google" | "kakao" | "naver";
  }) => {
    externalPopup?.close();
    const width = 500; // 팝업의 가로 길이: 500
    const height = 600; // 팝업의 세로 길이 : 500
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    setExternalPopup(
      window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/${loginType}`,
        `${loginType}s login`,
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      )
    );

    // for devlopment
    // setExternalPopup(
    //   window.open(
    //     `${process.env.NEXT_PUBLIC_FRONTEND_URL}/popup`,
    //     `${loginType}s login`,
    //     `width=${width},height=${height},left=${left},top=${top},popup=yes`
    //   )
    // );
  };

  return (
    <div id={styles.loginPage}>
      <LogoHorizontal />
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleClick({ loginType: "naver" })}
          className={styles.naverButton}
        >
          <Image width={16} height={16} src={"/logo/naver.svg"} alt="naver" />
          <span>네이버 로그인</span>
        </button>
        <button
          onClick={() => handleClick({ loginType: "kakao" })}
          className={styles.kakaoButton}
        >
          <Image width={20} height={20} src={"/logo/kakao.svg"} alt="kakao" />
          <span>카카오 로그인</span>
        </button>
        <button
          onClick={() => handleClick({ loginType: "google" })}
          className={styles.googleButton}
        >
          <Image width={18} height={18} src={"/logo/google.svg"} alt="google" />
          <span>구글 로그인</span>
        </button>
      </div>
      <div className={styles.loginErrorMessage}>{errorMessage}</div>
      <footer className={styles.footer}>
        <Link href="/policy/terms">서비스 이용약관</Link>
        <p>|</p>
        <Link href="/policy/privacy">개인정보 처리방침</Link>
        <br/>
        <span>문의 : pintogether.ko@gmail.com</span>  
      </footer>
    </div>
  );
}
