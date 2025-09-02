"use client";
import React, { useState } from "react";
import { OptionsMenu, useOptionsMenuStore } from "../zustand/store";
import { deleteChat } from "../reqHandlers/deleteChat.reqHandlers";
import { renameChat } from "../reqHandlers/renameChat.reqHandlers";

const OptionsComponent = () => {
  const options = useOptionsMenuStore((state) => state.options);
  const [renameComponent, setRenameComponent] = useState<boolean>(true);
  const [newName, setNewName] = useState<string>("");

  const handleOnClickDeleteChat = async () => {
    const deleteChatt = await deleteChat(options);
  };

  const handleOnClickRenameOptionClick = async () => {
    setRenameComponent(true);
  };

  const handleOnClickRenameChatClick = async () => {
    const rename = await renameChat(options, newName);
    setRenameComponent(false);
  };

  const optionsMenu = useOptionsMenuStore((state) => state.options);
  return (
    <>
      {renameComponent && (
        <div className="absolute bg-primary h-auto w-80 rounded-xl text-[12px] p-7 shadow-[0_0px_20px_rgba(255,0,0,0)] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <h1 className="pb-5">RENAME CHAT</h1>
          <input type="text" placeholder="Add a new name" className="w-full mb-5 focus:outline-0" onChange={(e) => setNewName(e.target.value)} />
          <button className="" onClick={handleOnClickRenameChatClick}>
            Rename
          </button>
        </div>
      )}
      <div
        className="absolute bg-primary h-20 w-40 grid grid-rows-2 rounded-xl top-52 items-center text-[12px] px-3 shadow-[0_0px_20px_rgba(255,0,0,0)]"
        style={{ display: optionsMenu.visibility ? "grid" : "none" }}
      >
        <div className="" onClick={handleOnClickRenameOptionClick}>
          RENAME
        </div>
        <div className="" onClick={handleOnClickDeleteChat}>
          DELETE CHAT
        </div>
      </div>
    </>
  );
};

export default OptionsComponent;
