"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Brand from "./Brand";

const links = [
  { href: "/", key: "home" },
  { href: "/sobre", key: "about" },
  { href: "/criacao", key: "create" },
  { href: "/contato", key: "contact" },
] as const;

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-xs tracking-widest">
      {(["pt", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-line">·</span>}
          <button
            onClick={() => router.replace(pathname, { locale: l })}
            className={`uppercase px-2 py-2 transition-colors cursor-pointer ${
              locale === l
                ? "text-gold"
                : "text-muted hover:text-cream"
            }`}
            aria-current={locale === l ? "true" : undefined}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-ink/80 border-b border-line/60">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Brand compact />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === href
                  ? "text-gold"
                  : "text-cream/80 hover:text-gold-light"
              }`}
            >
              {t(key)}
            </Link>
          ))}
          <LocaleSwitcher />
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <LocaleSwitcher />
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-1.5 p-2 cursor-pointer"
          >
            <span
              className={`block w-5 h-px bg-cream transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-cream transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-line/60 bg-ink/95 backdrop-blur-md"
          >
            {links.map(({ href, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-4 text-sm tracking-wide border-b border-line/40 ${
                    pathname === href ? "text-gold" : "text-cream/85"
                  }`}
                >
                  {t(key)}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
