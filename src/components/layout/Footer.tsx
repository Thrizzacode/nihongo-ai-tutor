import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

const FOOTER_LINKS = [
  { href: "#features", label: "功能" },
  { href: "#how-it-works", label: "使用方式" },
  { href: "#demo", label: "產品預覽" },
  { href: "#", label: "隱私政策" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-[60px]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-5 px-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2.5 font-semibold">
          <Image src={logo} alt="Nihongo AI Logo" width={40} height={40} />
          <span>Nihongo AI Tutor</span>
        </div>

        <ul className="flex flex-wrap justify-center gap-7" style={{ listStyle: "none" }}>
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-sm text-text-muted">© 2026 Nihongo AI Tutor. All rights reserved.</p>
      </div>
    </footer>
  );
}
