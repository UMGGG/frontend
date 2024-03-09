import styles from "@/styles/containers/collection/_collectionPage.module.scss";
import PinCard from "../../components/PinCard";
import Pin from "@/types/Pin";

export default function CollectionWithPinRenderer({ pins }: { pins: Pin[] }) {
  return (
    <section className={styles.collectionListContainer}>
      {pins.map((pinComment, index) => (
        <PinCard key={index} pinData={pinComment} />
      ))}
    </section>
  );
}
