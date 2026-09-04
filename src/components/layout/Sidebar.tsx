import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Brain,
  LayoutDashboard,
  Lightbulb,
  Network,
  ShieldHalf,
  TrendingUp,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/traffic", label: "Traffic Analysis", icon: Activity },
  { to: "/features", label: "Feature Extraction", icon: Network },
  { to: "/world-model", label: "World Model", icon: Brain },
  { to: "/prediction", label: "Prediction", icon: TrendingUp },
  { to: "/explainability", label: "Explainability", icon: Lightbulb },
  { to: "/benchmarking", label: "Benchmarking", icon: BarChart3 },
] as const;

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
          <ShieldHalf className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-sidebar-foreground">
            Predictive Cyber Defence
          </p>
          <p className="text-[11px] text-muted-foreground">AI World Model Console</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary",
            }}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4 text-[11px] leading-relaxed text-muted-foreground">
        Prototype build · demo data only. No live inference backend attached.
      </div>
    </aside>
  );
}
