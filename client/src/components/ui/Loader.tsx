import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function Loader({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Loader2
      className={cn("animate-spin", className)}
      style={{ width: size, height: size }}
    />
  );
}

export default Loader;
