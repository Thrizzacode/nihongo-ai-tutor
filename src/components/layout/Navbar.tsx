"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

const NAV_LINKS = [
  { href: "#features", label: "功能特色" },
  { href: "#how-it-works", label: "使用方式" },
  { href: "#demo", label: "產品預覽" },
];

function useNavbarScroll() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      navRef.current.style.boxShadow =
        window.scrollY > 20 ? "0 1px 12px rgba(0,0,0,0.06)" : "none";
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return navRef;
}

export default function Navbar() {
  const navRef = useNavbarScroll();
  const [isOpen, setIsOpen] = useState(false);

  // 點擊連結後自動關閉選單
  const handleLinkClick = () => setIsOpen(false);

  // 選單開啟時鎖定 body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} className="navbar px-6">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold">
          <Image
            src={logo}
            alt="Nihongo AI Logo"
            width={60}
            height={60}
            quality={100}
            className="h-10 w-10 md:h-[60px] md:w-[60px]"
          />
          <span>Nihongo AI Tutor</span>
        </Link>

        {/* Navigation Links (desktop) */}
        <ul
          className="hidden items-center gap-8 md:flex"
          style={{ listStyle: "none" }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="navbar-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA (desktop) */}
        <Link
          href="/signup"
          className="btn-primary-landing hidden rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white md:inline-flex"
        >
          免費體驗
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={isOpen ? "關閉選單" : "開啟選單"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`h-0.5 w-[22px] rounded-full bg-foreground transition-all duration-300 ${
              isOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-[22px] rounded-full bg-foreground transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-[22px] rounded-full bg-foreground transition-all duration-300 ${
              isOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-[280px] flex-col bg-background pt-24 shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-2 px-6" style={{ listStyle: "none" }}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-sakura-light hover:text-primary"
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-border p-6">
          <Link
            href="/signup"
            className="btn-primary-landing flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
            onClick={handleLinkClick}
          >
            免費體驗
          </Link>
        </div>
      </div>
    </nav>
  );
}
