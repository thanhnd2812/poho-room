import Image from "next/image";

const PohoText = () => {
  return (
    <div className="w-[60px] h-[22px]">
      <Image
        src="/images/logo/poho-text.svg"
        alt="poho-text"
        width={100}
        height={100}
        className="dark:invert"
      />
    </div>
  );
}

export default PohoText