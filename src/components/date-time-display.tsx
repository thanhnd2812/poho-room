"use client";

import { SupportedLanguage } from "@/constant/locales";
import { useEffect, useState } from "react";

const DateTimeDisplay = ({ lang }: { lang: SupportedLanguage }) => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(`${lang}`, {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      setDate(
        now.toLocaleDateString(`${lang}`, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, [lang]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
      <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
    </div>
  );
};

export default DateTimeDisplay;
