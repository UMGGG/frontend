import Image from "next/image";
import styles from "@/styles/components/_review.module.scss";
import Pin from "@/types/Pin";
import { CommentIcon } from "./IconSvg";
import Link from "next/link";
import MultilineTextRenderer from "@/components/MultilineTextRenderer";
import ImageViewBox from "./ImageViewBox";
import { useState } from "react";

export { ReviewCard, MyReviewCard };

export default function ReviewCard({
  reviewData,
  activeGoCollectionBtn = true,
}: {
  reviewData: Pin;
  activeGoCollectionBtn?: boolean;
}) {
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;
  const [selectedImageNum, setSelectedImageNum] = useState<number | null>(null);

  return (
    <article className={styles.review}>
      <Link href={`/profile/${reviewData.writerMembername}`}>
        <Image
          src={reviewData.avatarImage || defaultAvatarUrl || ""} // avatar
          alt="user profile image"
          width={100}
          height={100}
          className={styles.userAvatar}
        />
      </Link>
      <Link href={`/profile/${reviewData.writerMembername}`}>
        <span
          className={styles.userNick}
        >{`@${reviewData.writerMembername}`}</span>
      </Link>
      <div className={styles.text}>
        <MultilineTextRenderer text={reviewData.review} />
      </div>

      <div className={styles.content}>
        {reviewData.imagePaths.map((path, index) => (
          <Image
            key={index}
            src={path}
            alt="review image"
            width={100}
            height={100}
            onClick={() => setSelectedImageNum(index)}
          />
        ))}
      </div>

      <li className={styles.tags}>
        {reviewData.tags.map((tag, index) => (
          <ul key={index} className={styles.tag}>{`${tag} `}</ul>
        ))}
      </li>

      <div className={styles.footers}>
        <br />
        <button
          className={styles.button}
        >{`+${reviewData.imagePaths.length} 사진 더보기`}</button>
        {activeGoCollectionBtn && (
          <Link
            className={styles.button}
            href={`/collection/${reviewData.collectionId}`}
          >
            {`"${reviewData.collectionTitle}" 컬렉션 보러가기`}
          </Link>
        )}
        <br />
      </div>
      <ImageViewBox
        selectedImageNum={selectedImageNum}
        setSelectedImageNum={setSelectedImageNum}
        review={reviewData.review}
        membername={reviewData.writerMembername}
        imagePaths={reviewData.imagePaths}
      />
    </article>
  );
}

const MyReviewCard = ({ reviewData }: { reviewData: Pin }) => {
  const [selectedImageNum, setSelectedImageNum] = useState<number | null>(null);

  return (
    <article className={styles.review}>
      {reviewData.review && (
        <div className={styles.text}>
          <CommentIcon />
          <div>
            <MultilineTextRenderer text={reviewData.review} />
          </div>
        </div>
      )}
      {reviewData.imagePaths?.length > 0 && (
        <div className={styles.content}>
          {reviewData.imagePaths.map((path, index) => (
            <Image
              key={index}
              src={path}
              alt="review image"
              width={100}
              height={100}
              onClick={() => setSelectedImageNum(index)}
            />
          ))}
        </div>
      )}
      <ImageViewBox
        selectedImageNum={selectedImageNum}
        setSelectedImageNum={setSelectedImageNum}
        review={reviewData.review}
        membername={reviewData.writerMembername}
        imagePaths={reviewData.imagePaths}
      />
    </article>
  );
};
