"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

const NAV_LINKS = [
  { href: "/basics", label: "基礎知識" },
  { href: "/#features", label: "功能特色" },
  { href: "/#how-it-works", label: "使用方式" },
];

function useNavbarScroll() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
}

export default function Navbar() {
  const isScrolled = useNavbarScroll();
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
    <>
      <nav
        className={`navbar fixed top-0 left-0 right-0 z-[200] ${isOpen ? "is-open" : ""} ${
          isScrolled ? "scrolled" : ""
        }`}
      >
        <div className="mx-auto flex w-full max-w-280 items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 text-lg font-bold transition-opacity duration-300 md:opacity-100 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Image
              src={logo}
              alt="Nihongo AI Logo"
              width={60}
              height={60}
              className="h-10 w-10 md:h-15 md:w-15"
            />
            <span>Nihongo AI Tutor</span>
          </Link>

          {/* Navigation Links (desktop) */}
          <ul className="hidden items-center gap-8 md:flex list-none">
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
            className="relative flex h-8 w-8 flex-col items-center justify-center gap-1.25 md:hidden"
            aria-label={isOpen ? "關閉選單" : "開啟選單"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`h-0.5 w-5.5 rounded-full bg-foreground transition-all duration-300 ${
                isOpen ? "translate-y-1.75 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5.5 rounded-full bg-foreground transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5.5 rounded-full bg-foreground transition-all duration-300 ${
                isOpen ? "-translate-y-1.75 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Move outside to avoid backdrop-filter issues */}
      <div
        className={`fixed inset-0 z-[140] bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel - Move outside to avoid backdrop-filter issues */}
      <div
        className={`fixed right-0 top-0 z-[150] flex h-full w-70 flex-col bg-background pt-24 shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-2 px-6 list-none">
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
    </>
  );
}
