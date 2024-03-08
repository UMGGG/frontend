import Image from "next/image";
import styles from "@/styles/components/_review.module.scss";
import Pin from "@/types/Pin";
import { CommentIcon } from "./IconSvg";

export { ReviewCard, MyReviewCard};

export default function ReviewCard({
  reviewData,
  activeGoCollectionBtn = true,
}: {
  reviewData: Pin;
  activeGoCollectionBtn?: boolean;
}) {
  return (
    <article className={styles.review}>
      <Image
        src="/images/cat_dummy.jpeg" // avatar
        alt="user profile image"
        width={100}
        height={100}
        className={styles.userAvatar}
      />
      <span
        className={styles.userNick}
      >{`${reviewData.writer} 님의 리뷰`}</span>
      <span className={styles.text}>{`${reviewData.review}`}</span>

      <div className={styles.content}>
        {reviewData.imagePaths.map((path, index) => (
          <Image
            key={index}
            src={path}
            alt="review image"
            width={100}
            height={100}
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
          <button className={styles.button}>
            {`"${reviewData.collectionTitle}" 컬렉션 보러가기`}
          </button>
        )}
        <br />
      </div>
    </article>
  );
}

const MyReviewCard = ({ reviewData }: { reviewData: Pin }) => {
  return (
    <article className={styles.review}>
      {reviewData.review && (
        <div className={styles.text}>
          <CommentIcon />
          <span>{`${reviewData.review}`}</span>
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
            />
          ))}
        </div>
      )}
    </article>
  );
};