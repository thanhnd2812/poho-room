import { cn } from "@/lib/utils";
import Image from "next/image";

interface MeetingTypeCardProps {
  title: string;
  description: string;
  img: string;
  onClick: () => void;
  className?: string;
}

const MeetingTypeCard = ({
  title,
  description,
  img,
  onClick,
  className,
}: MeetingTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        `px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`,
        className
      )}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt="add-meeting" width={27} height={27} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default MeetingTypeCard;
