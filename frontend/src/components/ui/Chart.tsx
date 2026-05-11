import React, { useId } from 'react';

/* ─── Shared types ────────────────────────────────────────────── */

export interface ChartDataPoint {
  label: string;
  value: number;
  /** Optional hex color override */
  color?: string;
}

/* ─── Default palette ─────────────────────────────────────────── */

const DEFAULT_COLORS = [
  '#1F7A3A', '#F59E0B', '#3B82F6', '#EC4899',
  '#14532D', '#F97316', '#8B5CF6', '#06B6D4',
];

/* ─── Helper: set CSS custom properties via ref ───────────────── */

function setCSSVars(el: HTMLElement | SVGElement | null, vars: Record<string, string | number>) {
  if (!el) return;
  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, String(v)));
}

/* ─────────────────────────────────────────────────────────────── */
/*  BAR CHART                                                       */
/* ─────────────────────────────────────────────────────────────── */

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showValues?: boolean;
  showLabels?: boolean;
  className?: string;
  /** Accent color for all bars (overridden by per-point color) */
  color?: string;
}

/**
 * BarChart — vertical bar chart rendered with pure SVG/CSS.
 *
 * ```tsx
 * <BarChart
 *   data={[
 *     { label: 'Jan', value: 45 },
 *     { label: 'Feb', value: 78 },
 *   ]}
 * />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showValues = true,
  showLabels = true,
  className = '',
  color = '#1F7A3A',
}) => {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div
      className={`w-full chart-height-container ${className}`}
      ref={el => setCSSVars(el, { '--chart-height': `${height}px` })}
    >
      <div className="flex items-end justify-between gap-2 h-full w-full">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const barColor = d.color ?? color;
          return (
            <div key={i} className="group flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {showValues && (
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.value.toLocaleString()}
                </span>
              )}
              <div
                className="w-full relative chart-bar-track"
                ref={el => setCSSVars(el, {
                  '--bar-height': `${pct}%`,
                  '--bar-min-height': '4px',
                })}
              >
                <div
                  className="w-full h-full rounded-t-lg transition-all duration-700 origin-bottom hover:scale-x-110 hover:shadow-lg chart-bar-fill"
                  ref={el => setCSSVars(el, {
                    '--bar-color-end': `${barColor}cc`,
                    '--bar-color-start': barColor,
                  })}
                />
                {/* Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[9px] font-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {d.value.toLocaleString()}
                </div>
              </div>
              {showLabels && (
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider text-center w-full truncate">
                  {d.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────── */
/*  LINE CHART                                                      */
/* ─────────────────────────────────────────────────────────────── */

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showDots?: boolean;
  showLabels?: boolean;
  color?: string;
  fill?: boolean;
  className?: string;
}

/**
 * LineChart — smooth SVG polyline / area chart.
 *
 * ```tsx
 * <LineChart data={revenueData} fill color="#1F7A3A" />
 * ```
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  showDots = true,
  showLabels = true,
  color = '#1F7A3A',
  fill = true,
  className = '',
}) => {
  const uid = useId();
  const W = 500;
  const H = 160;
  const PAD = { top: 20, right: 20, bottom: 30, left: 20 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PAD.top + (1 - (d.value - min) / range) * innerH,
    ...d,
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area =
    pts.length > 0
      ? `M${pts[0].x},${H - PAD.bottom} ` +
        pts.map(p => `L${p.x},${p.y}`).join(' ') +
        ` L${pts[pts.length - 1].x},${H - PAD.bottom} Z`
      : '';

  return (
    <div
      className={`w-full chart-height-container ${className}`}
      ref={el => setCSSVars(el, { '--chart-height': `${height}px` })}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Fill area */}
        {fill && <path d={area} fill={`url(#${uid})`} />}

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + t * innerH}
            y2={PAD.top + t * innerH}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          pts.map((p, i) => (
            <g key={i} className="group">
              <circle cx={p.x} cy={p.y} r="6" fill={color} fillOpacity="0.15" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="white" strokeWidth="2" />
              {/* Tooltip */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect x={p.x - 22} y={p.y - 26} width="44" height="18" rx="4" fill="#111827" />
                <text x={p.x} y={p.y - 14} textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
                  {p.value.toLocaleString()}
                </text>
              </g>
            </g>
          ))}

        {/* X labels */}
        {showLabels &&
          pts.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={H - 4}
              textAnchor="middle"
              fontSize="8"
              fill="#9CA3AF"
              fontWeight="700"
            >
              {p.label}
            </text>
          ))}
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────── */
/*  PIE / DONUT CHART                                               */
/* ─────────────────────────────────────────────────────────────── */

interface DonutChartProps {
  data: ChartDataPoint[];
  size?: number;
  thickness?: number;
  /** Centre label (e.g. total) */
  label?: React.ReactNode;
  showLegend?: boolean;
  className?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start);
  const e = polarToCartesian(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/**
 * DonutChart — animated SVG donut / pie chart with legend.
 *
 * ```tsx
 * <DonutChart
 *   data={[
 *     { label: 'Direct', value: 62 },
 *     { label: 'OTA',    value: 38, color: '#F59E0B' },
 *   ]}
 *   label={<span className="text-2xl font-black">62%</span>}
 * />
 * ```
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 160,
  thickness = 28,
  label,
  showLegend = true,
  className = '',
}) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;

  let angle = 0;
  const arcs = data.map((d, i) => {
    const sweep = (d.value / total) * 360;
    const start = angle;
    angle += sweep;
    return { ...d, start, end: angle, color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] };
  });

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* SVG Donut */}
      <div
        className="relative shrink-0 chart-donut-wrapper"
        ref={el => setCSSVars(el, { '--donut-size': `${size}px` })}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={thickness} />
          {/* Arcs */}
          {arcs.map((arc, i) => (
            <path
              key={i}
              d={describeArc(cx, cy, r, arc.start, Math.min(arc.end, arc.start + 359.99))}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          ))}
        </svg>
        {/* Centre label */}
        {label && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {label}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <ul className="space-y-2 min-w-0">
          {arcs.map((arc, i) => {
            const pct = ((arc.value / total) * 100).toFixed(1);
            return (
              <li key={i} className="flex items-center gap-2 min-w-0">
                <span
                  className="chart-legend-dot w-2.5 h-2.5 rounded-full shrink-0"
                  ref={el => setCSSVars(el, { '--legend-color': arc.color })}
                />
                <span className="text-[11px] font-bold text-gray-500 truncate">{arc.label}</span>
                <span className="text-[11px] font-black text-[#111827] ml-auto pl-2">{pct}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────── */
/*  SPARKLINE (minimal inline chart)                               */
/* ─────────────────────────────────────────────────────────────── */

interface SparklineProps {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Sparkline — tiny inline trend line with no axes or labels.
 *
 * ```tsx
 * <Sparkline values={[10, 24, 18, 35, 28, 42]} color="#1F7A3A" />
 * ```
 */
export const Sparkline: React.FC<SparklineProps> = ({
  values,
  color = '#1F7A3A',
  width = 80,
  height = 24,
  className = '',
}) => {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = width;
  const H = height;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    /* SVG width/height are presentation attributes, not CSS inline styles */
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
