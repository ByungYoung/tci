"use client";

import { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "@/styles/tci.module.css";
import { dimensionDescriptions } from "@/lib/tci-data";

interface TCIInterpretationProps {
  groupScores: { [key: string]: number };
}

// 차원별 최대 점수 정의
const MAX_SCORES = {
  NS: 40,
  HA: 35,
  RD: 24,
  PS: 35,
  SD: 44,
  CO: 42,
  ST: 33,
};

// 점수 수준 판별 함수
const getDimensionLevel = (
  score: number,
  maxScore: number
): "low" | "medium" | "high" => {
  const percentage = (score / maxScore) * 100;
  if (percentage < 33) return "low";
  if (percentage < 66) return "medium";
  return "high";
};

const TCIInterpretation = ({ groupScores }: TCIInterpretationProps) => {
  const { t } = useTranslation("common");
  const [activeDimension, setActiveDimension] = useState<string | null>(null);

  // 주요 성격 패턴 분석
  const getPersonalityPattern = () => {
    // NS와 HA 점수를 기준으로 패턴 분석
    const nsPercentage = (groupScores.NS || 0) / MAX_SCORES.NS;
    const haPercentage = (groupScores.HA || 0) / MAX_SCORES.HA;

    if (nsPercentage > 0.6 && haPercentage < 0.4) {
      return "모험적이고 외향적인 성향";
    } else if (nsPercentage < 0.4 && haPercentage > 0.6) {
      return "신중하고 내향적인 성향";
    } else if (nsPercentage > 0.6 && haPercentage > 0.6) {
      return "변동이 크고 감정적인 성향";
    } else if (nsPercentage < 0.4 && haPercentage < 0.4) {
      return "차분하고 체계적인 성향";
    } else {
      return "균형 잡힌 성향";
    }
  };

  return (
    <div className={styles.interpretationContainer}>
      <h3 className={styles.interpretationTitle}>
        {t("interpretation.title")}
      </h3>

      <div className={styles.personalityPattern}>
        <h4>주요 성격 패턴</h4>
        <p>{getPersonalityPattern()}</p>
      </div>

      <div className={styles.dimensionTabs}>
        {Object.keys(dimensionDescriptions).map((dimension) => {
          const score = groupScores[dimension] || 0;
          const maxScore = MAX_SCORES[dimension as keyof typeof MAX_SCORES];
          const level = getDimensionLevel(score, maxScore);

          return (
            <div
              key={dimension}
              className={`${styles.dimensionTab} ${
                activeDimension === dimension ? styles.active : ""
              }`}
              onClick={() =>
                setActiveDimension(
                  dimension === activeDimension ? null : dimension
                )
              }
            >
              <div className={styles.tabHeader}>
                <span className={styles.dimensionCode}>{dimension}</span>
                <span className={styles.dimensionName}>
                  {
                    dimensionDescriptions[
                      dimension as keyof typeof dimensionDescriptions
                    ]
                  }
                </span>
              </div>

              {activeDimension === dimension && (
                <div className={styles.interpretationContent}>
                  <p>
                    {t(`interpretation.${dimension.toLowerCase()}.${level}`)}
                  </p>

                  {dimension === "NS" && level === "high" && (
                    <div className={styles.advice}>
                      <h5>참고 사항</h5>
                      <p>
                        새로운 경험을 추구하는 성향이 강하지만, 위험한 행동을
                        피하기 위해 상황을 미리 평가하는 습관을 들이는 것이
                        도움이 될 수 있습니다.
                      </p>
                    </div>
                  )}

                  {dimension === "HA" && level === "high" && (
                    <div className={styles.advice}>
                      <h5>참고 사항</h5>
                      <p>
                        불안감을 줄이기 위해 명상, 심호흡과 같은 이완 기법을
                        연습하고, 작은 단계로 두려운 상황에 노출되는 연습이
                        도움이 될 수 있습니다.
                      </p>
                    </div>
                  )}

                  {dimension === "SD" && level === "low" && (
                    <div className={styles.advice}>
                      <h5>참고 사항</h5>
                      <p>
                        목표 설정 기술을 향상시키고 자기 인식 연습을 통해 자신의
                        가치와 강점을 발견하는 것이 도움이 될 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.strengthsWeaknesses}>
        <div className={styles.strengths}>
          <h4>강점</h4>
          <ul>
            {(groupScores.NS || 0) / MAX_SCORES.NS > 0.6 && (
              <li>새로운 아이디어와 경험에 대한 개방성</li>
            )}
            {(groupScores.PS || 0) / MAX_SCORES.PS > 0.6 && (
              <li>목표 달성을 위한 강한 인내심과 끈기</li>
            )}
            {(groupScores.CO || 0) / MAX_SCORES.CO > 0.6 && (
              <li>타인과의 협력 및 공감 능력</li>
            )}
            {(groupScores.SD || 0) / MAX_SCORES.SD > 0.6 && (
              <li>자기 주도적 행동과 책임감</li>
            )}
          </ul>
        </div>

        <div className={styles.challenges}>
          <h4>개발 영역</h4>
          <ul>
            {(groupScores.HA || 0) / MAX_SCORES.HA > 0.6 && (
              <li>불안감 관리 및 위험을 과대평가하는 경향 극복</li>
            )}
            {(groupScores.NS || 0) / MAX_SCORES.NS > 0.7 && (
              <li>충동성 조절과 계획적 행동</li>
            )}
            {(groupScores.SD || 0) / MAX_SCORES.SD < 0.4 && (
              <li>자기 효능감 및 목표 지향적 사고 개발</li>
            )}
            {(groupScores.CO || 0) / MAX_SCORES.CO < 0.4 && (
              <li>대인관계 기술 향상 및 타인의 관점 이해</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TCIInterpretation;
