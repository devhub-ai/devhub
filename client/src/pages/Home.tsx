import { cn } from "@/lib/utils";
import { PlaceholdersAndVanishInputDemo } from "@/components/chat";
import HomeSidebar from "@/components/Sidebar/HomeSidebar";

interface HomeProps {
  onLogout: () => void;
  username: string;
}

const Home: React.FC<HomeProps> = ({ onLogout, username }) => {
  
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <HomeSidebar onLogout={onLogout} username={username} />
      <Dashboard />
    </div>
  );
};


const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <PlaceholdersAndVanishInputDemo />
      </div>
    </div>
  );
};

export default Home;