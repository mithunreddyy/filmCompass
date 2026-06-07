import { Compass } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <div className="fc-page flex min-h-[55vh] items-center justify-center">
      <EmptyState
        icon={Compass}
        title="Lost in the catalogue"
        description="The page you're looking for doesn't exist. Maybe the film was pulled from theaters, or you took a wrong turn."
        actions={[
          { label: "Back to Home", href: "/" },
          { label: "Discover Telugu", href: "/discover?language=te", variant: "ghost" },
        ]}
      />
    </div>
  );
}
