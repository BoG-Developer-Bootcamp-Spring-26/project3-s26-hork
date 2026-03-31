import React from "react";
import appLogo from "@images/appLogo.png";

const TitleBar = () => {
  return (
    <div className="flex flex-col items-center">
      <button className="border-none bg-transparent p-0">
        <span role="img" aria-label="Logo">
          <img src={appLogo.src} alt="Logo" />
        </span>
      </button>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search"
          aria-label="Search"
        />
      </div>
    </div>
  );
}

export default TitleBar;
