"use client";

import React from "react";

type PromptBoxProps = {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleOnClick: () => void;
};

const PromptBox = ({ prompt, setPrompt, handleOnClick }: PromptBoxProps) => {
  return (
    <div className="col-span-2 col-start-2 bg-primary rounded-2xl flex items-center px-10">
      <textarea
        name="prompt"
        id="prompt"
        className="resize-none focus:outline-0 w-full text-sm text-secondary"
        placeholder="Ask Anything"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button onClick={handleOnClick}>SEND</button>
    </div>
  );
};

export default PromptBox;
