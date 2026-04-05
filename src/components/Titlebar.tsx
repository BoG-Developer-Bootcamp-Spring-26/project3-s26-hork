import React from "react";
import appLogo from "@images/appLogo.png";
import searchLogo from "@images/searchLogo.png";

interface TitleBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const TitleBar = ({ searchValue, onSearchChange }: TitleBarProps) => {
  return (
    <div className="w-full bg-white border border-gray-200 px-6 py-4 relative shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex items-center">
        {/* left: logo +title */}
        <div className="flex items-center gap-1 shrink-0 ml-2 mr-4">
          <img src={appLogo.src} alt="Logo" className="h-9 object-contain" />
          <span className="font-oswald font-[500] text-gray-900 text-[2.25rem] leading-none -translate-y-[2px]">Progress</span>
        </div>

        {/* search bar: centered in full bar by default- shifts right when no space */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 'max(calc(50% - 14rem), 236px)',
            width: '28rem',
            maxWidth: 'calc(100% - 240px)',
          }}
        >
          <div className="relative w-full pointer-events-auto">
            <img
              src={searchLogo.src}
              alt="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40"
            />
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              {...(searchValue !== undefined ? { value: searchValue } : {})}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
