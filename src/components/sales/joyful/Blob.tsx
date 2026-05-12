import { CSSProperties } from "react";

interface BlobProps {
  className?: string;
  color?: string; // tailwind text-* class controls fill via currentColor
  style?: CSSProperties;
}

// Decorative SVG blob - uses currentColor so you can color it via text-*
export const Blob = ({ className = "", color = "text-joy-peach", style }: BlobProps) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={`${color} ${className}`}
    style={style}
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M44.5,-66.5C56.4,-58.6,63.7,-43.4,68.7,-28.1C73.7,-12.7,76.4,2.7,72.1,16.1C67.8,29.5,56.5,40.9,43.6,49.8C30.7,58.7,16.4,65,0.9,63.8C-14.5,62.6,-29,53.9,-42.4,44.4C-55.8,34.9,-68,24.7,-71.7,11.6C-75.4,-1.4,-70.6,-17.2,-62.2,-29.8C-53.7,-42.4,-41.6,-51.8,-28.6,-59.6C-15.6,-67.4,-1.7,-73.6,12.9,-73.4C27.5,-73.2,32.6,-74.4,44.5,-66.5Z"
      transform="translate(100 100)"
    />
  </svg>
);

export default Blob;
