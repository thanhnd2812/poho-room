"use client";

import { DotButton, useDotButton } from "@/components/embla-carousel-dot-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { features } from "@/constant/features";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState } from "react";

interface FeatureSliderProps {
  lang: "en" | "vi";
}
const FeatureSlider = ({ lang }: FeatureSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  return (
    <Carousel
      setApi={setApi}
      className="relative"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {features.map((feature, index) => (
          <CarouselItem key={index}>
            <div className="relative">
              <Image
                src={feature.image}
                alt={feature[lang].title}
                className="w-full h-full object-contain"
                width={800}
                height={852}
              />
              <div className="absolute bottom-0 w-full">
                <div className="flex flex-col items-center justify-center h-full px-24 pb-24 text-center gap-y-3 ">
                  <h1 className="text-white text-2xl font-semibold leading-9 drop-shadow-lg [text-shadow:_0_4px_4px_rgb(255_255_255_/_0.4)]">
                    {feature[lang].title}
                  </h1>
                  <p className="text-white text-base leading-normal">
                    {feature[lang].description}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center items-center gap-x-2 absolute bottom-10 left-0 right-0">
        <CarouselPrevious variant="ghost" className="text-white" />
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`w-2 h-2 rounded-full ${
              selectedIndex === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
        <CarouselNext variant="ghost" className="text-white" />
      </div>
      {/* 
       */}
    </Carousel>
  );
};

export default FeatureSlider;
