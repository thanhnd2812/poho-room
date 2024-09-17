import CallList from "@/components/call-list";
import { useTranslations } from "next-intl";

const RecordingsPage = () => {
  const t = useTranslations("recordings");
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <CallList type="recordings" />
    </section>
  );
};

export default RecordingsPage;
