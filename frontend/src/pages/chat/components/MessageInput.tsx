import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage } = useChatStore();

  const handleSentMessage = () => {
    if (!selectedUser || !user || !message) return;
    console.log("message", message);

    sendMessage(user.id, selectedUser.clerkId, message.trim());
    setMessage("");
  };
  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSentMessage()}
        />

        <Button
          size={"icon"}
          onClick={handleSentMessage}
          disabled={!message.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
