"use client";

import { useEffect, useRef } from "react";

/**
 * 自訂 Hook：使用 Intersection Observer 偵測元素進入視窗，
 * 當目標元素可見時加入 CSS class 觸發動畫。
 */
export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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

    // 觀察本身與所有子元素
    const targets = el.querySelectorAll(".fade-in");
    targets.forEach((t) => observer.observe(t));
    if (el.classList.contains("fade-in")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
