"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKGROUND_EFFECT_URLS } from "@/constant/bg-effects";
import { useBackgroundFilters } from "@stream-io/video-react-sdk";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { MdBlurOff, MdBlurOn } from "react-icons/md";

type BlurStrength = "low" | "medium" | "high";
type BackgroundEffect = BlurStrength | "none" | `image-${number}`;

function BlurEffectButton() {
  const [currentEffect, setCurrentEffect] = React.useState<BackgroundEffect | null>(
    null
  );

  const t = useTranslations("meetingRoom");
  const {
    isSupported,
    isReady,
    applyBackgroundBlurFilter,
    disableBackgroundFilter,
    applyBackgroundImageFilter,
    backgroundImages,
  } = useBackgroundFilters();

  if (!isSupported || !isReady) {
    return null; // Or render a disabled select
  }

  const handleBlurChange = (effect: BackgroundEffect) => {
    if (effect === "none") {
      disableBackgroundFilter();
    } else if (["low", "medium", "high"].includes(effect)) {
      applyBackgroundBlurFilter(effect as BlurStrength);
    } else {

      const imageIndex = parseInt(effect.split("-")[1]);
      applyBackgroundImageFilter(BACKGROUND_EFFECT_URLS[imageIndex]);
    }
    setCurrentEffect(effect);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="mb-2 py-0 bg-[#19232D]">
          {currentEffect === "none" ? (
            <>
              <MdBlurOff className="mr-2 h-4 w-4" />
            </>
          ) : currentEffect?.startsWith("image-") ? (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
            </>
          ) : (
            <>
              <MdBlurOn className="mr-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleBlurChange("none")}>
          <MdBlurOff className="mr-2 h-4 w-4" />
          <span>{t("none")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBlurChange("low")}>
          <MdBlurOn className="mr-2 h-4 w-4 opacity-30" />
          <span>{t("low")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBlurChange("medium")}>
          <MdBlurOn className="mr-2 h-4 w-4 opacity-60" />
          <span>{t("medium")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBlurChange("high")}>
          <MdBlurOn className="mr-2 h-4 w-4 opacity-90" />
          <span>{t("high")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {backgroundImages &&
          backgroundImages.map((image, index) => (
            <DropdownMenuItem
              key={image}
              onClick={() => handleBlurChange(`image-${index}`)}
            >
              <Image
                src={image}
                alt="Background Image"
                className="mr-2 h-4 w-4"
                width={16}
                height={16}
              />
              <span>{t("backgroundName", { index: index + 1 })}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BlurEffectButton;
