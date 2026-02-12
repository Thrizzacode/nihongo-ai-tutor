"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

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
          />
          <span>Nihongo AI Tutor</span>
        </Link>

        {/* Navigation Links (desktop) */}
        <ul
          className="hidden items-center gap-8 md:flex"
          style={{ listStyle: "none" }}
        >
          <li>
            <a href="#features" className="navbar-link">
              功能特色
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="navbar-link">
              使用方式
            </a>
          </li>
          <li>
            <a href="#demo" className="navbar-link">
              產品預覽
            </a>
          </li>
        </ul>

        {/* CTA */}
        <Link
          href="/signup"
          className="btn-primary-landing hidden rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white md:inline-flex"
        >
          免費體驗
        </Link>

        {/* Hamburger (mobile) */}
        <button className="flex flex-col gap-[5px] md:hidden" aria-label="選單">
          <span className="h-0.5 w-[22px] rounded-full bg-foreground" />
          <span className="h-0.5 w-[22px] rounded-full bg-foreground" />
          <span className="h-0.5 w-[22px] rounded-full bg-foreground" />
        </button>
      </div>
    </nav>
  );
}
