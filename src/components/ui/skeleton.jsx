import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-md bg-slate-900/10 dark:bg-slate-50/10 animate-pulse", 
        className
      )}
      {...props}
    >
      <div 
        className="absolute inset-y-0 w-1/4 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-slate-50/20 to-transparent"
        style={{ left: "0%", right: "auto" }}
      />
    </div>
  );
}

export { Skeleton }