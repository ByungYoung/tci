"use client";

import { TCIItem, TCIResponse } from "@/lib/tci-data";
import styles from "@/styles/tci.module.css";
import { useClientTranslation } from "@/lib/i18n-client";

interface TCITestProps {
  currentItems: TCIItem[];
  responses: TCIResponse;
  onResponseChange: (questionId: number, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  currentPage: number;
  totalPages: number;
  isCurrentPageComplete: boolean;
}

const TCITest = ({
  currentItems,
  responses,
  onResponseChange,
  onNext,
  onPrev,
  currentPage,
  totalPages,
  isCurrentPageComplete,
}: TCITestProps) => {
  const { t } = useClientTranslation();

  // 진행율 계산
  const progressPercent = Math.round((currentPage / totalPages) * 100);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className={styles.progressText}>
          {progressPercent}% ({t("progress")})
        </span>
      </div>

      {currentItems.map((item) => (
        <div key={item.id} className={styles.questionContainer}>
          <div className={styles.questionHeader}>
            <div className={styles.questionNumber}>{item.id}</div>
            <div className={styles.questionText}>{item.question}</div>
          </div>

          <div className={styles.optionsContainer}>
            {[1, 2, 3, 4, 5].map((option) => (
              <label key={option} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={`question-${item.id}`}
                  value={option}
                  checked={responses[item.id] === option}
                  onChange={() => onResponseChange(item.id, option)}
                  className={styles.optionInput}
                />
                <span className={styles.optionText}>
                  {t(`answers.${option}`)}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.buttonsContainer}>
        {currentPage > 1 && (
          <button
            onClick={onPrev}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            {t("prev")}
          </button>
        )}

        <button
          onClick={onNext}
          disabled={!isCurrentPageComplete}
          className={`${styles.button} ${styles.buttonPrimary}`}
          style={{ opacity: !isCurrentPageComplete ? 0.5 : 1 }}
        >
          {currentPage === totalPages ? t("complete") : t("next")}
        </button>
      </div>

      {!isCurrentPageComplete && (
        <div className={styles.validityWarning}>{t("validation_warning")}</div>
      )}
    </>
  );
};

export default TCITest;
