"use client";

import { useEffect, useState, useRef } from "react";
import EditPageLayout, {
  SectionTitle,
  Section,
  Line,
} from "../layout/EditPageLayout";
import styles from "@/styles/containers/pin/_pinEditPage.module.scss";
import {
  EditIcon,
  ImgLoadIcon,
  LocationIcon,
  PinIcon,
} from "@/components/IconSvg";
import ImagePreviewBox from "./ImagePreviewBox";
import { TextareaComponent } from "@/components/InputComponent";
import { AddRoundIcon } from "@/components/IconSvg";
import checkFileValid from "@/utils/checkFileValid";
import { SimplePinCard } from "@/components/PinCard";
import TagEditor from "@/components/TagEditor";

// import pinDataList from "@/../../public/dummy-data/dummy-pin.json";
import SubPageLayout from "@/containers/layout/SubPageLayout";

import fetchPutS3PresignedUrl from "@/utils/fetchPutS3PresingedUrl";
import fetchPostPinPresignedUrl from "@/utils/fetchPostPinPresignedUrl";

import PresignedUrl from "@/types/PresingedUrl";
import { useRouter, useSearchParams } from "next/navigation";
import fetchPutPin from "@/utils/fetchPutPin";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearPinEditState } from "@/redux/pinEditSlice";
import AlertModal from "@/components/AlertModal";
import fetchDeletePin from "@/utils/fetchDeletePin";
import fetchPostPin from "@/utils/fetchPostPin";
import Pin from "@/types/Pin";

interface Place {
  id: number;
  address: string;
  name: string;
  category: string;
  created_at: string;
}

export interface NewPinData extends Place {
  review?: string;
  files?: File[];
}

export interface ImageData {
  id: number;
  file: File | null;
  preview: string;
}

// TODO : Refactor
const samplePinData: Pin = {
  id: 0,
  collectionId: 0,
  writer: "writer",
  review: "",
  createdAt: "",
  saveCnt: 0,
  roadNameAddress: "",
  placeName: "",
  latitude: 0,
  longitude: 0,
  starred: false,
  category: "",
  tags: [],
  collectionTitle: "",
  imagePaths: [],
};

