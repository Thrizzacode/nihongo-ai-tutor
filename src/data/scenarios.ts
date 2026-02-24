export interface ScenarioLine {
  speaker: "A" | "B";
  text: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  roles: { A: string; B: string };
  lines: ScenarioLine[];
}

export const scenarios: Scenario[] = [
  {
    id: "weekend-plan",
    title: "討論週末計畫",
    description: "兩個朋友在討論週末要去哪裡玩、吃什麼",
    roles: { A: "友人A", B: "友人B" },
    lines: [
      { speaker: "A", text: "欸，這禮拜六你有空嗎？如果有時間的話，要不要一起去哪裡玩？" },
      { speaker: "B", text: "禮拜六喔？下午應該有空，但早上我有點事。" },
      { speaker: "A", text: "是喔。你要幹嘛？" },
      { speaker: "B", text: "因為最近都沒什麼運動，所以想去健身房游泳。" },
      { speaker: "A", text: "游完泳之後要不要一起吃午餐？車站前面的義大利餐廳。" },
      { speaker: "B", text: "啊，那間喔！我去過一次，披薩超好吃的。" },
      { speaker: "A", text: "真的嗎？那就吃那間吧。" },
      { speaker: "B", text: "不過那間店週末很多人，如果不早點去的話可能沒位置。" },
      { speaker: "A", text: "了解。那就12 點半在車站見喔。別遲到喔。" },
      { speaker: "B", text: "放心啦。會遲到的話，我會再聯絡你！" },
      { speaker: "A", text: "OK。對了，你會喝酒嗎？" },
      { speaker: "B", text: "會啊，滿喜歡的。但下午就喝的話會想睡覺，所以喝一點點就好。" },
      { speaker: "A", text: "也是。那就當天見啦！" },
    ],
  },
];
