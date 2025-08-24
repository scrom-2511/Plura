"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LeftComponent = () => {
  const router = useRouter();
  useEffect(()=>{
    
  })
  return (
    <>
      <div className="w-full grid grid-rows-[150px_auto] p-5 py-10 overflow-hidden">
        <div className="w-full flex flex-col items-center gap-5">
          <button className="bg-primary rounded-xl w-full h-12 text-sm font-bold hover:cursor-pointer" onClick={() => router.push("/chat/newChat")}>
            NEW CHAT
          </button>
          <input type="text" className="bg-primary w-full rounded-xl h-12 text-[13px] focus:outline-0 p-5" placeholder="Search..." />
        </div>
        <div className="w-full h-full flex flex-col items-center gap-5 overflow-auto">
          <div className="bg-primary rounded-xl w-full min-h-12 text-[12px] flex items-center hover:cursor-pointer p-5">
            <h3>CHAT!</h3>
            <p>hi</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftComponent;
