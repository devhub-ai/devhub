import { Skeleton } from "@/components/ui/skeleton";
import { FaExternalLinkAlt } from "react-icons/fa";
import axios from "axios";

interface SidebarProps {
  profileData: UserResponse | null;
  isFriend: boolean;
  isOwnProfile: boolean;
}

const Sidebar = ({ profileData, isFriend, isOwnProfile }: SidebarProps) => {
  const handleFriendRequest = async () => {
    // logic for handling friend request
  };

  return (
    <div className="space-y-6 py-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-900 px-2">
      <div className="flex flex-col items-center space-y-3">
        {profileData ? (
          <img src={profileData.githubUsername} alt="Avatar" className="rounded-full" width="150" height="150" />
        ) : (
          <Skeleton className="w-[150px] h-[150px] rounded-full" />
        )}
        <h1>{profileData?.name || <Skeleton className="h-6 w-24" />}</h1>
        <p>@{profileData?.username || <Skeleton className="h-4 w-20" />}</p>
      </div>
      {/* Other profile info */}
      {!isOwnProfile && (
        <button onClick={handleFriendRequest} className="bg-blue-500 text-white rounded py-2 px-4">
          {isFriend ? "Disconnect" : "Connect"}
        </button>
      )}
    </div>
  );
};

export default Sidebar;
