import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  bg: "#FDF6EF",
  card: "#FFFFFF",
  accent: "#E07A3A",
  accentLight: "#F5D5BF",
  accentSoft: "#FFF0E5",
  green: "#5A9E6F",
  greenLight: "#E8F5E9",
  greenSoft: "#F0F8F1",
  blue: "#5B8DB8",
  blueLight: "#E3EFF8",
  purple: "#8B7EC8",
  purpleLight: "#EDE8F8",
  rest: "#C4A882",
  restLight: "#F5EDE0",
  text: "#2D2A26",
  textSec: "#6B6560",
  textLight: "#9B9590",
  border: "#EDE6DD",
  divider: "#F0EAE2",
};

const fonts = {
  title: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Noto Sans SC', sans-serif",
};

const dayColors = {
  strength: { bg: COLORS.accentSoft, accent: COLORS.accent, badge: COLORS.accentLight },
  cardio: { bg: COLORS.greenSoft, accent: COLORS.green, badge: COLORS.greenLight },
  rest: { bg: COLORS.restLight, accent: COLORS.rest, badge: "#EDE2D4" },
};

const weekSchedule = [
  { day: "周一", label: "MON", type: "strength", title: "胸 + 肩 + 三头", icon: "💪" },
  { day: "周二", label: "TUE", type: "cardio", title: "低强度有氧", icon: "🚶‍♀️" },
  { day: "周三", label: "WED", type: "strength", title: "全身 + 核心", icon: "💪" },
  { day: "周四", label: "THU", type: "strength", title: "背 + 二头", icon: "💪" },
  { day: "周五", label: "FRI", type: "cardio", title: "低强度有氧", icon: "🚶‍♀️" },
  { day: "周六", label: "SAT", type: "strength", title: "核心 + 体态", icon: "🧘‍♀️" },
  { day: "周日", label: "SUN", type: "rest", title: "完全休息", icon: "😴" },
];

const strengthDiet = [
  {
    time: "7:30",
    meal: "早餐",
    tag: "BREAKFAST",
    items: [
      { cat: "碳水", name: "燕麦 + 牛奶", amount: "30g 燕麦" },
      { cat: "水果", name: "蓝莓", amount: "50g" },
      { cat: "蛋白质", name: "鸡蛋", amount: "2 个" },
      { cat: "补剂", name: "鱼油", amount: "2 粒" },
      { cat: "碳水", name: "面包 / 红薯 / 紫薯 / 南瓜", amount: "任选适量" },
    ],
  },
  {
    time: "12:00",
    meal: "午餐",
    tag: "LUNCH",
    items: [
      { cat: "蛋白质", name: "鸡肉 / 牛肉 / 去皮鸡腿", amount: "100-150g" },
      { cat: "蔬菜", name: "绿叶菜", amount: "不限量" },
    ],
    note: "主食挪到傍晚 · 这餐只吃蛋白 + 蔬菜",
  },
  {
    time: "16:00",
    meal: "力量训练",
    tag: "TRAINING",
    items: [{ cat: "训练", name: "按当日训练计划执行", amount: "60-75 min" }],
    highlight: true,
  },
  {
    time: "17:30",
    meal: "训练后",
    tag: "POST-WORKOUT",
    items: [
      { cat: "碳水", name: "香蕉", amount: "2-3 根" },
      { cat: "补剂", name: "蛋白粉", amount: "1 勺" },
    ],
    note: "训练后 30 分钟内 · 快速碳水先补一波",
    highlight: true,
  },
  {
    time: "19:00",
    meal: "晚餐",
    tag: "DINNER",
    items: [
      { cat: "碳水", name: "米饭（熟重）", amount: "150-200g" },
      { cat: "蛋白质", name: "鱼肉 / 鸡胸 / 牛肉", amount: "150-200g" },
      { cat: "蔬菜", name: "绿叶菜", amount: "不限量" },
      { cat: "脂肪", name: "坚果", amount: "20g" },
    ],
    note: "全天主要碳水在此 · 晚上有碳水帮助入睡",
    highlight: true,
  },
];

const cardioDiet = [
  {
    time: "7:30",
    meal: "早餐",
    tag: "BREAKFAST",
    items: [
      { cat: "碳水", name: "燕麦 + 牛奶", amount: "30g 燕麦" },
      { cat: "水果", name: "蓝莓", amount: "50g" },
      { cat: "蛋白质", name: "鸡蛋", amount: "2 个" },
      { cat: "补剂", name: "鱼油", amount: "2 粒" },
    ],
  },
  {
    time: "12:00",
    meal: "午餐",
    tag: "LUNCH",
    items: [
      { cat: "蛋白质", name: "鸡肉 / 鱼肉 / 牛肉", amount: "100-150g" },
      { cat: "蔬菜", name: "绿叶菜", amount: "不限量" },
    ],
    note: "不吃主食",
  },
  {
    time: "16:00",
    meal: "有氧训练",
    tag: "CARDIO",
    items: [{ cat: "训练", name: "快走 / 椭圆机 / 骑车，心率 ≈130", amount: "40 min" }],
    highlight: true,
  },
  {
    time: "18:30",
    meal: "晚餐",
    tag: "DINNER",
    items: [
      { cat: "蛋白质", name: "鱼肉 / 鸡胸 / 牛肉", amount: "150-200g" },
      { cat: "碳水", name: "红薯 / 米饭", amount: "80-100g" },
      { cat: "蔬菜", name: "绿叶菜", amount: "不限量" },
      { cat: "脂肪", name: "坚果", amount: "20g" },
    ],
    note: "有氧日碳水比力量日少，但晚餐保留碳水帮助睡眠",
    highlight: true,
  },
];

