import Chatcomponent from "@/app/components/Chatcomponent";
import React, { useState } from "react";

const Home = () => {
  

  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-[15%_85%]">
        <div className=""></div>
        <div className="grid grid-cols-4 grid-rows-[auto_100px] gap-3 p-10 max-h-full h-full overflow-hidden">
          
          <Chatcomponent/>
          
        </div>
      </div>
    </div>
  );
};

export default Home;

const NoChatComponent = () => {
  return (
    <>
      <div className="bg-primary rounded-2xl h-40 self-center text-center">CHATGPT</div>
      <div className="bg-primary rounded-2xl h-40 self-center text-center">DEEPSEEK</div>
      <div className="bg-primary rounded-2xl h-40 self-center text-center">MISTRAL</div>
      <div className="bg-primary rounded-2xl h-40 self-center text-center">LLAMA</div>
    </>
  );
};

// {/* <h1 className="text-center text-sm font-bold mb-2">CHATGPT</h1>
//   <div>
//                 <div>
//                   <h6 className="font-bold">User</h6>
//                   <p>a para</p>
//                 </div>
//                 <div>
//                   <h6 className="font-bold">Model</h6>
//                   <p>this is a long paragraph i wrote to test the ui paragraph i wrote to test the ui</p>
//                 </div>
//               </div>

//               <div>
//                 <div>
//                   <h6 className="font-bold">User</h6>
//                   <p>a para</p>
//                 </div>
//                 <div>
//                   <h6 className="font-bold">Model</h6>
//                   <p>this is a long paragraph i wrote to test the ui paragraph i wrote to test the ui</p>
//                 </div>
//               </div> */}
