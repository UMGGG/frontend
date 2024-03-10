import styles from "@/styles/containers/collection/_collectionPage.module.scss";
import PinCard from "../../components/PinCard";
import ReviewCard from "../../components/ReviewCard";
import { PinForPlace } from "@/types/Pin";
import Pin from "@/types/Pin";

export default function CollectionWithPinCommentRenderer({
  data,
  pin,
}: {
  data: PinForPlace[];
  pin: Pin;
}) {
  return (
    <section className={styles.collectionListContainer}>
      {data.map((pinComment, index) => (
        <PinCard key={index} pinData={pinComment} />
      ))}
    </section>
  );
}
