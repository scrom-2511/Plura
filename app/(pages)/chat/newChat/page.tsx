import Chatcomponent from "@/app/components/Chatcomponent";
import LetComponent from "@/app/components/LeftComponent";
import PromptBox from "@/app/components/PromptBox";

const Home = () => {
  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-[15%_85%]">
        <LetComponent/>
        <div className="grid grid-cols-4 grid-rows-[auto_100px] gap-3 p-10 max-h-full h-full overflow-hidden">
          <Chatcomponent />
        </div>
      </div>
    </div>
  );
};

export default Home;