const trainingDetails = [
  {
    day: "周一",
    title: "胸 + 肩 + 三头",
    exercises: [
      { name: "哑铃卧推 / 杠铃卧推", sets: "4 × 10-12" },
      { name: "上斜哑铃飞鸟", sets: "3 × 12" },
      { name: "坐姿哑铃推举", sets: "4 × 10-12" },
      { name: "侧平举", sets: "3 × 15" },
      { name: "绳索下压（三头）", sets: "3 × 12-15" },
      { name: "仰卧臂屈伸", sets: "3 × 12" },
    ],
  },
  {
    day: "周三",
    title: "全身 + 核心",
    exercises: [
      { section: "🏋️ 健身房" },
      { name: "高脚杯深蹲（轻，功能性）", sets: "4 × 12-15" },
      { name: "哑铃卧推", sets: "4 × 8-12" },
      { name: "坐姿划船", sets: "4 × 10-12" },
      { name: "哑铃推肩", sets: "3 × 10-12" },
      { section: "🏠 房间" },
      { name: "死虫", sets: "3 × 12 每侧" },
      { name: "平板支撑", sets: "3 × 45-60s" },
      { name: "反向卷腹", sets: "3 × 15" },
    ],
  },
  {
    day: "周四",
    title: "背 + 二头",
    exercises: [
      { name: "引体向上 / 高位下拉", sets: "4 × 8-12" },
      { name: "坐姿划船", sets: "4 × 10-12" },
      { name: "单臂哑铃划船", sets: "3 × 10 每侧" },
      { name: "直臂下压", sets: "3 × 12-15" },
      { name: "哑铃弯举", sets: "3 × 12" },
      { name: "锤式弯举", sets: "3 × 12" },
    ],
  },
  {
    day: "周六",
    title: "核心 + 体态",
    exercises: [
      { section: "🏋️ 健身房" },
      { name: "高位下拉", sets: "4 × 8-12" },
      { name: "面拉（改善圆肩）", sets: "3 × 15" },
      { name: "哑铃侧平举", sets: "3 × 12" },
      { section: "🏠 房间" },
      { name: "鸟狗", sets: "3 × 12 每侧" },
      { name: "徒手臀桥（纠正骨盆前倾）", sets: "3 × 15-20" },
      { name: "仰卧自行车卷腹", sets: "3 × 12-15 每侧" },
      { name: "卷腹", sets: "3 × 15" },
    ],
  },
];

const catColors = {
  碳水: { bg: "#FFF3E0", color: "#E07A3A" },
  蛋白质: { bg: "#FCE4EC", color: "#C0625A" },
  蔬菜: { bg: "#E8F5E9", color: "#5A9E6F" },
  水果: { bg: "#F3E5F5", color: "#8B7EC8" },
  脂肪: { bg: "#FFF8E1", color: "#C4A040" },
  补剂: { bg: "#E3EFF8", color: "#5B8DB8" },
  训练: { bg: COLORS.accentLight, color: COLORS.accent },
};

function CatBadge({ cat }) {
  const c = catColors[cat] || { bg: "#eee", color: "#888" };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 4,
        background: c.bg,
        color: c.color,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        fontFamily: fonts.body,
      }}
    >
      {cat}
    </span>
  );
}

function TypeBadge({ type }) {
  const labels = { strength: "力量", cardio: "有氧", rest: "休息" };
  const c = dayColors[type];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
        background: c.accent,
        color: "#fff",
        letterSpacing: 1,
      }}
    >
      {labels[type]}
    </span>
  );
}

