import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ArrowRightIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

export function ArrowLeftIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
}

export function ShareIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></svg>
}

export function CopyIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>
}

export function CheckIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m5 12 4 4L19 6" /></svg>
}

export function RefreshIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></svg>
}

export function DownloadIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 4v10M8 10l4 4 4-4M5 20h14" /></svg>
}

export function SparkleIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 3.5 13.5 9l5.5 1.5-5.5 1.5L12 17.5 10.5 12 5 10.5 10.5 9 12 3.5Z" /><path d="M19 16.5v4M17 18.5h4" /></svg>
}

export function GridIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></svg>
}
