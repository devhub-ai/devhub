import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubStatsProps {
  githubUsername: string;
}

const GitHubStats = ({ githubUsername }: GitHubStatsProps) => {
  const [streakStat, setStreakStat] = useState<string | null>(null);

  useEffect(() => {
    if (githubUsername) {
      const fetchGithubStats = async () => {
        try {
          const response = await axios.post(`${backendUrl}/analyze/streak_stats`, { "github-id": githubUsername });
          setStreakStat(response.data);
        } catch (error) {
          console.error("Failed to fetch GitHub stats:", error);
        }
      };

      fetchGithubStats();
    }
  }, [githubUsername]);

  return (
    <div>
      <h2 className="text-xl font-bold">GitHub Streak Stats</h2>
      {streakStat ? <div dangerouslySetInnerHTML={{ __html: streakStat }} /> : <Skeleton className="h-48 w-full" />}
    </div>
  );
};

export default GitHubStats;
