"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectDraftCollectionEdit,
  setDraftCollectionEdit,
  clearDraftCollectionEdit,
} from "@/redux/draftCollectionEditSlice";

import styles from "@/styles/containers/collection/_collectionEditPage.module.scss";
import Pin from "@/types/Pin";
import { CollectionDetail } from "@/types/Collection";
import {
  ImgLoadIcon,
  EditIcon,
  CloseRoundIcon,
  PinIcon,
} from "@/components/IconSvg";
import EditPageLayout, {
  SectionTitle,
  Section,
  Line,
} from "@/containers/layout/EditPageLayout";
import SubPageLayout from "@/containers/layout/SubPageLayout";
import { InputComponent, TextareaComponent } from "@/components/InputComponent";
import { SimplePinCard } from "@/components/PinCard";
import TagEditor from "@/components/TagEditor";
import AlertModal from "@/components/AlertModal";

import fetchPostCollection from "@/utils/collections/fetchPostCollection";
import fetchPostCollectionPresignedUrl from "@/utils/collections/fetchPostCollectionPresignedUrl";
import fetchPutCollection from "@/utils/collections/fetchPutCollection";
import fetchPutS3PresignedUrl from "@/utils/s3/fetchPutS3PresingedUrl";
import fetchGetCollectionInfo from "@/utils/collections/fetchGetCollectionInfo";
import fetchGetCollectionAllPins from "@/utils/collections/fetchGetCollectionAllPins";
import fetchDeleteCollection from "@/utils/collections/fetchDeleteCollection";
import fetchDeletePin from "@/utils/pins/fetchDeletePin";
import { initialPinEditState } from "@/redux/pinEditSlice";

