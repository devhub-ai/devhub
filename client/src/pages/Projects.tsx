import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsProps {
  projects: Project[];
  username: string;
}

const Projects = ({ projects, username }: ProjectsProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length ? (
          projects.map((project, index) => (
            <Card key={index} className="p-4 rounded-lg shadow transition-transform">
              <CardHeader className="mb-2">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-xs text-gray-500">@{username}</p>
              </CardHeader>
              <CardContent>{project.description}</CardContent>
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

export default Projects;
