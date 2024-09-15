
import { SupportedLanguage } from '@/constant/locales';
import ForgotPassForm from '@/features/auth/components/forgot-pass-form';
import { getLanguage } from '@/languages';

interface PageProps {
  params: {
    lang: string;
  };
}

const ForgotPassPage = async ({ params }: PageProps) => {
  const { lang } = params;
  const language = await getLanguage(lang as SupportedLanguage);
  return (
    <div>
      <ForgotPassForm
        emailLabel={language.auth.forgotPassword.email}
        emailPlaceholder={language.auth.forgotPassword.emailPlaceholder}
        emailFieldError={language.auth.forgotPassword.emailFieldError}
        forgotPasswordLabel={language.auth.forgotPassword.title}
        forgotPasswordDescription={language.auth.forgotPassword.description}
        forgotPasswordButton={language.auth.forgotPassword.sendLink}
        generalError={language.auth.forgotPassword.generalError}
        backToLogin={language.auth.forgotPassword.backToLogin}
        linkHasBeenSent={language.auth.forgotPassword.linkHasBeenSent}
      />
    </div>

  );
};

export default ForgotPassPage;
