import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <Compass
          size={40}
          className="mx-auto mb-4 text-amber-500 animate-spin"
          style={{ animationDuration: "2s" }}
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