export default function CollectionEditPage({
  collectionId,
  topperMsg,
}: {
  collectionId?: number;
  topperMsg: string;
}) {
  const sizeImage = 300;
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectDraftCollectionEdit);

  /* 핀 리스트 */
  const [pinDataList, setPinDataList] = useState<Pin[]>([]);

  /* 컬렉션 변경전 정보 */
  const [collectionInfo, setCollectionInfo] = useState<CollectionDetail | null>(
    null
  );
  /* 컬렉션 정보 */ // Redux 사용하기
  const [inputTitle, setInputTitle] = useState("");
  const [inputDetails, setInputDetails] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_COLLECTION_URL || ""
  );
  const [tagList, setTagList] = useState<string[]>([]);

  const onChangeNickname = (e: any) => {
    setInputTitle(e.target.value);
  };

  const onChangeDescription = (e: any) => {
    setInputDetails(e.target.value);
  };

  const onChageImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setImgSrc(e.target?.result);
      }
    };
  };

  const resetImgSrc = () => {
    setImgSrc(process.env.NEXT_PUBLIC_DEFAULT_COLLECTION_URL || "");
  };

  /* submit 컬렉션 수정/생성  */
  const submitCollectionEdit = async () => {
    if (isUploading) {
      setAlertMessage("업로드 중입니다. 잠시만 기다려주세요.");
    }
    setIsUploading(true);
    if (inputTitle === "") {
      setAlertMessage("컬렉션 제목을 입력해주세요.");
      return;
    }
    if (!collectionId) {
      await createCollection();
    } else {
      await editCollection(collectionId);
    }
    setIsUploading(false);
  };

  /* 컬렉션 삭제 */
  const deleteCollection = async () => {
    if (isUploading || !collectionId || !collectionInfo) return;
    if (!confirm(`"${collectionInfo.title}" 컬렉션을 삭제하시겠습니까?`))
      return;
    setIsUploading(true);
    const { success, errorMessage } = await fetchDeleteCollection(collectionId);
    if (!success) {
      setAlertMessage(errorMessage);
    } else {
      router.replace(`/profile/${collectionInfo?.writerMembername}`);
    }
    setIsUploading(false);
  };

  /* 컬렉션 생성 */
  const createCollection = async () => {
    // presinged URL 발급
    const { presingedUrlData, newCollectionId, errorMessage } =
      await fetchPostCollection(
        inputTitle,
        inputDetails,
        tagList,
        imgFile?.type || null
      );
    if (errorMessage || (imgFile && !presingedUrlData)) {
      setAlertMessage(errorMessage);
      return;
    } else if (!imgFile) {
      router.replace(`/collection/${newCollectionId}`);
      return;
    }
    // S3 이미지 업로드
    else if (presingedUrlData) {
      const { success, errorMessage } = await fetchPutS3PresignedUrl(
        presingedUrlData.presignedUrl,
        imgFile
      );
      if (!success) {
        setAlertMessage(errorMessage);
        return;
      } else if (newCollectionId) {
        // 변경된 이미지와 정보로 컬렉션 수정
        const { success, errorMessage } = await fetchPutCollection(
          newCollectionId,
          inputTitle,
          presingedUrlData.imageUrl,
          inputDetails,
          tagList
        );
        if (!success) {
          setAlertMessage(errorMessage);
          return;
        }
        router.replace(`/collection/${newCollectionId}`);
      }
    }
  };

  /* 컬렉션 수정 */
  const editCollection = async (collectionId: number) => {
    if (imgFile) {
      // imgFile이 있으면 S3에 이미지 업로드
      // presinged URL 발급
      const { presignedUrlData, errorMessage: errorMessage1 } =
        await fetchPostCollectionPresignedUrl(collectionId, imgFile.type);
      if (errorMessage1 || !presignedUrlData) {
        setAlertMessage(errorMessage1);
        return;
      }
      //  S3 이미지 업로드
      const { success: success1, errorMessage: errorMessage2 } =
        await fetchPutS3PresignedUrl(presignedUrlData.presignedUrl, imgFile);
      if (!success1) {
        setAlertMessage(errorMessage2);
        return;
      }
      setImgSrc(presignedUrlData.imageUrl);
      // 변경된 이미지와 정보로 컬렉션 수정
      const { success: success2, errorMessage } = await fetchPutCollection(
        collectionId,
        inputTitle,
        presignedUrlData.imageUrl,
        inputDetails,
        tagList
      );
      if (!success2) {
        setAlertMessage(errorMessage);
        return;
      }
    } else {
      // 이미지 변경 없이 컬렉션 수정
      const { success, errorMessage } = await fetchPutCollection(
        collectionId,
        inputTitle,
        imgSrc,
        inputDetails,
        tagList
      );
      if (!success) {
        setAlertMessage(errorMessage);
        return;
      }
    }
    clearDraftSave();
    router.replace(`/collection/${collectionId}`);
  };

  /* 초기화 */
  useEffect(() => {
    if (collectionId) {
      const fetchData = async () => {
        if (draft?.id === collectionId) {
          setStateFromDraftSave();
        } else {
          clearDraftSave();
          await getAndSetCollectionInfo(collectionId);
        }
        await getAndSetPinList(collectionId);
      };
      fetchData();
    }
  }, [collectionId]);

  /* 컬렉션 정보 불러오기 (초기화) */
  const getAndSetCollectionInfo = async (collectionId: number) => {
    setIsUploading(true);
    const { collectionInfo, errorMessage } =
      await fetchGetCollectionInfo(collectionId);
    if (!collectionInfo || errorMessage) {
      setAlertMessage(errorMessage);
      setIsUploading(false);
      return;
    }
    setCollectionInfo(collectionInfo);
    setInputTitle(collectionInfo.title);
    setInputDetails(collectionInfo.details);
    setImgSrc(collectionInfo.thumbnail);
    setTagList(collectionInfo.tags);
    setIsUploading(false);
  };

  /* 핀 리스트 불러오기 (초기화) */
  const getAndSetPinList = async (collectionId: number) => {
    setIsUploading(true);
    const { pinList, errorMessage } =
      await fetchGetCollectionAllPins(collectionId);
    if (!pinList || errorMessage) {
      setAlertMessage(errorMessage);
      setIsUploading(false);
      return;
    }
    setPinDataList(pinList);
    setIsUploading(false);
  };

  /* 임시저장 정보 불러오기 (초기화) */
  const setStateFromDraftSave = async () => {
    if (!draft || !collectionId || collectionId !== draft.id) return;
    setInputTitle(draft.title);
    setInputDetails(draft.details);
    setImgFile(draft.imgFile);
    setImgSrc(draft.imgSrc);
    setTagList(draft.tagList);
  };

  const saveStateAsDraftSave = async () => {
    if (!collectionId) return;
    dispatch(
      setDraftCollectionEdit({
        id: collectionId,
        title: inputTitle,
        details: inputDetails,
        imgFile: imgFile,
        imgSrc: imgSrc,
        tagList: tagList,
      })
    );
  };

  const clearDraftSave = async () => {
    dispatch(clearDraftCollectionEdit());
  };

  const routeToPinEditPage = async (path: string, pinData: Pin) => {
    saveStateAsDraftSave();
    // pinedit
    dispatch(initialPinEditState(pinData));
    router.push(path);
  };

  const deletePin = async (pinId: number) => {
    if (isUploading) return;
    setIsUploading(true);
    const { success, errorMessage } = await fetchDeletePin(pinId);
    if (!success) {
      setAlertMessage(errorMessage);
    } else {
      const newPinDataList = pinDataList.filter((pin) => {
        return pin.id !== pinId;
      });
      setPinDataList(newPinDataList);
    }
    setIsUploading(false);
  };

  return (
    <SubPageLayout
      topperMsg={topperMsg}
      completeButtonMsg={collectionId ? "수정" : "생성"}
      deleteButtonMsg={collectionId ? "삭제" : undefined}
      onClickCompleteButton={submitCollectionEdit}
      onClickDeleteButton={collectionId ? deleteCollection : undefined}
    >
      <EditPageLayout>
        {/* 컬렉션 이미지 */}
        <Section>
          <SectionTitle>
            <ImgLoadIcon />
            컬렉션 대표 이미지
          </SectionTitle>
          <section className={styles.collectionChangeContainer}>
            <div className={styles.mainImage}>
              <InputComponent
                type="file"
                accept="image/jpg,image/png,image/jpeg"
                id="file"
                style={{ display: "none" }}
                onChange={onChageImage}
                disabled={isUploading}
              />
              <label htmlFor="file">
                <Image
                  src={imgSrc}
                  alt="profile image"
                  width={sizeImage}
                  height={sizeImage}
                />
              </label>
            </div>
            <div className={styles.cancelButtonBox}>
              <button
                className={styles.cancelButton}
                onClick={resetImgSrc}
                disabled={isUploading}
              >
                <CloseRoundIcon />
              </button>
            </div>
          </section>
        </Section>
        <Line />

        <Section>
          {/* 컬렉션 제목 */}
          <SectionTitle>
            <EditIcon />
            <p>컬렉션 제목</p>
          </SectionTitle>
          <InputComponent
            onChange={onChangeNickname}
            value={inputTitle}
            maxLength={15}
            placeholder={collectionInfo?.title || "제목을 입력해주세요"}
            disabled={isUploading}
          />
          <Line />
          {/* 컬렉션 태그 */}
          <SectionTitle>
            <EditIcon />
            <p>컬렉션 태그</p>
          </SectionTitle>
          <TagEditor
            tagList={tagList}
            setTagList={setTagList}
            disabled={isUploading}
          />
          <Line />
          {/* 컬렉션 설명 */}
          <SectionTitle>
            <EditIcon />
            컬렉션 설명
          </SectionTitle>
          <TextareaComponent
            rows={6}
            onChange={onChangeDescription}
            value={inputDetails}
            maxLength={250}
            placeholder={collectionInfo?.details || "설명을 입력해주세요"}
            disabled={isUploading}
          />
          <Line />
        </Section>
        {/* 핀 리스트 */}
        {collectionId && (
          <Section>
            <SectionTitle className={styles.titleContainer}>
              <PinIcon />
              <span>핀 리스트</span>
              {/* <Link
                href={`/pin/select?collectionId=${collectionId}`}
                className={styles.pinAddButton}
              >
                {"핀 추가하기 >"}
              </Link> */}
            </SectionTitle>
            {/* List */}
            <ul className={styles.pinCardContainer}>
              {pinDataList.map((pin) => (
                <div key={pin.id} className={styles.pinCard}>
                  <SimplePinCard pinData={pin} activeShowDetail={true} />
                  <div
                    onClick={() =>
                      routeToPinEditPage(
                        `/pin/edit/${pin.id}?collectionEditId=${collectionId}`,
                        pin
                      )
                    }
                  >
                    <EditIcon className={styles.editButton} />
                  </div>
                  <CloseRoundIcon
                    className={styles.closeButton}
                    onClick={() => deletePin(pin.id)}
                  />
                </div>
              ))}
            </ul>
            <Line />
          </Section>
        )}
        <Section className={styles.buttonContainer}>
          {collectionId && (
            <>
              <button
                className={styles.confirmButton}
                disabled={isUploading}
                onClick={submitCollectionEdit}
              >
                컬렉션 수정
              </button>
              <button
                className={styles.confirmButton}
                disabled={isUploading}
                onClick={deleteCollection}
              >
                컬렉션 삭제
              </button>
            </>
          )}
          {!collectionId && (
            <button
              className={styles.confirmButton}
              disabled={isUploading}
              onClick={submitCollectionEdit}
            >
              컬렉션 생성
            </button>
          )}
        </Section>
        <AlertModal message={alertMessage} setMessage={setAlertMessage} />
      </EditPageLayout>
    </SubPageLayout>
  );
}
