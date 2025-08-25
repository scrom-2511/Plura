import LeftComponent from "@/app/components/LeftComponent";

/**
 * Root layout component that wraps the application.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Dynamic content to render on the right side
 */
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  // Render the main layout with a fixed left component and dynamic right content
  return (
    <html lang="en">
      <body>
        <div className="h-screen w-screen grid grid-cols-[15%_85%]">
          {/* Left loads ONCE and persists */}
          <LeftComponent />

          {/* Right side is dynamic and changes with routing */}
          <div className="grid grid-cols-4 grid-rows-[auto_100px] gap-3 p-10 max-h-full h-full overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
