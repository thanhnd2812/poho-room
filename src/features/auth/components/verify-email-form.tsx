"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Verified, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useVerifyEmail } from "../hooks/use-verify-email"
const VerifyEmailForm = () => {
  const searchParams = useSearchParams()
  const oobCode = searchParams.get("oobCode")
  const [code, setCode] = useState(oobCode)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { mutate: verifyEmail } = useVerifyEmail()
  const t = useTranslations("auth.verifyEmail")

  useEffect(() => {
    setCode(oobCode)
  }, [oobCode])

  useEffect(() => {
    if (code && code.length > 0) {
      verifyEmail({ code }, {
        onSuccess: (data) => {
          setIsVerified(data.success)
          setIsLoading(false)
        },
        onError: () => {
          setIsVerified(false)
          setIsLoading(false)
        }
      })
    }
  }, [code])

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center pt-10">
          <Loader2 className="w-10 h-10 text-zinc-800 dark:text-white animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-6">
          {isVerified ? (
            <Verified className="w-10 h-10 text-green-500" />
          ) : (
            <XCircle className="w-10 h-10 text-red-500" />
          )}
          <div className="flex flex-col items-center justify-center gap-y-2">
            {isVerified ? (
              <div className="flex flex-col items-center justify-center gap-y-2">
                <h1 className="text-lg font-medium text-zinc-800 dark:text-white">
                  {t("emailVerified")}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("emailVerifiedDescription")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-2">
                <h1 className="text-lg font-medium text-zinc-800 dark:text-white">
                  {t("emailNotVerified")}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("emailNotVerifiedDescription")}
                </p>
              </div>
            )}
            </div>
            
            <Link href="/login" className="w-full">
              <Button className="w-full">
                {t("login")}
              </Button>
            </Link>
        </div>
      )}
    </>
  );
}

export default VerifyEmailForm
