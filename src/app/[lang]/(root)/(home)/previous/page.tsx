import CallList from "@/components/call-list";
import { useTranslations } from "next-intl";

const PreviousPage = () => {
  const t = useTranslations("previous");
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <CallList type="ended" />
    </section>
  );
};

export default PreviousPage;
