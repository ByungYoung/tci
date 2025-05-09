"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import styles from "@/styles/tci.module.css";
import {
  TCIResponse,
  calculateTCIScore,
  dimensionDescriptions,
  subdimensionDescriptions,
  TCICalculatedResult,
} from "@/lib/tci-data";
import { saveTCIResults, generateShareUrl } from "@/lib/supabase-service";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "react-share";
import TCIChart from "./TCIChart";
import TCIInterpretation from "./TCIInterpretation";

interface TCIResultProps {
  responses: TCIResponse;
  onRestart: () => void;
  resultId?: string;
}

const TCIResult = ({
  responses,
  onRestart,
  resultId: propResultId,
}: TCIResultProps) => {
  const { t } = useTranslation("common");
  const [result, setResult] = useState<TCICalculatedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [resultId, setResultId] = useState<string | undefined>(propResultId);

  useEffect(() => {
    // 계산 결과 저장
    try {
      const calculatedResult = calculateTCIScore(responses);
      setResult(calculatedResult);

      // 이미 결과 ID가 있으면 공유 URL 생성
      if (propResultId) {
        setResultId(propResultId);
        setShareUrl(generateShareUrl(propResultId));
      }
    } catch (err) {
      console.error("Error calculating TCI score:", err);
      setError("결과 계산 중 오류가 발생했습니다.");
    }
  }, [responses, propResultId]);

  const handleSaveResult = async () => {
    try {
      if (!result) return;

      setIsSaving(true);
      // 타입 안정성이 향상된 함수 호출
      const savedId = await saveTCIResults(responses, result);
      setResultId(savedId);
      setShareUrl(generateShareUrl(savedId));
      setIsSaved(true);
      setIsSaving(false);
    } catch (err) {
      console.error("Error saving TCI result:", err);
      // 사용자 친화적인 에러 메시지
      setError(
        "결과를 저장하는 중 문제가 발생했습니다. 나중에 다시 시도해주세요."
      );
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!result) return <div>{t("calculating")}</div>;

  // 타당도 검사 결과에 따라 표시
  if (result && result.validity && !result.validity.allValid) {
    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("results_title")}</h1>
        </div>

        <div className={styles.warning}>
          <p>
            <strong>{t("validity_warning")}</strong>
          </p>
          <p>{t("validity_message")}</p>
          <ul>
            {result.validity.details
              .filter((detail: any) => !detail.valid)
              .map((detail: any) => (
                <li key={detail.item}>
                  {detail.item}
                  {t("expected")} {detail.expected} ({t("actual")}:{" "}
                  {detail.actual || t("no_response")})
                </li>
              ))}
          </ul>
          <p>{t("validity_restart")}</p>
        </div>

        <div className={styles.buttonsContainer}>
          <button
            onClick={onRestart}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            {t("restart")}
          </button>
        </div>
      </div>
    );
  }

  // 정상 결과 표시
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("results_title")}</h1>
        <p className={styles.subtitle}>{t("results_subtitle")}</p>
      </div>

      {/* 레이더 차트 표시 */}
      <div className={styles.chartContainer}>
        <h2 className={styles.sectionTitle}>{t("results_info")}</h2>
        <TCIChart groupScores={result.groupScores} />
      </div>

      <div className={styles.resultsContainer}>
        <div className={styles.resultSection}>
          <h2 className={styles.resultTitle}>{t("temperament")}</h2>

          {/* 자극추구(NS) */}
          <div className={styles.dimension}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.NS}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.NS} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.NS / 40) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("ns_desc")}</div>

            {/* 하위 척도 */}
            {(
              ["NS1", "NS2", "NS3", "NS4"] as Array<
                keyof typeof subdimensionDescriptions
              >
            ).map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 10) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 위험회피(HA) */}
          <div className={styles.dimension} style={{ marginTop: "30px" }}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.HA}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.HA} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.HA / 35) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("ha_desc")}</div>

            {/* 하위 척도 */}
            {["HA1", "HA2", "HA3", "HA4"].map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 10) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 사회적 민감성(RD) */}
          <div className={styles.dimension} style={{ marginTop: "30px" }}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.RD}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.RD} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.RD / 24) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("rd_desc")}</div>

            {/* 하위 척도 */}
            {["RD1", "RD2", "RD3"].map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 10) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 인내력(PS) */}
          <div className={styles.dimension} style={{ marginTop: "30px" }}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.PS}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.PS} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.PS / 35) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("ps_desc")}</div>

            {/* 하위 척도 */}
            {["PS1", "PS2", "PS3", "PS4"].map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 10) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.resultSection}>
          <h2 className={styles.resultTitle}>{t("character")}</h2>

          {/* 자율성(SD) */}
          <div className={styles.dimension}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.SD}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.SD} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.SD / 44) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("sd_desc")}</div>

            {/* 하위 척도 */}
            {["SD1", "SD2", "SD3", "SD4", "SD5"].map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 10) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 연대감(CO) */}
          <div className={styles.dimension} style={{ marginTop: "30px" }}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.CO}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.CO} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.CO / 42) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("co_desc")}</div>

            {/* 하위 척도 */}
            {["CO1", "CO2", "CO3", "CO4", "CO5"].map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 10) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 자기초월(ST) */}
          <div className={styles.dimension} style={{ marginTop: "30px" }}>
            <div className={styles.dimensionHeader}>
              <div className={styles.dimensionName}>
                {dimensionDescriptions.ST}
              </div>
              <div className={styles.dimensionScore}>
                {result.groupScores.ST} {t("point")}
              </div>
            </div>
            <div className={styles.dimensionBar}>
              <div
                className={styles.dimensionFill}
                style={{ width: `${(result.groupScores.ST / 33) * 100}%` }}
              ></div>
            </div>
            <div className={styles.explanation}>{t("st_desc")}</div>

            {/* 하위 척도 */}
            {["ST1", "ST2", "ST3"].map((dim) => (
              <div
                key={dim}
                className={styles.dimension}
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                <div className={styles.dimensionHeader}>
                  <div className={styles.dimensionName}>
                    {subdimensionDescriptions[dim]}
                  </div>
                  <div className={styles.dimensionScore}>
                    {result.dimensionScores[dim] || 0} {t("point")}
                  </div>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${
                        ((result.dimensionScores[dim] || 0) / 11) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 개인화된 해석 섹션 */}
        <div className={styles.resultSection}>
          <TCIInterpretation groupScores={result.groupScores} />
        </div>
      </div>

      {/* 결과 저장 및 공유 버튼 */}
      <div className={styles.shareContainer}>
        {!resultId && (
          <button
            onClick={handleSaveResult}
            className={`${styles.button} ${styles.buttonSecondary}`}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : t("save")}
          </button>
        )}

        {isSaved && <div className={styles.savedMessage}>{t("saved")}</div>}

        {shareUrl && (
          <div className={styles.shareButtons}>
            <h3>{t("share")}</h3>
            <button
              onClick={handleCopyLink}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              {t("copy_link")}
            </button>
            <div className={styles.socialButtons}>
              <FacebookShareButton
                url={shareUrl}
                className={styles.socialButton}
              >
                <span>Facebook</span>
              </FacebookShareButton>
              <TwitterShareButton
                url={shareUrl}
                className={styles.socialButton}
              >
                <span>Twitter</span>
              </TwitterShareButton>
              <EmailShareButton
                url={shareUrl}
                subject="TCI 검사 결과"
                className={styles.socialButton}
              >
                <span>Email</span>
              </EmailShareButton>
            </div>
          </div>
        )}
      </div>

      {/* 재시작 버튼 */}
      <div className={styles.buttonsContainer} style={{ marginTop: "30px" }}>
        <button
          onClick={onRestart}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {t("restart")}
        </button>
      </div>
    </div>
  );
};

export default TCIResult;
