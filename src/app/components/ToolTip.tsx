import { ReactElement, useState } from "react";
type toolTip={
    children:ReactElement,
    text:string
}
const Tooltip = ({ children, text }:toolTip) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <div
        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-sm rounded-md py-1 px-2 shadow-lg transition-opacity duration-300 ${
          showTooltip ? "opacity-100 delay-200" : "opacity-0"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
