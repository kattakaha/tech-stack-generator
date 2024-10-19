import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 pt-2 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">Source:</span>
          <a
            className="ml-2 text-sm text-gray-600 hover:text-gray-900 hover:underline"
            href="https://skillicons.dev/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Skill Icons website"
          >
            Skill Icons
          </a>
        </div>
        <div className="py-4 text-center text-sm text-gray-500">
          © 2024 okano-t-ww(Tatsuya Okano)
        </div>
      </div>
    </footer>
  );
}
