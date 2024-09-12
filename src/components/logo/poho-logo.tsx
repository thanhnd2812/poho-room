import Image from 'next/image';

const PohoLogo = () => {
  return (
    <div>
      <div className="relative w-8 h-8 bg-primary rounded-[5.33px]">
        <Image
          className="absolute top-[7px] left-2.5"
          alt="Logo"
          src="/images/logo/poho-logo.svg"
          width={13}
          height={17}
        />
      </div>
    </div>
  );
}

export default PohoLogo
