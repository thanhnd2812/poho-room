import CallList from "@/components/call-list";
import { useTranslations } from "next-intl";

const UpcomingPage = () => {
  const t = useTranslations("upcoming");
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <CallList type="upcoming" />
    </section>
  );
};

export default UpcomingPage;
