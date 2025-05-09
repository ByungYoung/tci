"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/lib/i18n-client";
import TCIResult from "@/components/TCIResult";
import { getTCIResultById } from "@/lib/supabase-service";
import { TCIResponse } from "@/lib/tci-data";
import styles from "@/styles/tci.module.css";

interface ResultPageProps {
  params: {
    id: string;
  };
}

export default function ResultPage({ params }: ResultPageProps) {
  const { t } = useClientTranslation();
  const router = useRouter();
  const [resultData, setResultData] = useState<{
    responses: TCIResponse;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const result = await getTCIResultById(params.id);

        if (!result) {
          setError("결과를 찾을 수 없습니다.");
        } else {
          setResultData(result);
        }
      } catch (err) {
        console.error("Error fetching result:", err);
        setError("결과를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id]);

  const handleRestart = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>{t("calculating")}</div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          {error || "결과를 찾을 수 없습니다."}
        </div>
        <button
          onClick={handleRestart}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {t("restart")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TCIResult
        responses={resultData.responses}
        onRestart={handleRestart}
        resultId={params.id}
      />
    </div>
  );
}
