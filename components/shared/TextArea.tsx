"use client";
import { useEffect, useId, useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TeaxtArea({ promptData }: { promptData?: string }) {
  const [prompt, setPrompt] = useState("");
  const id = useId();

  useEffect(() => {
    if (promptData !== null && promptData !== undefined && prompt === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrompt(promptData);
    }
  }, [prompt, promptData]);

  return (
    <div className="mt-2">
      <Label htmlFor={id}>
        Required Prompt <span className="text-destructive">*</span>
      </Label>
      <Textarea
        id={id}
        placeholder="Leave a message"
        required
        value={prompt}
        className="max-h-96"
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
  );
}
