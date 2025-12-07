import type { SVGProps } from "react";
import { Sparkles } from "lucide-react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center">
      <Sparkles className="w-5 h-5 text-white" />
    </div>
  );
}
