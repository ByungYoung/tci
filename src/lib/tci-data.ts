// TCI 문항 및 채점 로직 모듈

export type TCIItem = {
  id: number;
  question: string;
  dimension: string;
  scoring: "정방향" | "역방향" | "-";
};

export type TCIResponse = {
  [key: number]: number;
};

export interface TCICalculatedResult {
  validity: {
    allValid: boolean;
    details: Array<{
      item: number;
      expected: number;
      actual: number | null;
      valid: boolean;
    }>;
  };
  dimensionScores: { [key: string]: number };
  groupScores: { [key: string]: number };
}

// 타당도 검사 문항 정보
export const validityItems = {
  36: 4, // 4번에 표시해야 함
  101: 1, // 1번에 표시해야 함
  120: 5, // 5번에 표시해야 함
  132: 2, // 2번에 표시해야 함
};

// 차원별 하위 척도
export const dimensionGroups = {
  NS: ["NS1", "NS2", "NS3", "NS4"],
  HA: ["HA1", "HA2", "HA3", "HA4"],
  RD: ["RD1", "RD2", "RD3"],
  PS: ["PS1", "PS2", "PS3", "PS4"],
  SD: ["SD1", "SD2", "SD3", "SD4", "SD5"],
  CO: ["CO1", "CO2", "CO3", "CO4", "CO5"],
  ST: ["ST1", "ST2", "ST3"],
};

// 차원별 설명
export const dimensionDescriptions = {
  NS: "자극추구 (Novelty Seeking)",
  HA: "위험회피 (Harm Avoidance)",
  RD: "사회적 민감성 (Reward Dependence)",
  PS: "인내력 (Persistence)",
  SD: "자율성 (Self-Directedness)",
  CO: "연대감 (Cooperativeness)",
  ST: "자기초월 (Self-Transcendence)",
};

// 하위 척도 설명
export const subdimensionDescriptions = {
  NS1: "탐색적 흥분",
  NS2: "충동성",
  NS3: "낭비성",
  NS4: "무질서",
  HA1: "예기불안",
  HA2: "불확실성에 대한 두려움",
  HA3: "낯선 사람에 대한 수줍음",
  HA4: "쉽게 피로해짐",
  RD1: "감상성",
  RD2: "애착심",
  RD3: "의존성",
  PS1: "근면성",
  PS2: "인내력",
  PS3: "야심찬",
  PS4: "완벽주의",
  SD1: "책임감",
  SD2: "목적성",
  SD3: "자원개발성",
  SD4: "자기수용성",
  SD5: "의지적 자제력",
  CO1: "사회적 수용성",
  CO2: "공감성",
  CO3: "유용성",
  CO4: "연민",
  CO5: "양심성",
  ST1: "자기망각성",
  ST2: "범우주적 동일시",
  ST3: "영성수용",
};

