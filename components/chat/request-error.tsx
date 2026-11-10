import { Button } from "@/components/ui/button";

export function RequestError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="chat-load-error" role="alert">
      <p>{message}</p>
      <Button size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
