"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { languages } from "@/constant/languages";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ChangeLanguage = () => {
  const { lang } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const defaultLanguage = languages.find((language) => language.code === lang) || languages[1];
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const handleValueChange = (value: string) => {
    const language = languages.find((language) => language.code === value);
    if (language) {
      setSelectedLanguage(language);
      // Keep current sub path, just change the language
      router.push(`/${language.code}${pathname.replace(`/${lang}`, '')}`);
    }
  };

  return (
    <Select defaultValue={defaultLanguage.code} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[130px] bg-gray-100/50 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300 dark:border-gray-700 font-medium text-gray-500">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl">{selectedLanguage.flag}</span>
          <span className="text-base font-bold">{selectedLanguage.short}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-start gap-2">
              <span>{language.flag}</span>
              <span>{language.full}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ChangeLanguage;