export default function FitnessPlan() {
  const [activeTab, setActiveTab] = useState("checkin");
  const [checkins, setCheckins] = useState({});
  const [weights, setWeights] = useState({});
  const [loaded, setLoaded] = useState(!hasStorage);

  useEffect(() => {
    let alive = true;
    (async () => {
      const c = await loadKey("checkins");
      const w = await loadKey("weights");
      if (!alive) return;
      if (c) setCheckins(c);
      if (w) setWeights(w);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const updateCheckins = (next) => {
    setCheckins(next);
    saveKey("checkins", next);
  };
  const updateWeights = (next) => {
    setWeights(next);
    saveKey("weights", next);
  };

  const wKeys = Object.keys(weights).sort();
  const latestWeight = wKeys.length ? weights[wKeys[wKeys.length - 1]] : null;

  const tabs = [
    { id: "checkin", label: "每日打卡" },
    { id: "weight", label: "体重记录" },
    { id: "schedule", label: "周计划" },
    { id: "strength-diet", label: "力量日饮食" },
    { id: "cardio-diet", label: "有氧日饮食" },
    { id: "training", label: "训练动作" },
    { id: "relax", label: "睡前放松" },
    { id: "notes", label: "注意事项" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: fonts.body, color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", padding: "40px 20px 20px", position: "relative" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.accent, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
          CUSTOM FITNESS PLAN
        </div>
        <h1 style={{ fontFamily: fonts.title, fontSize: 32, fontWeight: 800, margin: "0 0 6px", color: COLORS.text, lineHeight: 1.2 }}>
          减脂塑形计划
        </h1>
        <p style={{ fontSize: 13, color: COLORS.textSec, margin: 0, lineHeight: 1.5 }}>
          力量 4 天 · 有氧 2 天 · 休息 1 天
        </p>
        <p style={{ fontSize: 12, color: COLORS.textLight, margin: "4px 0 0" }}>
          {latestWeight ? `当前 ${latestWeight}kg · 目标 55kg` : "目标 55kg"} · 碳水集中训练后 · 保护睡眠
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 24,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: fonts.body,
              transition: "all 0.2s ease",
              background: activeTab === t.id ? COLORS.accent : COLORS.card,
              color: activeTab === t.id ? "#fff" : COLORS.textSec,
              boxShadow: activeTab === t.id ? "0 2px 12px rgba(224,122,58,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px 40px" }}>
        {activeTab === "checkin" && (loaded ? <CheckinView checkins={checkins} onChange={updateCheckins} /> : <Loading />)}
        {activeTab === "weight" && (loaded ? <WeightView weights={weights} onChange={updateWeights} /> : <Loading />)}
        {activeTab === "schedule" && <ScheduleView />}
        {activeTab === "strength-diet" && <DietView title="力量训练日饮食" subtitle="碳水总量不变 · 集中在傍晚（训练后 + 晚餐）" meals={strengthDiet} accent={COLORS.accent} />}
        {activeTab === "cardio-diet" && <DietView title="有氧日饮食" subtitle="碳水比力量日略少 · 晚餐保留碳水助眠" meals={cardioDiet} accent={COLORS.green} />}
        {activeTab === "training" && <TrainingView />}
        {activeTab === "relax" && <RelaxView />}
        {activeTab === "notes" && <NotesView />}
      </div>
    </div>
  );
}

function ScheduleView() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {weekSchedule.map((d, i) => {
          const c = dayColors[d.type];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                background: COLORS.card,
                borderRadius: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                borderLeft: `4px solid ${c.accent}`,
              }}
            >
              <div style={{ textAlign: "center", minWidth: 44 }}>
                <div style={{ fontSize: 10, color: COLORS.textLight, fontWeight: 600, letterSpacing: 1 }}>{d.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{d.day}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{d.icon} {d.title}</div>
                {d.type === "cardio" && (
                  <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 3 }}>快走 / 椭圆机 · 40min · 心率 ≈130</div>
                )}
                {d.type === "rest" && (
                  <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 3 }}>完全不练，身体恢复</div>
                )}
              </div>
              <TypeBadge type={d.type} />
            </div>
          );
        })}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
        {[
          { label: "训练时间", value: "16:00", sub: "下午 4 点开始" },
          { label: "训练后餐", value: "17:30", sub: "30 分钟内吃碳水" },
          { label: "每日热量", value: "1400-1500", sub: "力量日目标" },
          { label: "蛋白质", value: "112-140g", sub: "每公斤体重 1.6-2g" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 14,
              padding: "16px 14px",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent, fontFamily: fonts.title }}>{s.value}</div>
            <div style={{ fontSize: 11, color: COLORS.textSec, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DietView({ title, subtitle, meals, accent }) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: fonts.title, fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: COLORS.text }}>{title}</h2>
        <p style={{ fontSize: 12, color: COLORS.textSec, margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {meals.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.highlight ? `linear-gradient(135deg, ${accent}08, ${accent}15)` : COLORS.card,
              borderRadius: 16,
              padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              border: m.highlight ? `1.5px solid ${accent}30` : `1px solid ${COLORS.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: accent,
                  background: `${accent}15`,
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {m.time}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{m.meal}</div>
              <div style={{ fontSize: 9, color: COLORS.textLight, fontWeight: 600, letterSpacing: 2, marginLeft: "auto" }}>{m.tag}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {m.items.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CatBadge cat={item.cat} />
                  <span style={{ flex: 1, fontSize: 13, color: COLORS.text }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSec, whiteSpace: "nowrap" }}>{item.amount}</span>
                </div>
              ))}
            </div>

            {m.note && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: `${accent}10`,
                  borderRadius: 8,
                  fontSize: 11,
                  color: accent,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                💡 {m.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingView() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: fonts.title, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>力量训练动作</h2>
        <p style={{ fontSize: 12, color: COLORS.textSec, margin: 0 }}>每个动作组间休息 60-90 秒 · 根据 PT 指导调整重量</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {trainingDetails.map((day, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent}DD)`,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{day.day} · {day.title}</span>
            </div>
            <div style={{ padding: "12px 18px" }}>
              {(() => {
                let n = 0;
                return day.exercises.map((ex, j) => {
                  if (ex.section) {
                    return (
                      <div
                        key={j}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: COLORS.textSec,
                          letterSpacing: 1,
                          padding: "12px 0 6px",
                          marginTop: j === 0 ? 0 : 6,
                        }}
                      >
                        {ex.section}
                      </div>
                    );
                  }
                  n += 1;
                  return (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: j < day.exercises.length - 1 ? `1px solid ${COLORS.divider}` : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: COLORS.accentSoft,
                            color: COLORS.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {n}
                        </span>
                        <span style={{ fontSize: 13, color: COLORS.text }}>{ex.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, whiteSpace: "nowrap", marginLeft: 10 }}>{ex.sets}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ))}

        {/* Cardio days */}
        <div
          style={{
            background: COLORS.card,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.green}DD)`,
              padding: "12px 18px",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>周二 & 周五 · 低强度有氧 LISS</span>
          </div>
          <div style={{ padding: "16px 18px" }}>
            {[
              { label: "方式", value: "快走 / 椭圆机 / 骑车（任选）" },
              { label: "时长", value: "40 分钟" },
              { label: "心率", value: "≈ 130 bpm（能聊天的强度）" },
              { label: "注意", value: "不做 HIIT，避免皮质醇升高" },
            ].map((r, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: j < 3 ? `1px solid ${COLORS.divider}` : "none",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.green, minWidth: 40 }}>{r.label}</span>
                <span style={{ fontSize: 13, color: COLORS.text }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const preSleepRoutine = [
  {
    title: "泡沫轴放松 · 大腿 + 小腿",
    detail: "大腿前侧 → 外侧 → 后侧 → 小腿后侧，慢慢滚，碰到酸的点停一下",
    duration: "每部位 30-60 秒",
  },
  {
    title: "足底筋膜放松",
    detail: "用球或泡沫轴踩着慢慢滚，松开脚底",
    duration: "每只脚 30 秒",
  },
  {
    title: "青蛙趴",
    detail: "跪姿打开髋部，放松骨盆（对骨盆前倾也有帮助）",
    duration: "1-2 分钟",
  },
  {
    title: "压脚背 + 压脚趾",
    detail: "跪坐压脚背，再坐姿压脚趾，松一下脚踝",
    duration: "各 30 秒",
  },
  {
    title: "仰卧慢呼吸",
    detail: "平躺，吸气 4 秒、呼气 6 秒，让身体慢慢进入睡眠状态",
    duration: "3-5 分钟",
  },
];

function RelaxView() {
  const accent = COLORS.purple;
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: fonts.title, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>每日睡前放松</h2>
        <p style={{ fontSize: 12, color: COLORS.textSec, margin: 0 }}>约 10-15 分钟 · 强度很低 · 帮助放松和入睡</p>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${accent}10, ${accent}1A)`,
          border: `1.5px solid ${accent}30`,
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 16,
          fontSize: 12,
          color: accent,
          fontWeight: 600,
          lineHeight: 1.6,
        }}
      >
        🌙 睡前这套排得很轻，目的是放松、不是训练。在房间里做，从腿到脚再到呼吸收尾。
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {preSleepRoutine.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              background: COLORS.card,
              borderRadius: 16,
              padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `${accent}18`,
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                fontFamily: fonts.title,
              }}
            >
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textSec, lineHeight: 1.6, marginBottom: 6 }}>{s.detail}</div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: accent,
                  background: `${accent}14`,
                  padding: "2px 10px",
                  borderRadius: 20,
                }}
              >
                {s.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: COLORS.textLight, lineHeight: 1.7, textAlign: "center" }}>
        你之前有入睡的困扰 · 这套对睡眠是加分的，坚持做会越来越顺
      </div>
    </div>
  );
}

