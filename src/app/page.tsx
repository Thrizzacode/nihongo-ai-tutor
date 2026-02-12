"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./landing.css";

function useScrollFadeIn() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    el.querySelectorAll(".fade-in").forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}

function HeroChatPreview() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[420px] rounded-3xl border border-border bg-card p-7 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matsu-light text-xl">
            🎌
          </div>
          <div>
            <h4 className="text-sm font-semibold">AI 先生 (せんせい)</h4>
            <span className="text-xs font-medium text-matsu">● 線上中</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4">
          <div className="chat-msg max-w-[85%] self-start rounded-xl border border-matsu/12 bg-matsu-light px-[18px] py-3.5 text-sm leading-relaxed">
            <span className="mb-0.5 block text-[0.65rem] text-text-muted">
              つぎ　　　ぶんしょう　にほんご　　やく
            </span>
            次の文章を日本語に訳してください：
            <br />
            「我明天要去東京旅行」
          </div>

          <div className="chat-msg max-w-[85%] self-end rounded-xl border border-primary/12 bg-sakura-light px-[18px] py-3.5 text-sm leading-relaxed">
            明日東京に旅行を行きます。
          </div>

          <div className="chat-msg max-w-[85%] self-start rounded-xl border border-matsu/12 bg-matsu-light px-[18px] py-3.5 text-sm leading-relaxed">
            惜しい！ほぼ正解です 👏
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-matsu/8 px-2.5 py-1 text-xs text-matsu">
              ✅ 修正：旅行<strong>に</strong>行きます
            </span>
          </div>

          <div className="chat-msg max-w-[85%] self-end rounded-xl border border-primary/12 bg-sakura-light px-[18px] py-3.5 text-sm leading-relaxed">
            ありがとうございます！もう一問お願いします 🙏
          </div>

          {/* Typing indicator */}
          <div className="chat-typing flex gap-1 self-start px-[18px] py-3.5">
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero relative z-0">
      <div className="relative z-[1] mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-[60px]">
        {/* Left: Content */}
        <div className="max-w-[520px]">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-sakura-light px-4 py-1.5 text-sm font-medium text-primary">
            <span className="pulse-dot h-2 w-2 rounded-full bg-primary" />
            AI 驅動的日語學習體驗
          </div>

          <h1 className="mb-5 text-3xl font-bold leading-snug tracking-tight md:text-[3rem] md:leading-[1.25]">
            從<span className="hero-highlight">「敢說」</span>到
            <span className="hero-highlight">「說對」</span>，
            <br className="hidden md:block" />
            你的專屬日語家教
          </h1>

          <p className="mb-9 text-base leading-relaxed text-text-secondary md:text-lg md:leading-loose">
            透過 AI 即時對話、智能語法糾錯與情境模擬，
            <br className="hidden md:block" />
            讓你隨時隨地、無壓力地練習日語。
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Link
              href="/signup"
              className="btn-primary-landing inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white"
            >
              🚀 開始免費學習
            </Link>
            {/* <button className="btn-secondary-landing inline-flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-border bg-transparent px-8 py-4 text-base font-medium text-foreground">
              ▶ 觀看介紹
            </button> */}
          </div>
        </div>

        {/* Right: Chat Preview */}
        <HeroChatPreview />
      </div>
    </section>
  );
}