export default function PinEditPage({ pinId }: { pinId?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [createInfo, setCreateInfo] = useState<{
    placeId: number;
    placeName: string;
    collectionId: number;
    collectionTitle: string;
  } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /* 기존 데이터 */
  const pinData = useAppSelector((state) => state.pinEdit);
  /* 변경하는 데이터 */
  const [imageFiles, setImageFiles] = useState<ImageData[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);
  const reviewTextareaRef = useRef<HTMLTextAreaElement>(null);

  /* 기존 데이터 적용 */
  useEffect(() => {
    if (!pinId) {
      dispatch(clearPinEditState());
      const placeId = searchParams.get("placeId");
      const placeName = searchParams.get("placeName");
      const collectionTitle = searchParams.get("collectionTitle");
      const collectionId = searchParams.get("collectionId");
      if (placeId && placeName && collectionTitle && collectionId)
        setCreateInfo({
          placeId: Number(placeId),
          placeName,
          collectionId: Number(collectionId),
          collectionTitle,
        });
      return;
    } else {
      setImageFiles(
        pinData.imagePaths.map((imagePath, index) => ({
          id: index + 1,
          file: null,
          preview: imagePath,
        }))
      );
      setTagList(pinData.tags);
      reviewTextareaRef.current!.value = pinData.review;
    }
  }, []);

  /* submit */
  const handleSubmit = async () => {
    // TODO : Refactor
    if (isLoading) return;
    setIsLoading(true);
    if (pinId) {
      editPin();
    } else {
      (await addPin()) && (await editPin());
    }
    setIsLoading(false);
  };

  const editPin = async () => {
    if (!pinId || !reviewTextareaRef.current) return;
    // 업로드할 파일 분리
    const originalFiles = imageFiles.filter((imageFile) => {
      return imageFile.file === null;
    });
    const uploadFiles = imageFiles.filter((imageFile) => {
      return imageFile.file !== null;
    });

    // presigned-url 발급
    const { presignedUrlDataList, errorMessage } =
      await fetchPostPinPresignedUrl(
        Number(pinId),
        uploadFiles.map((fileData) => fileData.file?.type || "")
      );
    if (!presignedUrlDataList) {
      setAlertMessage(errorMessage);
      return;
    }
    // presigned-url S3 업로드
    const success = await putImageToS3(
      presignedUrlDataList,
      uploadFiles.map((fileData) => fileData.file as File) // null 은 위에서 필터링
    );
    if (!success) {
      setAlertMessage("S3 업로드 실패");
      return;
    }
    // 핀 수정
    const imagePaths = [
      ...originalFiles.map((data) => data.preview[0]),
      ...presignedUrlDataList.map((data) => data.imageUrl),
    ];
    setImageFiles((prev) => [
      ...originalFiles,
      ...presignedUrlDataList.map((data, index) => ({
        id: index + 1,
        file: null,
        preview: data.imageUrl,
      })),
    ]);
    const result = await fetchPutPin(
      Number(pinId),
      reviewTextareaRef.current.value,
      imagePaths,
      tagList
    );
    if (!result) {
      setAlertMessage("핀 수정 실패");
      return;
    }
    // 핀 수정 성공
    dispatch(clearPinEditState());
    router.push(`/collection/${pinData.collectionId}`);
  };

  const addPin = async () => {
    if (isLoading || !createInfo || !reviewTextareaRef.current) return;
    setIsLoading(true);

    const { success, errorMessage } = await fetchPostPin(
      createInfo.placeId,
      createInfo.collectionId,
      reviewTextareaRef.current.value,
      tagList,
      imageFiles.map((fileData) => fileData.file?.type || "")
    );
    if (!success) {
      setAlertMessage(errorMessage);
      return false;
    } else if (!imageFiles.length) {
      // 이미지 없이 핀 생성 성공
      dispatch(clearPinEditState());
      router.push(`/collection/${createInfo.collectionId}`);
      return true;
    }
    return true; // 핀 생성 성공 후 이미지 업로드
  };

  const putImageToS3 = async (
    presignedUrlDataList: PresignedUrl[],
    imageFile: File[]
  ) => {
    let result = true;
    for (let index = 0; index < presignedUrlDataList.length; index++) {
      const { success, errorMessage } = await fetchPutS3PresignedUrl(
        presignedUrlDataList[index].presignedUrl,
        imageFile[index]
      );
      if (!success) {
        setAlertMessage(errorMessage);
        result = false;
      }
    }
    return result;
  };

  const deletePin = async () => {
    if (!pinId || isLoading) return;
    setIsLoading(true);
    const result = await fetchDeletePin(Number(pinId));
    if (!result) {
      setAlertMessage("핀 삭제 실패");
      return;
    }
    setIsLoading(false);
    dispatch(clearPinEditState());
    router.push(`/collection/${pinData.collectionId}`);
  };

  return (
    <SubPageLayout
      topperMsg={pinId ? "핀 수정하기" : "핀 추가하기"}
      completeButtonMsg={pinId ? "수정" : "추가"}
      onClickCompleteButton={handleSubmit}
    >
      <EditPageLayout>
        {/* Place 정보 */}
        <Section>
          <SectionTitle>
            <LocationIcon />
            {pinId
              ? `"${pinData.collectionTitle}" 컬렉션`
              : `"${createInfo?.collectionTitle}" 컬렉션`}
          </SectionTitle>
          <SimplePinCard
            pinData={
              pinId
                ? pinData
                : {
                    ...samplePinData,
                    placeName: createInfo?.placeName || "",
                  }
            }
            showEditButton={false}
          />
          {pinId && (
            <div className={styles.deleteButton}>
              <button onClick={deletePin} disabled={isLoading}>
                핀 삭제하기
              </button>
            </div>
          )}
          <Line />
        </Section>
        <Section>
          {/* 핀 리뷰 */}
          <SectionTitle>
            <EditIcon />핀 리뷰
          </SectionTitle>
          <TextareaComponent
            maxLength={1000}
            rows={10}
            ref={reviewTextareaRef}
            disabled={isLoading}
          />
          <Line />

          {/* 이미지 업로드 */}
          <SectionTitle>
            <ImgLoadIcon />
            이미지 업로드
          </SectionTitle>
          <ImageUploadBox
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            disabled={isLoading}
          />
          <Line />
          {/* 핀 태그 */}
          <SectionTitle>
            <EditIcon />핀 태그
          </SectionTitle>
          <TagEditor
            tagList={tagList}
            setTagList={setTagList}
            disabled={isLoading}
          />
          <Line />
        </Section>
        <Section>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {pinId ? "수정완료" : "추가완료"}
          </button>
        </Section>
      </EditPageLayout>
      <AlertModal message={alertMessage} setMessage={setAlertMessage} />
    </SubPageLayout>
  );
}

/* 이미지 업로드 */
const ImageUploadBox = ({
  imageFiles,
  setImageFiles,
  disabled,
}: {
  imageFiles: ImageData[];
  setImageFiles: React.Dispatch<React.SetStateAction<ImageData[]>>;
  disabled: boolean;
}) => {
  const imageUploadMax = 5;
  const [errMsg, setErrMsg] = useState("");

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const newFiles = Array.from(e.target.files ?? []).filter((file) => {
      if (checkFileValid(file)) return true;
      setErrMsg("유효하지 않은 파일 형식입니다.");
    });
    if (newFiles.length + imageFiles.length > imageUploadMax) {
      setErrMsg("이미지는 5개까지 업로드 가능합니다.");
      return;
    }
    setImageFiles((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        id: !prev.length ? 0 : prev[prev.length - 1].id + 1,
        file: file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleDeleteImage = (id: number) => {
    setImageFiles((prev) => prev.filter((imageFile) => imageFile.id !== id));
  };

  return (
    <div className={styles.imageUploadBox}>
      <input
        type="file"
        id="img-upload"
        accept="image/jpg, image/jpeg, image/png"
        className={styles.inputFile}
        onChange={handleChangeImage}
        multiple
        disabled={disabled}
      />
      <ImagePreviewBox
        imageFiles={imageFiles}
        handleClickClose={handleDeleteImage}
      >
        <label htmlFor="img-upload" className={styles.inputLabel}>
          <AddRoundIcon />
        </label>
      </ImagePreviewBox>
      <span className={styles.selectedImgNum}>{`${imageFiles.length}/5`}</span>
      {errMsg && <span className={styles.errMsg}>{errMsg}</span>}
    </div>
  );
};