function NotesView() {
  const notes = [
    {
      icon: "🍚",
      title: "每周一次补碳日",
      content: "选一天力量日（建议周六），把碳水拉到接近正常水平：米饭吃够 + 加水果。注意是「干净的高碳水」——主食、水果可以多，但油和糖照常控制，不是放纵吃垃圾（油脂会抵消补碳的作用）。目的是重置瘦素和皮质醇，对你这种对低碳水敏感的体质是保护，避免重蹈上次睡不着的覆辙。",
    },
    {
      icon: "🌙",
      title: "睡眠保护",
      content: "碳水集中在训练后（约 17:30）吃，帮助夜间血清素和褪黑素分泌。如仍有入睡困难，睡前加餐加半根香蕉。目标 23:00 前入睡。",
    },
    {
      icon: "⚖️",
      title: "称重记录",
      content: "头两周认真用食物秤。米饭称熟重，肉类称生重。建立对份量的直觉后可以目测。每天早起空腹称体重，看周均值趋势，不要纠结单日波动。",
    },
    {
      icon: "🍳",
      title: "烹饪技巧",
      content: "用喷油壶控制油量（每次 3-5ml）。调味料随意用：生抽、醋、辣椒粉、花椒、蒜，热量极低。主要控制油和糖。",
    },
    {
      icon: "⚠️",
      title: "皮质醇监控",
      content: "如果出现：连续 2-3 天入睡困难、情绪明显烦躁、训练表现突然下降——立即加回碳水（每餐 50g 米饭），减少训练频率。不要硬撑。",
    },
    {
      icon: "📊",
      title: "合理预期",
      content: "每周减 0.4-0.5kg 脂肪是健康速度。两个月目标 3-5kg 纯脂肪。体态变化（塑形效果）会比秤上的数字更显著。",
    },
    {
      icon: "💬",
      title: "与 PT 沟通",
      content: "把这份计划带给教练看，让他根据你的实际训练水平调整动作和重量。训练动作仅供参考，以教练指导为准。",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: fonts.title, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>注意事项</h2>
        <p style={{ fontSize: 12, color: COLORS.textSec, margin: 0 }}>执行过程中的关键提醒</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notes.map((n, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 16,
              padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{n.title}</span>
            </div>
            <p style={{ fontSize: 13, color: COLORS.textSec, margin: 0, lineHeight: 1.7 }}>{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   每日打卡 + 体重记录（新增）
   数据通过 artifact 持久存储保存，刷新不丢，只有你看得到
   ============================================================ */

const WATER_GOAL = 8; // 每日目标杯数
const ML_PER_CUP = 250; // 每杯约 250ml

// —— 日期工具 ——
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function schedForDate(dateStr) {
  const idx = (parseYmd(dateStr).getDay() + 6) % 7; // 0=周一 … 6=周日
  return weekSchedule[idx];
}

// —— 打卡判定 ——
function emptyDay() {
  return { meals: { breakfast: false, lunch: false, dinner: false }, notes: {}, water: 0, trainingDone: false };
}
function dayQualifies(rec, dateStr) {
  const sched = schedForDate(dateStr);
  const trainingOK = sched.type === "rest" ? true : !!(rec && rec.trainingDone);
  const waterOK = (rec && rec.water ? rec.water : 0) >= WATER_GOAL;
  return trainingOK && waterOK;
}
function hasAnyData(rec) {
  if (!rec) return false;
  const m = rec.meals || {};
  return !!(m.breakfast || m.lunch || m.dinner || rec.water > 0 || rec.trainingDone);
}
function computeStreak(checkins) {
  let cursor = new Date();
  const todayKey = ymd(cursor);
  if (!dayQualifies(checkins[todayKey], todayKey)) cursor = addDays(cursor, -1);
  let streak = 0;
  while (dayQualifies(checkins[ymd(cursor)], ymd(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
function mealSummary(rec) {
  if (!rec || !rec.meals) return "未记录";
  const m = rec.meals;
  const done = [m.breakfast && "早", m.lunch && "午", m.dinner && "晚"].filter(Boolean);
  return done.length ? `${done.join(" / ")} 已打卡` : "未记录";
}

// —— 持久存储封装 ——
const hasStorage = typeof window !== "undefined" && window.storage;
async function loadKey(key) {
  if (!hasStorage) return null;
  try {
    const r = await window.storage.get(key, false);
    return r && r.value ? JSON.parse(r.value) : null;
  } catch (e) {
    return null;
  }
}
function saveKey(key, obj) {
  if (!hasStorage) return;
  try {
    Promise.resolve(window.storage.set(key, JSON.stringify(obj), false)).catch(() => {});
  } catch (e) {}
}

// —— 共用小样式 / 组件 ——
const navBtn = {
  width: 32,
  height: 32,
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.card,
  cursor: "pointer",
  fontSize: 18,
  color: COLORS.textSec,
  lineHeight: 1,
};
const inputLabel = { display: "block", fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 5 };
const inputBox = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 11px",
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  fontSize: 14,
  color: COLORS.text,
  background: COLORS.bg,
  fontFamily: fonts.body,
  outline: "none",
  height: 42,
};
const emptyCard = {
  background: COLORS.card,
  borderRadius: 16,
  padding: "22px 18px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  fontSize: 13,
  color: COLORS.textLight,
  textAlign: "center",
  marginBottom: 16,
};
const ghostBtn = {
  padding: "6px 11px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: "transparent",
  color: COLORS.textSec,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: fonts.body,
};
function miniBtn(color) {
  return {
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    background: color,
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: fonts.body,
  };
}

function Loading() {
  return <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textLight, fontSize: 13 }}>读取中…</div>;
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: COLORS.textLight, margin: "0 2px 10px", textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function Droplet({ filled }) {
  return (
    <svg width="30" height="34" viewBox="0 0 24 28" style={{ display: "block", transition: "transform .15s" }}>
      <path
        d="M12 2 C12 2 4 12 4 18 a8 8 0 0 0 16 0 C20 12 12 2 12 2 Z"
        fill={filled ? COLORS.blue : "none"}
        stroke={filled ? "none" : "#CBD9E5"}
        strokeWidth="1.6"
      />
    </svg>
  );
}

function DetailRow({ label, value, ok }) {
  const color = ok === undefined ? COLORS.textSec : ok ? COLORS.green : COLORS.textSec;
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <span style={{ minWidth: 34, fontWeight: 700, color: COLORS.textLight }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}

function StatBox({ label, value, unit, tone }) {
  const color = tone === "down" ? COLORS.green : tone === "up" ? "#C0625A" : COLORS.accent;
  return (
    <div style={{ flex: 1, background: COLORS.card, borderRadius: 14, padding: "14px 10px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 10.5, color: COLORS.textLight, fontWeight: 600, letterSpacing: 0.5, marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: fonts.title, color }}>
        {value}
        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  );
}

function WeightTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const w = payload.find((p) => p.dataKey === "weight");
  const a = payload.find((p) => p.dataKey === "avg");
  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: COLORS.text }}>{label}</div>
      {w && <div style={{ color: COLORS.blue }}>每日 {w.value}kg</div>}
      {a && <div style={{ color: COLORS.accent }}>均值 {a.value}kg</div>}
    </div>
  );
}

/* ---------------- 每日打卡 ---------------- */
function CheckinView({ checkins, onChange }) {
  const today = ymd(new Date());
  const rec = checkins[today] || emptyDay();
  const sched = schedForDate(today);
  const isRest = sched.type === "rest";
  const streak = computeStreak(checkins);

  const setRec = (next) => onChange({ ...checkins, [today]: next });
  const toggleMeal = (k) => setRec({ ...rec, meals: { ...rec.meals, [k]: !(rec.meals && rec.meals[k]) } });
  const setNote = (k, v) => setRec({ ...rec, notes: { ...(rec.notes || {}), [k]: v } });
  const setWater = (n) => setRec({ ...rec, water: Math.max(0, Math.min(WATER_GOAL, n)) });
  const toggleTraining = () => setRec({ ...rec, trainingDone: !rec.trainingDone });

  const trainingOK = isRest || rec.trainingDone;
  const waterOK = (rec.water || 0) >= WATER_GOAL;
  const doneToday = trainingOK && waterOK;

  const meals = [
    { key: "breakfast", label: "早餐" },
    { key: "lunch", label: "午餐" },
    { key: "dinner", label: "晚餐" },
  ];

  return (
    <div>
      {/* Streak hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.accent}, #D9662A)`,
          borderRadius: 20,
          padding: "22px",
          marginBottom: 18,
          boxShadow: "0 6px 20px rgba(224,122,58,0.28)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -8, top: -22, fontSize: 120, opacity: 0.14, lineHeight: 1 }}>🔥</div>
        <div style={{ fontSize: 11, letterSpacing: 3, fontWeight: 700, opacity: 0.9 }}>STREAK · 连续打卡</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: fonts.title, fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{streak}</span>
          <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.95 }}>天</span>
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.95, marginTop: 8, lineHeight: 1.5, position: "relative" }}>
          {doneToday
            ? "今天已达标，这一天稳了 🎉 继续保持～"
            : streak > 0
            ? "今天完成训练 + 喝够水，连续天数就 +1"
            : "完成今天的训练，再喝够 8 杯水，点亮第 1 天"}
        </div>
      </div>

      {/* 今日训练 */}
      <SectionLabel>今日训练</SectionLabel>
      <div
        style={{
          background: COLORS.card,
          borderRadius: 16,
          padding: "16px 18px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          marginBottom: 18,
          border: trainingOK ? `1.5px solid ${COLORS.green}40` : `1px solid ${COLORS.border}`,
        }}
      >
        {isRest ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>😴</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>今天是休息日</div>
              <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>好好恢复 · streak 自动保留</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: COLORS.green, background: COLORS.greenLight, padding: "4px 10px", borderRadius: 20 }}>已完成</span>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 26 }}>{sched.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{sched.title}</div>
                <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>
                  {sched.type === "cardio" ? "低强度有氧 · 40min · 心率 ≈130" : "按训练动作页执行 · 60-75min"}
                </div>
              </div>
            </div>
            <button
              onClick={toggleTraining}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "11px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: fonts.body,
                transition: "all .2s",
                background: rec.trainingDone ? COLORS.green : COLORS.accentSoft,
                color: rec.trainingDone ? "#fff" : COLORS.accent,
              }}
            >
              {rec.trainingDone ? "✓ 已完成训练" : "标记训练完成"}
            </button>
          </div>
        )}
      </div>

      {/* 三餐 */}
      <SectionLabel>三餐</SectionLabel>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "6px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 6 }}>
        {meals.map((m, i) => {
          const checked = !!(rec.meals && rec.meals[m.key]);
          return (
            <div key={m.key} style={{ padding: "10px 12px", borderBottom: i < 2 ? `1px solid ${COLORS.divider}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => toggleMeal(m.key)}
                  aria-pressed={checked}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    cursor: "pointer",
                    flexShrink: 0,
                    border: checked ? "none" : `2px solid ${COLORS.border}`,
                    background: checked ? COLORS.accent : "transparent",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .2s",
                  }}
                >
                  {checked ? "✓" : ""}
                </button>
                <span style={{ fontSize: 15, fontWeight: 600, color: checked ? COLORS.text : COLORS.textSec }}>{m.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textLight }}>{checked ? "已按计划" : "未打卡"}</span>
              </div>
              {checked && (
                <input
                  value={(rec.notes && rec.notes[m.key]) || ""}
                  onChange={(e) => setNote(m.key, e.target.value)}
                  placeholder="备注（可选）· 比如多吃了点 / 换了什么"
                  style={{
                    marginTop: 8,
                    marginLeft: 38,
                    width: "calc(100% - 50px)",
                    boxSizing: "border-box",
                    border: "none",
                    borderBottom: `1px solid ${COLORS.divider}`,
                    background: "transparent",
                    fontSize: 12.5,
                    color: COLORS.textSec,
                    padding: "4px 2px",
                    outline: "none",
                    fontFamily: fonts.body,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: COLORS.textLight, margin: "0 4px 18px", lineHeight: 1.5 }}>三餐只做记录，不影响连续天数。</div>

      {/* 饮水 */}
      <SectionLabel>饮水</SectionLabel>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: fonts.title, fontSize: 26, fontWeight: 800, color: COLORS.blue }}>{rec.water || 0}</span>
            <span style={{ fontSize: 13, color: COLORS.textSec }}>/ {WATER_GOAL} 杯</span>
            <span style={{ fontSize: 12, color: COLORS.textLight, marginLeft: 6 }}>约 {(rec.water || 0) * ML_PER_CUP}ml</span>
          </div>
          {waterOK && (
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue, background: COLORS.blueLight, padding: "4px 10px", borderRadius: 20 }}>✓ 达标</span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Array.from({ length: WATER_GOAL }).map((_, i) => {
            const filled = i < (rec.water || 0);
            return (
              <button
                key={i}
                onClick={() => setWater((rec.water || 0) === i + 1 ? i : i + 1)}
                aria-label={`${i + 1} 杯`}
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, lineHeight: 0 }}
              >
                <Droplet filled={filled} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 今日达标状态 */}
      <div
        style={{
          background: doneToday ? COLORS.greenSoft : COLORS.accentSoft,
          border: `1px solid ${doneToday ? COLORS.green + "40" : COLORS.accentLight}`,
          borderRadius: 14,
          padding: "12px 16px",
          fontSize: 12.5,
          fontWeight: 600,
          color: doneToday ? COLORS.green : COLORS.accent,
          lineHeight: 1.5,
          marginBottom: 24,
        }}
      >
        {doneToday
          ? "🔥 今天达标了！训练 + 喝水都完成，连续天数会保留。"
          : `今天还差：${[!trainingOK ? "完成训练" : null, !waterOK ? `再喝 ${WATER_GOAL - (rec.water || 0)} 杯水` : null].filter(Boolean).join(" · ")}`}
      </div>

      {/* 月历 */}
      <CalendarBlock checkins={checkins} todayKey={today} />
    </div>
  );
}

/* ---------------- 打卡月历 ---------------- */
function CalendarBlock({ checkins, todayKey }) {
  const todayDate = parseYmd(todayKey);
  const [view, setView] = useState({ y: todayDate.getFullYear(), m: todayDate.getMonth() });
  const [selected, setSelected] = useState(todayKey);

  const startOffset = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const weekdayHeads = ["一", "二", "三", "四", "五", "六", "日"];

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setView((v) => (v.m - 1 < 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  const nextMonth = () => setView((v) => (v.m + 1 > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));

  const selRec = checkins[selected];
  const selSched = schedForDate(selected);

  return (
    <div>
      <SectionLabel>打卡日历</SectionLabel>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "16px 16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={prevMonth} style={navBtn} aria-label="上个月">‹</button>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.title }}>{`${view.y}年${view.m + 1}月`}</span>
          <button onClick={nextMonth} style={navBtn} aria-label="下个月">›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
          {weekdayHeads.map((w, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: COLORS.textLight }}>{w}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i} />;
            const ds = ymd(new Date(view.y, view.m, d));
            const rec = checkins[ds];
            const isFuture = parseYmd(ds) > todayDate;
            const isToday = ds === todayKey;
            const isSel = ds === selected;
            const qual = !isFuture && dayQualifies(rec, ds);
            const partial = !isFuture && !qual && hasAnyData(rec);
            let bg = "transparent";
            let color = COLORS.textSec;
            let border = "none";
            if (qual) {
              bg = COLORS.accent;
              color = "#fff";
            } else if (partial) {
              border = `2px solid ${COLORS.accentLight}`;
              color = COLORS.accent;
            }
            if (isFuture) color = COLORS.textLight;
            const finalBorder = isSel ? `2px solid ${COLORS.accent}` : isToday && !qual ? `2px solid ${COLORS.textLight}` : border;
            return (
              <button
                key={i}
                onClick={() => setSelected(ds)}
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  boxSizing: "border-box",
                  background: bg,
                  color,
                  border: finalBorder,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.body,
                  opacity: isFuture ? 0.45 : 1,
                  transition: "all .15s",
                  position: "relative",
                }}
              >
                {d}
                {isToday && (
                  <span style={{ position: "absolute", bottom: 3, width: 4, height: 4, borderRadius: "50%", background: qual ? "#fff" : COLORS.accent }} />
                )}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 11, color: COLORS.textLight }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: COLORS.accent, display: "inline-block" }} />达标
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, border: `2px solid ${COLORS.accentLight}`, display: "inline-block", boxSizing: "border-box" }} />有记录未达标
          </span>
        </div>
      </div>

      {/* 选中日详情 */}
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          {selected === todayKey ? "今天" : selected.replace(/-/g, "/")} · {selSched.day}
        </div>
        {hasAnyData(selRec) || selSched.type === "rest" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5, color: COLORS.textSec }}>
            <DetailRow
              label="训练"
              value={selSched.type === "rest" ? "休息日 · 自动完成" : selRec && selRec.trainingDone ? `已完成 · ${selSched.title}` : `未完成 · ${selSched.title}`}
              ok={selSched.type === "rest" || (selRec && selRec.trainingDone)}
            />
            <DetailRow label="饮水" value={`${(selRec && selRec.water) || 0} / ${WATER_GOAL} 杯`} ok={((selRec && selRec.water) || 0) >= WATER_GOAL} />
            <DetailRow label="三餐" value={mealSummary(selRec)} />
          </div>
        ) : (
          <div style={{ fontSize: 12.5, color: COLORS.textLight }}>这天没有打卡记录。</div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 体重记录 ---------------- */
function WeightView({ weights, onChange }) {
  const today = ymd(new Date());
  const [date, setDate] = useState(today);
  const [val, setVal] = useState("");
  const [editKey, setEditKey] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);

  const keys = Object.keys(weights).sort();
  const entries = keys.map((k) => ({ date: k, weight: weights[k] }));

  const save = () => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return;
    onChange({ ...weights, [date]: Math.round(num * 10) / 10 });
    setVal("");
    setDate(today);
  };
  const saveEdit = (k) => {
    const num = parseFloat(editVal);
    if (isNaN(num) || num <= 0) {
      setEditKey(null);
      return;
    }
    onChange({ ...weights, [k]: Math.round(num * 10) / 10 });
    setEditKey(null);
  };
  const del = (k) => {
    const next = { ...weights };
    delete next[k];
    onChange(next);
    setConfirmDel(null);
  };

  const chartData = entries.map((e) => {
    const dEnd = parseYmd(e.date);
    const windowStart = addDays(dEnd, -6);
    const inWindow = entries.filter((x) => {
      const dx = parseYmd(x.date);
      return dx >= windowStart && dx <= dEnd;
    });
    const avg = inWindow.reduce((s, x) => s + x.weight, 0) / inWindow.length;
    return { date: e.date, label: `${dEnd.getMonth() + 1}/${dEnd.getDate()}`, weight: e.weight, avg: Math.round(avg * 100) / 100 };
  });

  const latest = entries.length ? entries[entries.length - 1].weight : null;
  const first = entries.length ? entries[0].weight : null;
  const delta = latest != null && first != null ? Math.round((latest - first) * 10) / 10 : null;

  const ws = entries.map((e) => e.weight);
  const yMin = ws.length ? Math.floor(Math.min(...ws) - 1) : 50;
  const yMax = ws.length ? Math.ceil(Math.max(...ws) + 1) : 70;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: fonts.title, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>体重记录</h2>
        <p style={{ fontSize: 12, color: COLORS.textSec, margin: 0 }}>每天早起空腹称一次 · 看趋势线，别纠结单日</p>
      </div>

      {latest != null && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <StatBox label="当前体重" value={`${latest}`} unit="kg" />
          <StatBox label="较起始" value={delta > 0 ? `+${delta}` : `${delta}`} unit="kg" tone={delta < 0 ? "down" : delta > 0 ? "up" : "flat"} />
          <StatBox label="记录天数" value={`${entries.length}`} unit="天" />
        </div>
      )}

      <div style={{ background: COLORS.card, borderRadius: 16, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 130px" }}>
            <label style={inputLabel}>日期</label>
            <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} style={inputBox} />
          </div>
          <div style={{ flex: "1 1 110px" }}>
            <label style={inputLabel}>体重 (kg)</label>
            <input type="number" inputMode="decimal" step="0.1" value={val} onChange={(e) => setVal(e.target.value)} placeholder="例如 67.2" style={inputBox} />
          </div>
          <button
            onClick={save}
            disabled={!val}
            style={{
              flex: "0 0 auto",
              padding: "0 20px",
              height: 42,
              borderRadius: 12,
              border: "none",
              background: val ? COLORS.accent : COLORS.accentLight,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: val ? "pointer" : "default",
              fontFamily: fonts.body,
            }}
          >
            保存
          </button>
        </div>
        {weights[date] != null && (
          <div style={{ fontSize: 11.5, color: COLORS.textLight, marginTop: 8 }}>这天已有记录 {weights[date]}kg，保存会覆盖。</div>
        )}
      </div>

      {chartData.length >= 2 ? (
        <div style={{ background: COLORS.card, borderRadius: 16, padding: "18px 10px 10px 0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 16, padding: "0 0 8px 18px", fontSize: 11, color: COLORS.textSec }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 2, background: "#9CC0DE", display: "inline-block" }} />每日
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 3, background: COLORS.accent, display: "inline-block", borderRadius: 2 }} />7 天均值
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={chartData} margin={{ top: 6, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid stroke={COLORS.divider} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.textLight }} axisLine={{ stroke: COLORS.border }} tickLine={false} minTickGap={20} />
              <YAxis domain={[yMin, yMax]} tick={{ fontSize: 10, fill: COLORS.textLight }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<WeightTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#9CC0DE" strokeWidth={2} dot={{ r: 2.5, fill: "#9CC0DE", strokeWidth: 0 }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="avg" stroke={COLORS.accent} strokeWidth={2.6} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : chartData.length === 1 ? (
        <div style={emptyCard}>已经记了 1 天 · 再记一天就能看到趋势线了。</div>
      ) : null}

      <SectionLabel>历史记录</SectionLabel>
      {entries.length === 0 ? (
        <div style={emptyCard}>还没有记录。早上空腹称一下，填进去就开始画线了。</div>
      ) : (
        <div style={{ background: COLORS.card, borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          {[...entries].reverse().map((e, i, arr) => (
            <div
              key={e.date}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.divider}` : "none" }}
            >
              <span style={{ fontSize: 13, color: COLORS.textSec, minWidth: 78 }}>{e.date.replace(/-/g, "/")}</span>
              {editKey === e.date ? (
                <>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={editVal}
                    onChange={(ev) => setEditVal(ev.target.value)}
                    autoFocus
                    style={{ ...inputBox, width: 90, height: 34 }}
                  />
                  <button onClick={() => saveEdit(e.date)} style={miniBtn(COLORS.green)}>保存</button>
                  <button onClick={() => setEditKey(null)} style={miniBtn(COLORS.textLight)}>取消</button>
                </>
              ) : confirmDel === e.date ? (
                <>
                  <span style={{ flex: 1, fontSize: 13, color: COLORS.accent }}>确认删除？</span>
                  <button onClick={() => del(e.date)} style={miniBtn("#C0625A")}>删除</button>
                  <button onClick={() => setConfirmDel(null)} style={miniBtn(COLORS.textLight)}>取消</button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 700, fontFamily: fonts.title }}>
                    {e.weight}
                    <span style={{ fontSize: 12, fontWeight: 400, color: COLORS.textLight, marginLeft: 2 }}>kg</span>
                  </span>
                  <button onClick={() => { setEditKey(e.date); setEditVal(String(e.weight)); }} style={ghostBtn}>改</button>
                  <button onClick={() => setConfirmDel(e.date)} style={ghostBtn}>删</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11.5, color: COLORS.textLight, marginTop: 12, lineHeight: 1.6, textAlign: "center" }}>
        橙线是 7 天均值，体重每天会有水分波动，看这条更准。
      </div>
    </div>
  );
}
