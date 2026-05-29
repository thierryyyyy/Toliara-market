import React, { useMemo, useContext, createContext, useId, type ReactNode, type ComponentType, type CSSProperties } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps
} from 'recharts';
import { cn } from '@/lib/utils';

// Palette de couleurs par défaut
const CHART_COLORS = [
  'hsl(var(--chart-1, 220 70% 50%))',
  'hsl(var(--chart-2, 160 60% 45%))',
  'hsl(var(--chart-3, 30 80% 55%))',
  'hsl(var(--chart-4, 280 65% 60%))',
  'hsl(var(--chart-5, 340 75% 55%))'
];

// Types
interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
    icon?: ComponentType;
  };
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: ReactNode;
}

// Context pour partager la config
const ChartContext = React.createContext<ChartConfig | null>(null);

export function useChartConfig() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChartConfig must be used within a ChartContainer');
  }
  return context;
}

// Container principal
export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  // Injecter les variables CSS pour les couleurs
  const cssVars = React.useMemo(() => {
    const vars: Record<string, string> = {};
    Object.entries(config).forEach(([key, value], index) => {
      vars[`--color-${key}`] = value.color || CHART_COLORS[index % CHART_COLORS.length];
    });
    return vars;
  }, [config]);

  return (
    <ChartContext.Provider value={config}>
      <div className={cn('w-full h-[350px]', className)} style={cssVars as CSSProperties} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// Tooltip personnalisé
interface ChartTooltipProps extends TooltipProps<number, string> {
  hideLabel?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
}

export function ChartTooltip({ active, payload, label, hideLabel, indicator = 'dot' }: ChartTooltipProps) {
  const config = React.useContext(ChartContext);
  
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border bg-background p-2 shadow-md">
      {!hideLabel && <div className="text-xs text-muted-foreground mb-1">{label}</div>}
      <div className="flex flex-col gap-1">
        {payload.map((entry, index) => {
          const configEntry = config?.[entry.dataKey as string];
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  'h-2.5 w-2.5 shrink-0',
                  indicator === 'dot' && 'rounded-full',
                  indicator === 'line' && 'w-4 h-0.5',
                  indicator === 'dashed' && 'w-4 h-0.5 border-dashed border-t-2'
                )}
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{configEntry?.label || entry.dataKey}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Legend personnalisée
export function ChartLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  const config = React.useContext(ChartContext);
  
  if (!payload?.length) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      {payload.map((entry, index) => {
        const configEntry = config?.[entry.value];
        return (
          <div key={index} className="flex items-center gap-1.5 text-sm">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{configEntry?.label || entry.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// Re-export des composants Recharts pour usage facile
// NOTE: On renomme Tooltip en ChartRechartsTooltip pour éviter conflit avec le Tooltip de shadcn/ui
export {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartRechartsTooltip,
  Legend,
  ResponsiveContainer,
  CHART_COLORS
};

export type { ChartConfig };