// TCI 검사 문항 데이터
export const tciItems: TCIItem[] = [
  {
    id: 1,
    question:
      "나는 대부분의 사람들이 시간 낭비라고 생각하는 일이라도 재미나 스릴을 위해 새로운 것에 도전합니다",
    dimension: "NS1",
    scoring: "정방향",
  },
  {
    id: 2,
    question:
      "나는 대부분의 사람들이 걱정하는 상황에서도 보통 모든 것이 잘 될 것이라고 자신합니다",
    dimension: "HA1",
    scoring: "역방향",
  },
  {
    id: 3,
    question: "나는 종종 내가 환경의 피해자라고 느낍니다",
    dimension: "SD1",
    scoring: "역방향",
  },
  {
    id: 4,
    question:
      "나는 보통 다른 사람들이 나와 매우 다르더라도 있는 그대로 받아들일 수 있습니다",
    dimension: "CO1",
    scoring: "정방향",
  },
  {
    id: 5,
    question: "나는 쉬운 일보다 도전적인 일을 더 좋아합니다",
    dimension: "PS3",
    scoring: "정방향",
  },
  {
    id: 6,
    question: "나는 종종 내 삶이 목적이나 의미가 거의 없다고 느낍니다",
    dimension: "SD2",
    scoring: "역방향",
  },
  {
    id: 7,
    question:
      "나는 모두가 이익을 얻을 수 있는 문제 해결책을 찾는 것을 좋아합니다",
    dimension: "CO3",
    scoring: "정방향",
  },
  {
    id: 8,
    question: "나는 보통 해야 할 일이 있으면 즉시 시작하고 싶어합니다",
    dimension: "PS1",
    scoring: "정방향",
  },
  {
    id: 9,
    question:
      "나는 다른 사람들이 별로 걱정하지 않더라도 낯선 상황에서 종종 긴장하고 불안해합니다",
    dimension: "HA1",
    scoring: "정방향",
  },
  {
    id: 10,
    question:
      "나는 과거 경험을 고려하지 않고 종종 그 순간의 느낌에 따라 행동합니다",
    dimension: "NS2",
    scoring: "정방향",
  },
  {
    id: 11,
    question:
      "나는 보통 다른 사람들의 요구에 굴복하기보다는 내 방식대로 일을 합니다",
    dimension: "SD5",
    scoring: "정방향",
  },
  {
    id: 12,
    question: "나는 종종 주변의 모든 것들과 강한 일체감을 느낍니다",
    dimension: "ST2",
    scoring: "정방향",
  },
  {
    id: 13,
    question:
      "나는 수많은 오랜 친구의 신뢰를 잃더라도 부유하고 유명해지고자 합법적인 거의 모든 일을 할 것입니다",
    dimension: "CO5",
    scoring: "역방향",
  },
  {
    id: 14,
    question:
      "나는 대부분의 사람들보다 훨씬 더 자제력이 있고 충동을 잘 통제합니다",
    dimension: "NS2",
    scoring: "역방향",
  },
  {
    id: 15,
    question:
      "나는 내 경험과 감정을 혼자 간직하기보다 친구들과 터놓고 이야기하는 것을 좋아합니다",
    dimension: "RD2",
    scoring: "정방향",
  },
  {
    id: 16,
    question: "나는 다른 사람들보다 쉽게 피로해집니다",
    dimension: "HA4",
    scoring: "정방향",
  },
  {
    id: 17,
    question: "나는 내가 하고 싶은 것을 선택할 자유를 거의 느끼지 못합니다",
    dimension: "SD5",
    scoring: "역방향",
  },
  {
    id: 18,
    question: "나는 대부분의 사람들을 잘 이해하지 못하는 것 같습니다",
    dimension: "CO2",
    scoring: "역방향",
  },
  {
    id: 19,
    question:
      "나는 낯선 사람을 만날 때 자신감이 부족하여 종종 그런 상황을 피합니다",
    dimension: "HA3",
    scoring: "정방향",
  },
  {
    id: 20,
    question: "나는 다른 사람들을 가능한 한 기쁘게 해주고 싶습니다",
    dimension: "RD3",
    scoring: "정방향",
  },
  {
    id: 21,
    question:
      "나는 종종 내가 다른 모든 사람보다 더 똑똑했으면 좋겠다고 생각합니다",
    dimension: "SD4",
    scoring: "역방향",
  },
  {
    id: 22,
    question: "어떤 일도 내가 최선을 다한다면 그리 어렵지 않습니다",
    dimension: "PS3",
    scoring: "정방향",
  },
  {
    id: 23,
    question:
      "나는 종종 다른 사람이 내 문제에 대한 해결책을 제공해주기를 기다립니다",
    dimension: "SD3",
    scoring: "역방향",
  },
  {
    id: 24,
    question:
      "나는 종종 현금이 떨어지거나 감당 어려운 카드빚을 지게 될 때까지 돈을 씁니다",
    dimension: "NS3",
    scoring: "정방향",
  },
  {
    id: 25,
    question: "종종 휴식 중에 갑작스러운 통찰이나 이해의 순간이 찾아옵니다",
    dimension: "ST1",
    scoring: "정방향",
  },
  {
    id: 26,
    question:
      "나는 다른 사람들이 나를 좋아하는지 또는 내 행동 방식을 좋아하는지에 대해 크게 신경 쓰지 않습니다",
    dimension: "RD3",
    scoring: "역방향",
  },
  {
    id: 27,
    question:
      "나는 보통 모든 사람을 만족시키는 것은 불가능하기 때문에 나 자신을 위해 원하는 것만 얻으려고 합니다",
    dimension: "CO3",
    scoring: "역방향",
  },
  {
    id: 28,
    question: "내 견해를 받아들이지 않는 사람들에 대해 참을성이 없습니다",
    dimension: "CO1",
    scoring: "역방향",
  },
  {
    id: 29,
    question:
      "나는 때때로 자연과 너무 깊이 연결되어 있어서 모든 것이 하나의 살아있는 과정의 일부처럼 느껴집니다",
    dimension: "ST2",
    scoring: "정방향",
  },
  {
    id: 30,
    question:
      "낯선 사람들을 만날 때 나는 대부분의 사람들보다 더 수줍음을 탑니다",
    dimension: "HA3",
    scoring: "정방향",
  },
  {
    id: 31,
    question: "나는 대부분의 사람들보다 더 감성적입니다",
    dimension: "RD1",
    scoring: "정방향",
  },
  {
    id: 32,
    question: "나는 기적이라고 불리는 것들이 단지 우연이라고 생각합니다",
    dimension: "ST3",
    scoring: "역방향",
  },
  {
    id: 33,
    question:
      "누군가가 나를 어떤 식으로든 다치게 하면, 나는 보통 보복하려고 합니다",
    dimension: "CO4",
    scoring: "역방향",
  },
  {
    id: 34,
    question: "내 행동은 대부분 내가 통제할 수 없습니다",
    dimension: "SD1",
    scoring: "역방향",
  },
  {
    id: 35,
    question: "나는 매일 내 목표를 향해 한 걸음 더 나아가려고 노력합니다",
    dimension: "SD2",
    scoring: "정방향",
  },
  {
    id: 36,
    question: "(타당도 체크 문항) 4번에 표시해 주세요",
    dimension: "타당도",
    scoring: "-",
  },
  {
    id: 37,
    question: "나는 매우 야망이 큰 사람입니다",
    dimension: "PS3",
    scoring: "정방향",
  },
  {
    id: 38,
    question:
      "나는 대부분의 사람들이 신체적으로 위험하다고 생각하는 상황에서도 보통 침착하고 안전하게 지냅니다",
    dimension: "HA2",
    scoring: "역방향",
  },
  {
    id: 39,
    question:
      "나는 스스로 감당하지 못하는 약한 사람들을 돕는 것이 어리석다고 생각합니다",
    dimension: "CO4",
    scoring: "역방향",
  },
  {
    id: 40,
    question:
      "다른 사람들이 나에게 불공정하게 대해도, 내가 그들을 불공정하게 대우한다면 마음이 편치 않습니다",
    dimension: "CO5",
    scoring: "정방향",
  },
  {
    id: 41,
    question: "사람들은 보통 자신의 감정을 나에게 솔직히 털어놓습니다",
    dimension: "RD2",
    scoring: "정방향",
  },
  {
    id: 42,
    question:
      "때때로 나는 시간 · 공간에 제한도 경계도 없는 무언가의 일부인 것처럼 느꼈습니다",
    dimension: "ST2",
    scoring: "정방향",
  },
  {
    id: 43,
    question:
      "나는 가끔 말로 설명할 수 없는 다른 사람들과의 영적 연결을 느낍니다",
    dimension: "ST2",
    scoring: "정방향",
  },
  {
    id: 44,
    question:
      "나는 사람들이 엄격한 규칙과 규정 없이 자유롭게 행동할 수 있을 때가 좋습니다",
    dimension: "NS4",
    scoring: "정방향",
  },
  {
    id: 45,
    question:
      "내가 어떤 일에 실패하면, 더 잘하기 위해 더욱 마음을 굳게 먹습니다",
    dimension: "PS1",
    scoring: "정방향",
  },
  {
    id: 46,
    question:
      "나는 보통 미래에 무언가 잘못될 수 있다는 것에 대해 대부분의 사람들보다 더 걱정합니다",
    dimension: "HA1",
    scoring: "정방향",
  },
  {
    id: 47,
    question: "나는 보통 결정을 내리기 전에 모든 사실을 자세히 고려합니다",
    dimension: "NS2",
    scoring: "역방향",
  },
  {
    id: 48,
    question: "나는 고치고 싶은 많은 나쁜 습관들이 있습니다",
    dimension: "SD5",
    scoring: "역방향",
  },
  {
    id: 49,
    question: "다른 사람들이 나를 너무 많이 통제합니다",
    dimension: "SD1",
    scoring: "역방향",
  },
  {
    id: 50,
    question: "나는 다른 사람들에게 도움이 되는 것을 좋아합니다",
    dimension: "CO3",
    scoring: "정방향",
  },
  {
    id: 51,
    question:
      "내가 하는 말이 과장되거나 거짓임을 알더라도, 나는 보통 다른 사람들이 나를 믿게 할 수 있습니다",
    dimension: "CO5",
    scoring: "역방향",
  },
  {
    id: 52,
    question:
      "때때로 내 삶이 인간보다 더 큰 영적 힘에 의해 인도되고 있다고 느꼈습니다",
    dimension: "ST3",
    scoring: "정방향",
  },
  {
    id: 53,
    question:
      "나는 매우 실용적이고 감정에 휘둘리지 않는 사람으로 알려져 있습니다",
    dimension: "RD1",
    scoring: "역방향",
  },
  {
    id: 54,
    question:
      "나는 감성적인 호소(예: 장애아동 돕기, 수재민 구호자금 요청 등)에 깊이 감동합니다",
    dimension: "RD1",
    scoring: "정방향",
  },
  {
    id: 55,
    question:
      "나는 보통 다른 사람들이 포기한 후에도 계속 일할 만큼 매우 끈기가 있습니다",
    dimension: "PS2",
    scoring: "정방향",
  },
  {
    id: 56,
    question:
      "나는 갑자기 모든 존재와 하나가 된 명확하고 깊은 느낌을 가진 큰 기쁨의 순간들을 경험했습니다",
    dimension: "ST2",
    scoring: "정방향",
  },
  {
    id: 57,
    question: "나는 내 인생에서 무엇을 하고 싶은지 알고 있습니다",
    dimension: "SD2",
    scoring: "정방향",
  },
  {
    id: 58,
    question:
      "나는 종종 무엇을 해야 할지 모르기 때문에 문제를 해결할 수 없습니다",
    dimension: "SD3",
    scoring: "역방향",
  },
  {
    id: 59,
    question: "나는 돈을 저축하기보다 쓰는 것을 선호합니다",
    dimension: "NS3",
    scoring: "정방향",
  },
  {
    id: 60,
    question:
      "나는 열심히 일하는 것을 좋아해서 종종 일벌레나 일중독이라고 불립니다",
    dimension: "PS1",
    scoring: "정방향",
  },
  {
    id: 61,
    question: "나는 부끄럽거나 굴욕적인 상황에서도 금방 회복됩니다",
    dimension: "HA1",
    scoring: "역방향",
  },
  {
    id: 62,
    question:
      "나는 삶에서 더 크고 더 나은 것들을 위해 노력하는 것을 좋아합니다",
    dimension: "PS3",
    scoring: "정방향",
  },
  {
    id: 63,
    question:
      "내가 해 오던 방식을 바꾸려면 그럴 만한 중요한 실용적인 이유가 있어야 합니다",
    dimension: "NS1",
    scoring: "역방향",
  },
  {
    id: 64,
    question:
      "다른 모든 사람이 두려워할 때도 나는 거의 항상 편안하고 걱정이 없습니다",
    dimension: "HA2",
    scoring: "역방향",
  },
  {
    id: 65,
    question: "나는 슬픈 노래와 영화를 지루하게 느낍니다",
    dimension: "RD1",
    scoring: "역방향",
  },
  {
    id: 66,
    question: "상황이 종종 내 의지와 상관없이 일을 하도록 강요합니다",
    dimension: "SD1",
    scoring: "역방향",
  },
  {
    id: 67,
    question: "나는 보통 나에게 나쁘게 굴었던 사람에게 보복하는 것을 즐깁니다",
    dimension: "CO4",
    scoring: "역방향",
  },
  {
    id: 68,
    question:
      "나는 종종 내가 하는 일에 너무 몰두해서, 시간과 공간을 잊은 채 완전히 빠져들게 됩니다",
    dimension: "ST1",
    scoring: "정방향",
  },
  {
    id: 69,
    question: "내 삶에 대한 진정한 목적 의식이 없다고 느낍니다",
    dimension: "SD2",
    scoring: "역방향",
  },
  {
    id: 70,
    question:
      "다른 사람들은 전혀 위험이 없다고 느낄지라도, 나는 낯선 상황에서 종종 긴장하고 걱정합니다",
    dimension: "HA2",
    scoring: "정방향",
  },
  {
    id: 71,
    question:
      "나는 종종 아주 세부적인 디테일을 고려하기보다는, 직감이나 직관을 따릅니다",
    dimension: "NS2",
    scoring: "정방향",
  },
  {
    id: 72,
    question:
      "나는 내가 하는 모든 일에서 남들보다 뛰어나게 잘하는 것을 좋아합니다",
    dimension: "PS4",
    scoring: "정방향",
  },
  {
    id: 73,
    question:
      "나는 종종 내 주변의 모든 사람들과 강한 영적 또는 감정적 연결을 느낍니다",
    dimension: "ST2",
    scoring: "정방향",
  },
  {
    id: 74,
    question:
      "나는 보통 다른 사람들을 정말로 이해하기 위해 입장을 바꾸어 봅니다",
    dimension: "CO2",
    scoring: "정방향",
  },
  {
    id: 75,
    question:
      "공정함과 정직함과 같은 원칙들은 내 삶의 어떤 부분에서는 거의 중요하지 않습니다",
    dimension: "CO5",
    scoring: "역방향",
  },
  {
    id: 76,
    question: "나는 대부분의 사람보다 더 열심히 일합니다",
    dimension: "PS2",
    scoring: "정방향",
  },
  {
    id: 77,
    question:
      "대부분의 사람들이 대수롭지 않게 느낄지라도, 나는 모든 일이 엄격하고 질서 있게 수행되어야 한다고 주장합니다",
    dimension: "PS4",
    scoring: "정방향",
  },
  {
    id: 78,
    question: "나는 거의 모든 사회적 상황에서 매우 자신감 있고 확신을 가집니다",
    dimension: "HA3",
    scoring: "역방향",
  },
  {
    id: 79,
    question:
      "내가 거의 개인적인 생각을 말하지 않기 때문에, 내 친구들은 내 감정을 알기 어렵다고 합니다",
    dimension: "RD2",
    scoring: "역방향",
  },
  {
    id: 80,
    question: "나는 다른 사람들에게 내 감정을 전달하는 데 능숙합니다",
    dimension: "RD2",
    scoring: "정방향",
  },
  {
    id: 81,
    question: "나는 대부분의 사람들보다 더 활력이 넘치고 덜 피곤해집니다",
    dimension: "HA4",
    scoring: "역방향",
  },
  {
    id: 82,
    question:
      "내 친구들이 모든 것이 잘 될 거라고 말해도 내가 하던 일을 멈추게 될 만큼 걱정하곤 합니다",
    dimension: "HA1",
    scoring: "정방향",
  },
  {
    id: 83,
    question: "종종 나는 다른 모든 사람보다 더 강력한 힘을 갖고 싶습니다",
    dimension: "SD4",
    scoring: "역방향",
  },
  {
    id: 84,
    question:
      "팀에서 대부분의 구성원들은 공정한 대우를 받지 못한다고 생각합니다",
    dimension: "CO1",
    scoring: "역방향",
  },
  {
    id: 85,
    question: "나는 다른 사람들을 기쁘게 하려고 굳이 노력하지 않습니다",
    dimension: "RD3",
    scoring: "역방향",
  },
  {
    id: 86,
    question: "나는 낯선 사람들에게 전혀 수줍음을 타지 않습니다",
    dimension: "HA3",
    scoring: "역방향",
  },
  {
    id: 87,
    question:
      "나는 내게 정말 중요하지 않지만 필요하다고 생각되는 일을 하는 데 대부분의 시간을 씁니다",
    dimension: "SD2",
    scoring: "역방향",
  },
  {
    id: 88,
    question:
      "나는 종교적 또는 윤리적 신념이 비즈니스 결정에 큰 영향을 미쳐서는 안 된다고 생각합니다",
    dimension: "CO5",
    scoring: "역방향",
  },
  {
    id: 89,
    question:
      "나는 종종 다른 사람들의 경험을 더 잘 이해하기 위해 내 자신의 판단을 제쳐두려고 노력합니다",
    dimension: "CO2",
    scoring: "정방향",
  },
  {
    id: 90,
    question: "내 나쁜 습관들 때문에 가치 있는 목표에 도달하기 어렵습니다",
    dimension: "SD5",
    scoring: "역방향",
  },
  {
    id: 91,
    question:
      "전쟁, 빈곤, 불의 등을 방지하려는 노력처럼 세상을 더 나은 곳으로 만들기 위해 진정한 개인적 희생을 해왔습니다",
    dimension: "CO3",
    scoring: "정방향",
  },
  {
    id: 92,
    question: "다른 사람들에게 마음을 열고 친해지는 데 시간이 오래 걸립니다",
    dimension: "RD2",
    scoring: "역방향",
  },
  {
    id: 93,
    question: "내 적들이 고통받는 것을 보면 기쁨을 느낍니다",
    dimension: "CO4",
    scoring: "역방향",
  },
  {
    id: 94,
    question: "일이 아무리 어려워도 빨리 시작하는 것을 좋아합니다",
    dimension: "PS1",
    scoring: "정방향",
  },
  {
    id: 95,
    question:
      "주변에서 일어나는 일들을 완전히 인식하지 못하여, 종종 다른 사람들은 내가 다른 세계에 있는 것처럼 느낍니다",
    dimension: "ST1",
    scoring: "정방향",
  },
  {
    id: 96,
    question:
      "일반적으로 나는 다른 사람들로부터 차갑고 거리를 두는 것을 좋아합니다",
    dimension: "RD2",
    scoring: "역방향",
  },
  {
    id: 97,
    question: "나는 대부분 사람보다 슬픈 영화를 보며 더 많이 웁니다",
    dimension: "RD1",
    scoring: "정방향",
  },
  {
    id: 98,
    question:
      "나는 대부분 사람보다 사소한 질병이나 스트레스로부터 더 빠르게 회복됩니다",
    dimension: "HA4",
    scoring: "역방향",
  },
  {
    id: 99,
    question: "나는 종종 모든 생명이 의존하는 영적 힘의 일부라고 느낍니다",
    dimension: "ST3",
    scoring: "정방향",
  },
  {
    id: 100,
    question:
      "유혹에 빠질 때에도 내 자신을 믿을 수 있기 위해서, 나는 바람직한 습관을 더 많이 연습해야 합니다",
    dimension: "SD5",
    scoring: "역방향",
  },
  {
    id: 101,
    question: "(타당도 체크 문항) 1번에 표시해 주세요",
    dimension: "타당도",
    scoring: "-",
  },
  {
    id: 102,
    question:
      "나는 할 일을 빨리 처리하기 위해 신속하게 결정을 내리는 것을 좋아합니다",
    dimension: "NS2",
    scoring: "정방향",
  },
  {
    id: 103,
    question:
      "나는 보통 대부분의 사람들이 위험하다고 생각하는 일(예: 빙판길에서 자동차 운전하기)을 쉽게 할 수 있다고 자신합니다",
    dimension: "HA2",
    scoring: "역방향",
  },
  {
    id: 104,
    question: "나는 일을 하는 새로운 방식을 시도해보는 것을 좋아합니다",
    dimension: "NS1",
    scoring: "정방향",
  },
  {
    id: 105,
    question:
      "나는 오락이나 스릴을 위해 돈을 쓰는 것보다 돈을 저축하는 것을 더 즐깁니다",
    dimension: "NS3",
    scoring: "역방향",
  },
  {
    id: 106,
    question: "나는 신성하고 경이로운 영적 체험을 했습니다",
    dimension: "ST3",
    scoring: "정방향",
  },
  {
    id: 107,
    question: "내가 좋아하는 활동일지라도 종종 억지로 해야 합니다",
    dimension: "PS1",
    scoring: "역방향",
  },
  {
    id: 108,
    question: "나는 종종 사소한 일에 화를 내고 짜증을 냅니다",
    dimension: "SD5",
    scoring: "역방향",
  },
  {
    id: 109,
    question:
      "나는 강압적으로 보이는 것이 싫기 때문에, 타인에게 내 방식대로 하라고 거의 주장하지 않습니다",
    dimension: "CO1",
    scoring: "정방향",
  },
  {
    id: 110,
    question: "보통 모르는 사람에게 제가 먼저 다가가는 편입니다",
    dimension: "HA3",
    scoring: "역방향",
  },
  {
    id: 111,
    question:
      "게임이나 상상에 빠지면, 해야 할 다른 일들이 있다는 것을 알고 있어도 멈추기가 어렵습니다",
    dimension: "ST1",
    scoring: "정방향",
  },
  {
    id: 112,
    question:
      "누군가 내 이름을 부를 때도 종종 내 생각에 너무 빠져서 알아차리지 못합니다",
    dimension: "ST1",
    scoring: "정방향",
  },
  {
    id: 113,
    question: "나는 음식, 음료, 지출 등 어떤 것도 과하게 하지 않습니다",
    dimension: "NS3",
    scoring: "역방향",
  },
  {
    id: 114,
    question: "나는 다른 사람들의 일을 조직하거나 관리하는 것을 즐깁니다",
    dimension: "PS3",
    scoring: "정방향",
  },
  {
    id: 115,
    question:
      "다른 사람들과 함께 있어도 종종 외롭거나 고립되어 있다고 느낍니다",
    dimension: "RD2",
    scoring: "역방향",
  },
  {
    id: 116,
    question:
      "기분이 좋지 않을 때, 혼자 있을 때보다 보통 친구들과 함께 있으면 기분이 나아집니다",
    dimension: "RD2",
    scoring: "정방향",
  },
  {
    id: 117,
    question: "나는 종종 사람들이 기대하는 것보다 더 많은 것을 성취합니다",
    dimension: "PS2",
    scoring: "정방향",
  },
  {
    id: 118,
    question: "결정을 내린 후에도 가끔 그 결정에 대해 다시 고민합니다",
    dimension: "PS4",
    scoring: "역방향",
  },
  {
    id: 119,
    question:
      "나는 가급적 잘 하고 싶기 때문에 보통 사람들보다 더 열심히 노력합니다",
    dimension: "PS4",
    scoring: "정방향",
  },
  {
    id: 120,
    question: "(타당도 체크 문항) 5번에 표시해 주세요",
    dimension: "타당도",
    scoring: "-",
  },
  {
    id: 121,
    question:
      "나는 일반적으로 사소한 질병이나 스트레스 후에도 대부분의 사람들보다 훨씬 더 자신감 있고 활기차게 느낍니다",
    dimension: "HA4",
    scoring: "역방향",
  },
  {
    id: 122,
    question:
      "새로운 일이 일어나지 않을 때, 나는 보통 스릴이나 흥미로운 것을 찾기 시작합니다",
    dimension: "NS1",
    scoring: "정방향",
  },
  {
    id: 123,
    question:
      "나는 결정을 내리기 전에 오랫동안 신중하게 생각하는 것을 좋아합니다",
    dimension: "NS2",
    scoring: "역방향",
  },
  {
    id: 124,
    question: "나와 관련된 사람들은 내 방식대로 일하는 법을 배워야 합니다",
    dimension: "CO1",
    scoring: "역방향",
  },
  {
    id: 125,
    question: "나는 대부분의 사람들과 따뜻한 개인적 관계를 맺습니다",
    dimension: "RD2",
    scoring: "정방향",
  },
  {
    id: 126,
    question: "종종 사람들이 나를 보고 지나치게 열심히 일한다고 합니다",
    dimension: "PS2",
    scoring: "정방향",
  },
  {
    id: 127,
    question:
      "나는 타인과 함께 내 감정에 대해 이야기하기보다는 차라리 독서를 할 것입니다",
    dimension: "RD2",
    scoring: "역방향",
  },
  {
    id: 128,
    question: "나는 나를 다치게 한 사람들에게 복수하는 것이 좋습니다",
    dimension: "CO4",
    scoring: "역방향",
  },
  {
    id: 129,
    question:
      "무언가가 내 기대대로 작동하지 않으면, 끈기 있게 해결해보기보다는 포기하는 경향이 있습니다",
    dimension: "PS1",
    scoring: "역방향",
  },
  {
    id: 130,
    question: "다른 사람들이 정서적으로 나에게 가까워지는 것이 쉽습니다",
    dimension: "RD2",
    scoring: "정방향",
  },
  {
    id: 131,
    question:
      "낯선 사람들을 만날 때, 그들이 우호적인 사람들이 아니라고 할지라도 나는 편안하고 외향적으로 행동할 것입니다",
    dimension: "HA3",
    scoring: "역방향",
  },
  {
    id: 132,
    question: "(타당도 체크 문항) 2번에 표시해 주세요",
    dimension: "타당도",
    scoring: "-",
  },
  {
    id: 133,
    question: "보통 나와 다른 생각을 가진 사람들을 좋아하지 않습니다",
    dimension: "CO1",
    scoring: "역방향",
  },
  {
    id: 134,
    question:
      "나는 종종 어떤 프로젝트를 시작하기 전에 한동안 미루고 망설입니다",
    dimension: "PS1",
    scoring: "역방향",
  },
  {
    id: 135,
    question:
      "나는 보통 이야기를 재밌게 만들거나 장난치기 위해 진실을 과장하는 것을 잘합니다",
    dimension: "CO5",
    scoring: "역방향",
  },
  {
    id: 136,
    question:
      "긴장, 피로, 걱정 때문에 평소 하는 방식을 바꾸는 것은 매우 어렵습니다",
    dimension: "HA4",
    scoring: "정방향",
  },
  {
    id: 137,
    question: "나는 보통 사람들보다 완벽주의자입니다",
    dimension: "PS4",
    scoring: "정방향",
  },
  {
    id: 138,
    question:
      "다른 사람들이 바라는 일을 해주지 않기 때문에, 사람들은 종종 내가 너무 독립적이라고 생각합니다",
    dimension: "CO1",
    scoring: "역방향",
  },
  {
    id: 139,
    question: "나는 대부분 사람보다 저축을 잘합니다",
    dimension: "NS3",
    scoring: "역방향",
  },
  {
    id: 140,
    question:
      "일이 내가 생각했던 것보다 훨씬 더 오래 걸리면 종종 그 일을 포기합니다",
    dimension: "PS1",
    scoring: "역방향",
  },
];

