"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import kanaData from "@/data/kana.json";
import basicsData from "@/data/basics.json";
import { useFadeIn } from "@/hooks/useFadeIn";

type Category = "kana" | "numbers" | "time" | "dates" | "weekdays" | "counters";

interface KanaItem {
  hiragana: string;
  katakana: string;
  romaji: string;
}

interface BasicsItem {
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  special?: boolean;
}

export default function BasicsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("kana");
  const [showKana, setShowKana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [useKatakana, setUseKatakana] = useState(false);

  const containerRef = useFadeIn();

  const CATEGORIES = [
    { id: "kana", label: "五十音", icon: "あ" },
    { id: "numbers", label: "數字", icon: "1" },
    { id: "time", label: "時間", icon: "⏰" },
    { id: "dates", label: "日期", icon: "🗓️" },
    { id: "weekdays", label: "星期", icon: "📅" },
    { id: "counters", label: "量詞", icon: "枚" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div ref={containerRef} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold font-jp text-foreground">
              基礎知識工具庫
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              這裡是你的日語學習後盾。隨時查閱五十音、時間、數字等基礎資料，或切換模式進行自我測驗。
            </p>
          </div>

          {/* Category Switcher (Tabs) */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-border pb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "bg-surface hover:bg-sakura-light text-foreground hover:text-primary"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-border sticky top-20 z-10">
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showKana}
                  onChange={(e) => setShowKana(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  顯示假名
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showRomaji}
                  onChange={(e) => setShowRomaji(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  顯示羅馬字
                </span>
              </label>
              {activeCategory === "kana" && (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={useKatakana}
                    onChange={(e) => setUseKatakana(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    切換片假名
                  </span>
                </label>
              )}
            </div>
            <div className="text-xs text-text-muted italic">
              * 關閉「顯示假名」可作為記憶檢核模式
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-100">
            {activeCategory === "kana" && (
              <KanaChart showKana={showKana} showRomaji={showRomaji} useKatakana={useKatakana} />
            )}
            {activeCategory !== "kana" && (
              <BasicsGridView
                category={activeCategory}
                showKana={showKana}
                showRomaji={showRomaji}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Internal Components (Can be extracted later)

function BasicsGridView({
  category,
  showKana,
  showRomaji,
}: {
  category: Category;
  showKana: boolean;
  showRomaji: boolean;
}) {
  const getData = () => {
    switch (category) {
      case "numbers":
        return basicsData.numbers;
      case "time":
        return basicsData.time;
      case "dates":
        return basicsData.dates;
      case "weekdays":
        return basicsData.weekdays;
      case "counters":
        return basicsData.counters;
      default:
        return [];
    }
  };

  const data = getData();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-dashed border-border">
        <div className="text-4xl mb-4">🚧</div>
        <h3 className="text-xl font-bold font-jp text-foreground mb-2">開發中...</h3>
        <p className="text-text-muted">此模組正在充實內容中</p>
      </div>
    );
  }

  // Check if it's grouped data (like numbers)
  const isGrouped = data.length > 0 && "groupName" in data[0];

  if (isGrouped) {
    interface GroupData {
      groupName: string;
      items: BasicsItem[];
    }
    const groupedData = data as unknown as GroupData[];

    return (
      <div className="space-y-12">
        {groupedData.map((group, gIdx) => (
          <div key={gIdx} className="space-y-6">
            <h3 className="text-xl font-bold font-jp text-foreground border-l-4 border-primary pl-4">
              {group.groupName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.items.map((item, iIdx) => (
                <BasicsCard
                  key={`${gIdx}-${iIdx}`}
                  item={item}
                  showKana={showKana}
                  showRomaji={showRomaji}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {data.map((item, idx) => (
        <BasicsCard
          key={idx}
          item={item as BasicsItem}
          showKana={showKana}
          showRomaji={showRomaji}
        />
      ))}
    </div>
  );
}

function BasicsCard({
  item,
  showKana,
  showRomaji,
}: {
  item: { kanji: string; kana: string; romaji: string; meaning: string; special?: boolean };
  showKana: boolean;
  showRomaji: boolean;
}) {
  const [tempShow, setTempShow] = useState(false);

  return (
    <div
      onClick={() => !showKana && setTempShow(!tempShow)}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 group cursor-pointer ${
        showKana || tempShow
          ? "bg-white border-border shadow-sm hover:shadow-md hover:-translate-y-1"
          : "bg-surface border-border/50 bg-[repeating-linear-gradient(45deg,#F3F1ED,#F3F1ED_10px,#FAF9F6_10px,#FAF9F6_20px)]"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-lg font-bold font-jp text-foreground">{item.kanji}</div>
        {item.special && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
            特殊
          </span>
        )}
      </div>

      <div
        className={`text-xl font-jp transition-all duration-300 ${
          showKana || tempShow ? "text-primary opacity-100" : "text-primary/5 opacity-0 scale-50"
        } ${item.special ? "font-bold" : ""}`}
      >
        {item.kana}
      </div>

      <div className="mt-auto pt-3 space-y-1">
        <div
          className={`text-[10px] font-medium text-text-muted uppercase transition-opacity duration-300 ${
            showRomaji ? "opacity-100" : "opacity-0"
          }`}
        >
          {item.romaji}
        </div>
        <div className="text-xs text-text-secondary font-medium">{item.meaning}</div>
      </div>

      {!showKana && !tempShow && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <span className="text-primary/40 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            點擊翻開
          </span>
        </div>
      )}
    </div>
  );
}

function KanaChart({
  showKana,
  showRomaji,
  useKatakana,
}: {
  showKana: boolean;
  showRomaji: boolean;
  useKatakana: boolean;
}) {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold font-jp text-foreground mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-sakura-light text-primary flex items-center justify-center text-sm">
            本
          </span>
          五十音圖 (Gojūon)
        </h2>
        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {kanaData.gojuon.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((item, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`}>
                  {item ? (
                    <KanaCard
                      item={item as KanaItem}
                      showKana={showKana}
                      showRomaji={showRomaji}
                      useKatakana={useKatakana}
                    />
                  ) : (
                    <div className="aspect-square bg-transparent" />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Dakuon Section */}
      <section>
        <h2 className="text-2xl font-bold font-jp text-foreground mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-sakura-light text-primary flex items-center justify-center text-sm">
            濁
          </span>
          濁音 (Dakuon)
        </h2>
        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {kanaData.dakuon.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((item, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`}>
                  {item ? (
                    <KanaCard
                      item={item as KanaItem}
                      showKana={showKana}
                      showRomaji={showRomaji}
                      useKatakana={useKatakana}
                    />
                  ) : (
                    <div className="aspect-square bg-transparent" />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Handakuon Section */}
      <section>
        <h2 className="text-2xl font-bold font-jp text-foreground mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-sakura-light text-primary flex items-center justify-center text-sm">
            半
          </span>
          半濁音 (Handakuon)
        </h2>
        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {kanaData.handakuon.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((item, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`}>
                  {item ? (
                    <KanaCard
                      item={item as KanaItem}
                      showKana={showKana}
                      showRomaji={showRomaji}
                      useKatakana={useKatakana}
                    />
                  ) : (
                    <div className="aspect-square bg-transparent" />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}

function KanaCard({
  item,
  showKana,
  showRomaji,
  useKatakana,
}: {
  item: KanaItem;
  showKana: boolean;
  showRomaji: boolean;
  useKatakana: boolean;
}) {
  const [tempShow, setTempShow] = useState(false);

  return (
    <div
      onClick={() => !showKana && setTempShow(!tempShow)}
      className={`aspect-square relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-300 group cursor-pointer ${
        showKana || tempShow
          ? "bg-white border-border shadow-sm hover:shadow-md hover:-translate-y-1"
          : "bg-surface border-border/50 bg-[repeating-linear-gradient(45deg,#F3F1ED,#F3F1ED_10px,#FAF9F6_10px,#FAF9F6_20px)]"
      }`}
    >
      <div
        className={`text-2xl md:text-3xl font-bold font-jp transition-all duration-300 ${
          showKana || tempShow
            ? "text-foreground opacity-100"
            : "text-foreground/5 opacity-0 scale-50"
        }`}
      >
        {useKatakana ? item.katakana : item.hiragana}
      </div>

      <div
        className={`text-[10px] md:text-xs font-medium text-text-muted mt-1 uppercase tracking-wider transition-opacity duration-300 ${
          showRomaji ? "opacity-100" : "opacity-0"
        }`}
      >
        {item.romaji}
      </div>

      {!showKana && !tempShow && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-primary/40 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            TAP
          </span>
        </div>
      )}
    </div>
  );
}