// ─── Features ───
const FEATURES = [
  {
    icon: "💬",
    iconBg: "bg-sakura-light",
    title: "AI 即時對話練習",
    desc: "根據你的程度 (N5~N4)，AI 會出題並批改你的日文句子，指出具體的語法錯誤。",
    tag: "MVP 核心",
    tagClass: "bg-sakura-light text-primary",
  },
  {
    icon: "✅",
    iconBg: "bg-matsu-light",
    title: "智能語法糾錯",
    desc: "不只告訴你「錯了」，還會解釋為什麼錯。例如：助詞「は」與「が」的使用時機差異。",
    tag: "MVP 核心",
    tagClass: "bg-sakura-light text-primary",
  },
  {
    icon: "📖",
    iconBg: "bg-[#FFF3E0]",
    title: "單字卡與標籤篩選",
    desc: "內建漢字/假名翻轉卡片，支援 N5 標籤篩選，並可將對話中的新詞一鍵加入單字本。",
    tag: "MVP 核心",
    tagClass: "bg-sakura-light text-primary",
  },
  {
    icon: "🎭",
    iconBg: "bg-sakura-light",
    title: "情境角色扮演",
    desc: "模擬「餐廳點餐」、「便利商店」、「面試」等真實場景，讓學習更有臨場感。",
    tag: "Phase 2",
    tagClass: "bg-matsu-light text-matsu",
  },
  {
    icon: "🎤",
    iconBg: "bg-matsu-light",
    title: "語音對話 (STT/TTS)",
    desc: "用說的練日文！串接語音辨識與語音合成，體驗最自然的口說練習。",
    tag: "Phase 2",
    tagClass: "bg-matsu-light text-matsu",
  },
  {
    icon: "📊",
    iconBg: "bg-[#FFF3E0]",
    title: "學習進度追蹤",
    desc: "記錄每日對話時長、常犯錯誤、新學單字數，用數據驅動你的日語成長。",
    tag: "Phase 2",
    tagClass: "bg-matsu-light text-matsu",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-card py-[120px]">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Header */}
        <div className="fade-in mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-primary">
            Core Features
          </p>
          <h2 className="mb-4 text-2xl font-bold leading-snug md:text-[2rem]">
            為日語學習者量身打造
          </h2>
          <p className="mx-auto max-w-[560px] text-base leading-relaxed text-text-secondary">
            不只是聊天機器人。我們針對日語學習的痛點，設計了專業的反饋與追蹤系統。
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card fade-in rounded-2xl border border-border bg-background p-7 md:p-9"
            >
              <div
                className={`mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-xl text-2xl ${f.iconBg}`}
              >
                {f.icon}
              </div>
              <h3 className="mb-2.5 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{f.desc}</p>
              <span
                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${f.tagClass}`}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it Works ───
const STEPS = [
  {
    icon: "📝",
    title: "免費註冊",
    desc: "使用 Email 帳號一鍵登入，系統自動建立你的學習檔案。",
  },
  {
    icon: "🎯",
    title: "選擇模式",
    desc: "自由對話、情境練習、或單字複習——依照你今天的心情與時間選擇。",
  },
  {
    icon: "🚀",
    title: "即時學習",
    desc: "AI 出題、你回答、AI 批改。每一句都讓你的日語更進一步。",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-[120px]">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Header */}
        <div className="fade-in mb-[72px] text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-primary">
            How it Works
          </p>
          <h2 className="mb-4 text-2xl font-bold leading-snug md:text-[2rem]">
            三步開始你的日語之旅
          </h2>
          <p className="mx-auto max-w-[560px] text-base leading-relaxed text-text-secondary">
            無需任何日語基礎，註冊後即可開始與 AI 老師互動。
          </p>
        </div>

        {/* Steps */}
        <div className="steps-container grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((s) => (
            <div key={s.title} className="step-item fade-in relative z-[1] text-center">
              <div className="step-number mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-card text-[2rem]">
                {s.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-text-secondary">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Demo Preview ───
const DEMO_FEATURES = [
  {
    icon: "🔤",
    bg: "bg-sakura-light",
    title: "振假名 (Furigana) 切換",
    desc: "一鍵開關漢字上方的假名標註，適合不同程度的學習者。",
  },
  {
    icon: "🔍",
    bg: "bg-matsu-light",
    title: "即時翻譯與解析",
    desc: "點擊任何日文句子，側欄立刻顯示中文翻譯與語法拆解。",
  },
  {
    icon: "📱",
    bg: "bg-[#FFF3E0]",
    title: "響應式設計 (RWD)",
    desc: "PC 與手機都能流暢使用，通勤路上也能隨時練日文。",
  },
];

function DemoPreviewSection() {
  return (
    <section id="demo" className="bg-card py-[120px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-20">
        {/* Left: Description */}
        <div className="fade-in">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-primary">
            Product Preview
          </p>
          <h2 className="mb-4 text-2xl font-bold leading-snug md:text-[2rem]">
            專為學習設計的
            <br />
            對話介面
          </h2>
          <p className="mb-8 max-w-[560px] text-base leading-relaxed text-text-secondary">
            Desktop 端提供對話 + 側欄糾錯的雙欄佈局；
            <br />
            Mobile 端則以對話為核心，輕觸即可查看反饋。
          </p>

          <div className="flex flex-col gap-5">
            {DEMO_FEATURES.map((f) => (
              <div
                key={f.title}
                className="demo-feature-item flex items-start gap-4 rounded-xl p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${f.bg}`}
                >
                  {f.icon}
                </div>
                <div>
                  <h4 className="mb-1 text-[0.95rem] font-semibold">{f.title}</h4>
                  <p className="text-sm text-text-secondary">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Mockup */}
        <div className="fade-in rounded-3xl border border-border bg-background p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          {/* Titlebar dots */}
          <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFD93D]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#6BCB77]" />
            <span className="ml-3 flex-1 rounded-md bg-card px-4 py-1 text-xs text-text-muted">
              nihongo-ai-tutor.app/practice
            </span>
          </div>

          {/* Body : chat + sidebar */}
          <div className="grid min-h-[260px] grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
            {/* Chat area */}
            <div className="flex flex-col gap-3 rounded-xl bg-card p-5">
              <div className="max-w-[80%] self-start rounded-lg bg-matsu-light px-3.5 py-2.5 text-sm leading-relaxed">
                🎌 次の文を翻訳してください：「我喜歡吃拉麵」
              </div>
              <div className="max-w-[80%] self-end rounded-lg bg-sakura-light px-3.5 py-2.5 text-sm leading-relaxed">
                私はラーメンが食べるのが好きです。
              </div>
              <div className="max-w-[80%] self-start rounded-lg bg-matsu-light px-3.5 py-2.5 text-sm leading-relaxed">
                いいですね！少しだけ修正：
                <br />✅ ラーメンを<strong>食べる</strong>のが好きです
              </div>
            </div>

            {/* Sidebar */}
            <div className="rounded-xl bg-card p-4">
              <p className="mb-3 text-xs font-semibold text-text-muted">📋 即時糾錯</p>
              <div className="mb-2 rounded-lg bg-background p-2.5 text-xs">
                <span className="text-primary line-through">が食べる</span> →{" "}
                <span className="font-semibold text-matsu">を食べる</span>
                <br />
                <span className="text-[0.7rem] text-text-muted">助詞：動作對象用「を」</span>
              </div>
              <div className="rounded-lg bg-background p-2.5 text-xs">
                <strong className="text-[0.7rem]">📝 新單字</strong>
                <br />
                ラーメン (ramen) - 拉麵
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ───
function CTASection() {
  return (
    <section className="cta-section bg-gradient-to-br from-[#2D2926] to-[#3D3833] py-[100px] text-center text-white">
      <div className="fade-in mx-auto max-w-[1120px] px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-white/50">
          Ready to Start?
        </p>
        <h2 className="mb-4 text-2xl font-bold text-white md:text-[2.2rem]">
          今日から、日本語を始めよう。
        </h2>
        <p className="mx-auto mb-10 max-w-[560px] text-base leading-relaxed text-white/65">
          免費開始，無需信用卡。讓 AI 成為你最有耐心的日語老師。
        </p>
        <Link
          href="/signup"
          className="btn-primary-landing inline-flex items-center gap-2 rounded-2xl bg-primary px-10 py-[18px] text-lg font-semibold text-white shadow-[0_4px_24px_rgba(208,93,110,0.4)]"
        >
          🎌 立即免費開始
        </Link>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════
export default function Home() {
  const pageRef = useScrollFadeIn();

  return (
    <div ref={pageRef} className="min-h-screen bg-background font-[var(--font-jp)] antialiased">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoPreviewSection />
      <CTASection />
      <Footer />
    </div>
  );
}
