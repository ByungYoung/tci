"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "next-i18next";
import styles from "@/styles/tci.module.css";
import { dimensionDescriptions } from "@/lib/tci-data";

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface TCIChartProps {
  groupScores: { [key: string]: number };
}

const TCIChart = ({ groupScores }: TCIChartProps) => {
  const { t } = useTranslation("common");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // 색상 구성
  const temperamentColor = "rgba(75, 192, 192, 0.6)";
  const characterColor = "rgba(153, 102, 255, 0.6)";

  useEffect(() => {
    if (!chartRef.current) return;

    // 이전 차트 인스턴스 제거
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // 차트 데이터 준비
    const temperamentLabels = ["NS", "HA", "RD", "PS"];
    const characterLabels = ["SD", "CO", "ST"];

    // 값 정규화 (0-100 범위로)
    const maxValues = {
      NS: 40,
      HA: 35,
      RD: 24,
      PS: 35,
      SD: 44,
      CO: 42,
      ST: 33,
    };

    // 기질 차원과 성격 차원 데이터 구분
    const temperamentData = temperamentLabels.map(
      (label) =>
        ((groupScores[label] || 0) /
          maxValues[label as keyof typeof maxValues]) *
        100
    );

    const characterData = characterLabels.map(
      (label) =>
        ((groupScores[label] || 0) /
          maxValues[label as keyof typeof maxValues]) *
        100
    );

    // 차트 생성
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          t("ns_desc"),
          t("ha_desc"),
          t("rd_desc"),
          t("ps_desc"),
          t("sd_desc"),
          t("co_desc"),
          t("st_desc"),
        ],
        datasets: [
          {
            label: t("temperament"),
            data: [...temperamentData, 0, 0, 0],
            backgroundColor: temperamentColor,
            borderColor: temperamentColor.replace("0.6", "1"),
            borderWidth: 2,
            pointBackgroundColor: temperamentColor.replace("0.6", "1"),
            pointRadius: 4,
          },
          {
            label: t("character"),
            data: [0, 0, 0, 0, ...characterData],
            backgroundColor: characterColor,
            borderColor: characterColor.replace("0.6", "1"),
            borderWidth: 2,
            pointBackgroundColor: characterColor.replace("0.6", "1"),
            pointRadius: 4,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const datasetLabel = context.dataset.label || "";
                const rawValue = context.raw as number;
                if (rawValue === 0) return "";

                // 차원 라벨 추출
                const dimensionIndex = context.dataIndex;
                const allLabels = [...temperamentLabels, ...characterLabels];
                const dimensionKey = allLabels[dimensionIndex];

                if (dimensionKey) {
                  // 원래 점수 계산
                  const originalScore = groupScores[dimensionKey] || 0;
                  const maxValue =
                    maxValues[dimensionKey as keyof typeof maxValues];
                  return `${dimensionKey} (${
                    dimensionDescriptions[
                      dimensionKey as keyof typeof dimensionDescriptions
                    ]
                  }): ${originalScore}/${maxValue}`;
                }
                return `${datasetLabel}: ${rawValue.toFixed(1)}%`;
              },
            },
          },
        },
        maintainAspectRatio: false,
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [groupScores, t]);

  return (
    <div className={styles.resultChart}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default TCIChart;
