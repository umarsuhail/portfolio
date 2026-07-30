export type CriticalIconName =
  | "arrow-right"
  | "chat"
  | "chevron-down"
  | "chevron-up"
  | "code"
  | "download"
  | "eye"
  | "file"
  | "github"
  | "instagram"
  | "linkedin"
  | "logout"
  | "star"
  | "user"
  | "verified";

type Props = {
  name: CriticalIconName;
  className?: string;
  style?: React.CSSProperties;
};

const paths: Partial<Record<CriticalIconName, React.ReactNode>> = {
  "arrow-right": <path d="M5 12h13m-5-5 5 5-5 5" />,
  chat: <path d="M5 6.8A4 4 0 0 1 9 3h6a4 4 0 0 1 4 4v3.8a4 4 0 0 1-4 4H9.5L5 19v-4.5a4 4 0 0 1-2-3.4V6.8Z" />,
  "chevron-down": <path d="m7 10 5 5 5-5" />,
  "chevron-up": <path d="m7 14 5-5 5 5" />,
  code: <path d="m9 8-4 4 4 4m6-8 4 4-4 4M13 6l-2 12" />,
  download: <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v2h14v-2" />,
  eye: <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  file: <path d="M7 3h7l3 3v15H7V3Zm7 0v4h4M9.5 12h5M9.5 16h5" />,
  logout: <path d="M9 8h6m-3-3v6m-6 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4m6 10h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4" />,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  verified: <path d="m9.2 12.4 2 2 4-5M12 3l2.2 1.5 2.7.1 1.1 2.5 2.1 1.7-.7 2.6.7 2.6-2.1 1.7-1.1 2.5-2.7.1L12 21l-2.2-1.5-2.7-.1L6 16.9l-2.1-1.7.7-2.6-.7-2.6L6 8.3l1.1-2.5 2.7-.1L12 3Z" />,
};

const labels: Partial<Record<CriticalIconName, string>> = {
  github: "GH",
  instagram: "IG",
  linkedin: "in",
};

export default function CriticalIcon({ name, className, style }: Props) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {paths[name] ?? (
        <text
          x="12"
          y="15"
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          style={{ fontSize: 8, fontWeight: 800 }}
        >
          {labels[name] ?? ""}
        </text>
      )}
    </svg>
  );
}
