import Image from "next/image";
import linkIcon from "../../public/icon/link_plain.svg";

// css 에서 직접 stroke 혹은 fill 에 색상을 지정하거나, props 로 받아서 적용해야 합니다.
// props 의 color 가 우선됩니다.
// 적용하지 않으면 아이콘 색상이 없어 보이지 않을 수 있습니다.
export { HomeIcon, LinkIcon, PinIcon };

const HomeIcon = ({
  stroke,
  fill,
  className,
}: {
  stroke?: string;
  fill?: string;
  className?: string;
}) => {
  const defaultSize = 24;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12.7596C5 11.4019 5 10.723 5.27446 10.1262C5.54892 9.52949 6.06437 9.08769 7.09525 8.20407L8.09525 7.34693C9.95857 5.7498 10.8902 4.95123 12 4.95123C13.1098 4.95123 14.0414 5.7498 15.9047 7.34693L16.9047 8.20407C17.9356 9.08769 18.4511 9.52949 18.7255 10.1262C19 10.723 19 11.4019 19 12.7596V17C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 21 16.8856 21 15 21H9C7.11438 21 6.17157 21 5.58579 20.4142C5 19.8284 5 18.8856 5 17V12.7596Z"
        stroke={stroke}
        stroke-width="1.7"
      />
      <path
        d="M14.5 21V16C14.5 15.4477 14.0523 15 13.5 15H10.5C9.94772 15 9.5 15.4477 9.5 16V21"
        stroke={stroke}
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const LinkIcon = ({
  stroke,
  fill,
  className,
}: {
  stroke?: string;
  fill?: string;
  className?: string;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 10L10 14"
        stroke={stroke}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 13L18 11C19.3807 9.61929 19.3807 7.38071 18 6V6C16.6193 4.61929 14.3807 4.61929 13 6L11 8M8 11L6 13C4.61929 14.3807 4.61929 16.6193 6 18V18C7.38071 19.3807 9.61929 19.3807 11 18L13 16"
        stroke={stroke}
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};

const PinIcon = ({
  stroke,
  fill = "#33363F",
  calssName,
}: {
  stroke?: string;
  fill?: string;
  calssName?: string;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={calssName}
    >
      <path
        d="M12.398 19.804L12.8585 20.6917L12.8585 20.6917L12.398 19.804ZM11.602 19.804L11.1415 20.6917L11.1415 20.6917L11.602 19.804ZM18 11C18 13.1458 16.9079 14.9159 15.545 16.2906C14.183 17.6644 12.6342 18.555 11.9376 18.9163L12.8585 20.6917C13.6448 20.2838 15.397 19.2805 16.9653 17.6987C18.5326 16.1178 20 13.8706 20 11H18ZM12 5C15.3137 5 18 7.68629 18 11H20C20 6.58172 16.4183 3 12 3V5ZM6 11C6 7.68629 8.68629 5 12 5V3C7.58172 3 4 6.58172 4 11H6ZM12.0624 18.9163C11.3658 18.555 9.81702 17.6644 8.45503 16.2906C7.09211 14.9159 6 13.1458 6 11H4C4 13.8706 5.46741 16.1178 7.03474 17.6987C8.60299 19.2805 10.3552 20.2838 11.1415 20.6917L12.0624 18.9163ZM11.9376 18.9163C11.9514 18.9091 11.9733 18.9023 12 18.9023C12.0267 18.9023 12.0486 18.9091 12.0624 18.9163L11.1415 20.6917C11.6831 20.9726 12.3169 20.9726 12.8585 20.6917L11.9376 18.9163ZM14 11C14 12.1046 13.1046 13 12 13V15C14.2091 15 16 13.2091 16 11H14ZM12 9C13.1046 9 14 9.89543 14 11H16C16 8.79086 14.2091 7 12 7V9ZM10 11C10 9.89543 10.8954 9 12 9V7C9.79086 7 8 8.79086 8 11H10ZM12 13C10.8954 13 10 12.1046 10 11H8C8 13.2091 9.79086 15 12 15V13Z"
        fill={fill}
        stroke={stroke}
      />
    </svg>
  );
};
