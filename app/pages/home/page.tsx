import Chatcomponent from "@/app/components/Chatcomponent";
import PromptBox from "@/app/components/PromptBox";

const Home = () => {
  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-[15%_85%]">
        <div className="w-full grid grid-rows-[150px_auto] p-5 py-10 overflow-hidden">
          <div className="w-full flex flex-col items-center gap-5">
            <button className="bg-primary rounded-xl w-full h-12 text-sm font-bold">NEW CHAT</button>
            <input type="text" className="bg-primary w-full rounded-xl h-12 text-[13px] focus:outline-0 p-5" placeholder="Search..." />
          </div>
          <div className="w-full flex flex-col items-center gap-5 overflow-auto">
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
            <div className="bg-primary rounded-xl w-full min-h-12 text-sm font-bold">CHAT1</div>
          </div>
        </div>
        <div className="grid grid-cols-4 grid-rows-[auto_100px] gap-3 p-10 max-h-full h-full overflow-hidden">
          <Chatcomponent/>
        </div>
      </div>
    </div>
  );
};

export default Home;


