import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
    </Card>
  );
}