// TCI 채점 로직
export const calculateTCIScore = (
  responses: TCIResponse
): TCICalculatedResult => {
  if (!responses) {
    return {
      error: "응답 데이터가 없습니다.",
    } as unknown as TCICalculatedResult;
  }

  // 타당도 검사
  const validityCheck = checkValidity(responses);

  // 각 차원별 점수 계산
  const dimensionScores: { [key: string]: number } = {};

  // 각 문항별 점수 계산 및 차원별로 합산
  for (const item of tciItems) {
    const itemNum = item.id;
    const response = responses[itemNum];

    if (!response) continue;

    const dimension = item.dimension;
    const scoring = item.scoring;

    // 타당도 문항은 건너뛰기
    if (dimension === "타당도") continue;

    // 점수 계산 (정방향/역방향 고려)
    const score = scoreItem(response, scoring);

    // 점수 합산
    if (!dimensionScores[dimension]) {
      dimensionScores[dimension] = 0;
    }
    dimensionScores[dimension] += score;
  }

  // 차원 그룹별 총점 계산
  const groupScores: { [key: string]: number } = {};
  for (const [group, dims] of Object.entries(dimensionGroups)) {
    groupScores[group] = dims.reduce(
      (sum, dim) => sum + (dimensionScores[dim] || 0),
      0
    );
  }

  return {
    validity: validityCheck,
    dimensionScores,
    groupScores,
  };
};

// 문항 점수 계산
const scoreItem = (response: number, scoring: string) => {
  if (scoring === "정방향") {
    return response; // 1->1, 2->2, 3->3, 4->4, 5->5
  } else if (scoring === "역방향") {
    return 6 - response; // 1->5, 2->4, 3->3, 4->2, 5->1
  }
  return 0; // 타당도 문항 등
};

// 타당도 체크
const checkValidity = (responses: TCIResponse) => {
  const validityResults = [];

  for (const [itemNum, expectedResponse] of Object.entries(validityItems)) {
    const item = parseInt(itemNum);
    if (responses[item] !== undefined) {
      const actualResponse = responses[item];
      const isValid = actualResponse === expectedResponse;
      validityResults.push({
        item,
        expected: expectedResponse,
        actual: actualResponse,
        valid: isValid,
      });
    } else {
      validityResults.push({
        item,
        expected: expectedResponse,
        actual: null,
        valid: false,
      });
    }
  }

  // 모든 타당도 문항이 통과했는지 확인
  const allValid = validityResults.every((result) => result.valid);

  return {
    allValid,
    details: validityResults,
  };
};
