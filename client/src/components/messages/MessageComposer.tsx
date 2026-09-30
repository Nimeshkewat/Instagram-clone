import { Send } from "lucide-react";
import type { SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";

type MessageComposerProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

function MessageComposer({
  value,
  isSending,
  onChange,
  onSubmit,
}: MessageComposerProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex shrink-0 items-end gap-2 border-t border-gray-200 bg-white p-3 sm:px-5 sm:py-4"
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Message..."
        aria-label="Write a message"
        autoComplete="off"
        className="h-11 rounded-full bg-gray-50 px-4"
        maxLength={2000}
      />
      <Button
        type="submit"
        size="icon"
        className="h-11 w-11 shrink-0 rounded-full"
        disabled={!value.trim() || isSending}
        aria-label="Send message"
      >
        {isSending ? <Loader size={18} /> : <Send size={18} />}
      </Button>
    </form>
  );
}

export default MessageComposer;
