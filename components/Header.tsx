"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  ChevronDown,
  Menu,
  X,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const Logo = () => (
  <Link href="/" className="flex items-center ">
    <Image src="/BetterLogo-nobg.png" alt="Logo" width={60} height={60} />
    <span
      style={{ fontFamily: "Pilat Extended" }}
      className="logo-text ml-2 text-white text-xl font-bold hidden sm:block"
    >
      BETAI
    </span>
  </Link>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  return (
    <header className="h-[79px] border-b border-[#212429] shadow-lg bg-[#07070A] flex items-center justify-between px-12">
      <div>
        <Logo />
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-4">
          <Link
            href="https://t.me/BETAIPORTAL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <MessageCircle size={20} />
          </Link>
          <Link
            href="https://x.com/BETAIONSOL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors mr-2"
          >
            <Twitter size={20} />
          </Link>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        >
          <Globe className="text-white" />
          <ChevronDown className="text-white" />
        </div>

        {isLanguageDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#07070A] border border-[#212429] rounded-md shadow-lg z-50">
            <div className="py-2">
              <button
                className="w-full text-left px-4 py-2 text-white hover:bg-[#212429] transition-colors"
                onClick={() => setIsLanguageDropdownOpen(false)}
              >
                English
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white p-2 hover:bg-[#212429] rounded-md transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed top-[79px] right-0 w-full sm:w-[300px] h-[calc(100vh-79px)] bg-[#07070A] border-l border-[#212429] transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-6 space-y-6">
          {["Dashboard", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-white text-[18px] leading-[22px] font-normal hover:text-gray-300 transition-colors font-manrope"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="fixed top-[79px] left-0 right-0 bottom-0 bg-black/30 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
