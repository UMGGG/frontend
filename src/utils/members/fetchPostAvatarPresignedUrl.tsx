import APIResponse from "@/types/APIResponse";
import PresignedUrl from "@/types/PresingedUrl";
import { logout } from "@/hooks/useLogout";

const fetchPostAvatarPresignedUrl = async (contentType: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/members/me/avatar/presigned-url`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: contentType }),
      }
    );
    if (res.status === 401) {
      logout();
      return {
        presignedUrlData: null,
        errorMessage: "로그인이 필요합니다.",
      };
    }
    if (!res.ok) throw new Error("presinged url 발급에 실패했습니다.");
    const data: APIResponse = await res.json();
    const presignedUrlData: PresignedUrl = data.results[0];
    return { presignedUrlData, errorMessage: "" };
  } catch (err: any) {
    console.error(err);
    return {
      presignedUrlData: null,
      errorMessage: "presinged url 발급에 실패했습니다.",
    };
  }
};
export default fetchPostAvatarPresignedUrl;
