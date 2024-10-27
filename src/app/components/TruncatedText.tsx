'use client'
import { useState } from 'react';

type text={
    text:string,
    height?:string,
    width?:string,
    charLimit:number
}
const Typography = ({ text, height = 'h-auto', width = 'w-auto', charLimit = 100 }:text) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const getDisplayText = () => {
    if (isExpanded || text.length <= charLimit) return text;
    return `${text.slice(0, charLimit)}...`;
  };

  return (
    <div className={`relative ${height} ${width}  ${isExpanded?'overflow-scroll':'overflow-hidden'}`}>
      <p className="text-gray-400">
        {getDisplayText()}
        {text.length > charLimit && (
          <button
            onClick={toggleReadMore}
            className="ml-2 text-blue-500 hover:underline"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </p>
    </div>
  );
};

export default Typography;
