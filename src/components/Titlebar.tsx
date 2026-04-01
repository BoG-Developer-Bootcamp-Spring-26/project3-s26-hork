import React from "react";
import appLogo from "@images/appLogo.png";

const TitleBar = () => {
  return (
    <div className="w-full bg-gray-100 border-2 border-black px-4 py-2 relative max-h-24">
      <div className="flex justify-between items-center mx-auto h-[8vh] p-2">
        {/* left: logo and title */}
        <div className="flex items-center justify-items-center h-[4vh]">
          <button className="border-none bg-transparent mr-2 hover:cursor-pointer h-[6vh] flex items-center">
            <img src={appLogo.src} alt="Logo" className=""/>
          </button>
          <h1 className="font-oswald text-5xl">Progress</h1>
        </div>
        
        {/* middle: search bar */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full pointer-events-none">
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className="w-full max-w-md border rounded-lg px-3 py-2 pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default TitleBar;
