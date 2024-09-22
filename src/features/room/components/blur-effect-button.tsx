"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBackgroundFilters } from "@stream-io/video-react-sdk";
import { useTranslations } from "next-intl";
import React from "react";
import { MdBlurOff, MdBlurOn } from "react-icons/md";
type BlurStrength = "low" | "medium" | "high";

function BlurEffectButton() {
  const [currentBlur, setCurrentBlur] = React.useState<BlurStrength | null>(
    null
  );

  const t = useTranslations("meetingRoom");
  const {
    isSupported,
    isReady,
    applyBackgroundBlurFilter,
    disableBackgroundFilter,
  } = useBackgroundFilters();

  if (!isSupported || !isReady) {
    return null; // Or render a disabled select
  }

  const handleBlurChange = (value: BlurStrength | "none") => {
    if (value === "none") {
      disableBackgroundFilter();
      setCurrentBlur(null);
    } else {
      applyBackgroundBlurFilter(value);
      setCurrentBlur(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="mb-2 py-0 bg-[#19232D]">
          {currentBlur ? (
            <>
              <MdBlurOn className="h-5 w-5" />
            </>
          ) : (
            <>
              <MdBlurOff className="h-5 w-5" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BlurEffectButton;
