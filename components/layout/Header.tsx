"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface HeaderProps {
  navItems: NavItem[];
  clinicName: string;
  phone: string;
}

export default function Header({ navItems, clinicName, phone }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-brand-800 focus-visible:ring-2"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center text-sm font-black">
              M
            </span>
            <span className={cn(transparent ? "text-white" : "text-brand-800")}>
              {clinicName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    pathname === item.href
                      ? "text-brand-600 bg-brand-50"
                      : transparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-slate-700 hover:text-brand-600 hover:bg-brand-50",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:text-brand-600 hover:bg-brand-50 last:rounded-b-xl first:rounded-t-xl"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + phone */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${phone}`}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                transparent
                  ? "text-white/80 hover:text-white"
                  : "text-slate-600 hover:text-brand-600",
              )}
              aria-label={`Call us at ${phone}`}
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
            <Link
              href="/appointments"
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors duration-200 shadow-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              transparent
                ? "text-white hover:bg-white/10"
                : "text-slate-700 hover:bg-slate-100",
            )}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white border-b border-border overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-brand-600 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-brand-50",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600"
                >
                  <Phone className="w-4 h-4" /> {phone}
                </a>
                <Link
                  href="/appointments"
                  className="block text-center px-5 py-3 bg-brand-500 text-white text-sm font-semibold rounded-xl"
                >
                  Book Appointment
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
