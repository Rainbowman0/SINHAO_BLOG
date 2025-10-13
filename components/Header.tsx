"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x group"
          >
            {/* Feather Icon - Light Mode */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 512 512"
              className="block dark:hidden transition-transform group-hover:scale-110"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(256, 256)">
                <path
                  d="M 0,-136 Q -3,-68 -8,0 Q -12,68 -16,136"
                  stroke="#D4A574"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M -8,-102 Q -60,-95 -85,-85 M -8,-68 Q -68,-60 -93,-50 M -8,-34 Q -72,-25 -98,-15 M -10,0 Q -77,8 -102,18 M -12,34 Q -77,43 -98,53 M -14,68 Q -72,77 -93,87"
                  stroke="#B8866F"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M -8,-102 Q 44,-95 69,-85 M -8,-68 Q 52,-60 77,-50 M -8,-34 Q 56,-25 82,-15 M -10,0 Q 61,8 86,18 M -12,34 Q 61,43 82,53 M -14,68 Q 56,77 77,87"
                  stroke="#B8866F"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <circle cx="-16" cy="145" r="13" fill="#D4A574" opacity="0.6"/>
                <circle cx="-16" cy="145" r="7" fill="#B8866F"/>
              </g>
            </svg>

            {/* Feather Icon - Dark Mode */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 512 512"
              className="hidden dark:block transition-transform group-hover:scale-110"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(256, 256)">
                <path
                  d="M 0,-136 Q -3,-68 -8,0 Q -12,68 -16,136"
                  stroke="#E8DCC4"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M -8,-102 Q -60,-95 -85,-85 M -8,-68 Q -68,-60 -93,-50 M -8,-34 Q -72,-25 -98,-15 M -10,0 Q -77,8 -102,18 M -12,34 Q -77,43 -98,53 M -14,68 Q -72,77 -93,87"
                  stroke="#D4A574"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M -8,-102 Q 44,-95 69,-85 M -8,-68 Q 52,-60 77,-50 M -8,-34 Q 56,-25 82,-15 M -10,0 Q 61,8 86,18 M -12,34 Q 61,43 82,53 M -14,68 Q 56,77 77,87"
                  stroke="#D4A574"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <circle cx="-16" cy="145" r="13" fill="#E8DCC4" opacity="0.6"/>
                <circle cx="-16" cy="145" r="7" fill="#D4A574"/>
              </g>
            </svg>

            {/* Site Name */}
            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              SINHAO的基地
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              首页
            </Link>
            <Link
              href="/tags"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              分类
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              关于
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换菜单"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                首页
              </Link>
              <Link
                href="/tags"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                分类
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                关于
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
