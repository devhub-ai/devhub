import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FaExternalLinkAlt, FaStar, FaCodeBranch } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

interface PinnedRepositoriesProps {
  githubUsername: string;
}

const PinnedRepositories = ({ githubUsername }: PinnedRepositoriesProps) => {
  const [pinnedRepos, setPinnedRepos] = useState<Project[]>([]);

  useEffect(() => {
    if (githubUsername) {
      const fetchPinnedRepos = async () => {
        try {
          const response = await axios.post(`${backendUrl}/analyze/pinned_repos`, { "github-id": githubUsername });
          setPinnedRepos(response.data);
        } catch (error) {
          console.error("Failed to fetch pinned repos:", error);
        }
      };

      fetchPinnedRepos();
    }
  }, [githubUsername]);

  return (
    <div>
      <h2 className="text-xl font-bold">Pinned Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pinnedRepos.length ? (
          pinnedRepos.map((repo, index) => (
            <Card key={index} className="p-4 rounded-lg shadow transition-transform">
              <CardHeader className="mb-2">
                <h3 className="font-semibold">
                  <a href={repo.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {repo.title} <FaExternalLinkAlt className="inline-block ml-1" />
                  </a>
                </h3>
              </CardHeader>
              <CardContent>
                <p>{repo.description}</p>
                <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FaStar className="mr-1" /> {repo.stars}
                  </span>
                  <span className="flex items-center">
                    <FaCodeBranch className="mr-1" /> {repo.forks}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        )}
      </div>
    </div>
  );
};

export default PinnedRepositories;
