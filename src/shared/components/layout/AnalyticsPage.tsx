import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Project } from "./ProjectsPage";
import FirstProjectTutorial from "@/features/projects/components/FirstProjectTutorial";

export default function AnalyticsPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => invoke<Project[]>("get_projects"),
  });

  if (isLoading) return <div className="text-white">Loading...</div>;

  let userHasProjects = projects.length > 0;

  return (
    <div>
      <h1 className="text-white text-5xl font-bold">Analyze Projects</h1>
      <p className="text-blue-200 pt-3">
        See insides and statistics for your projects...
      </p>

      {!userHasProjects ? (
        <FirstProjectTutorial />
      ) : (
        <h2 className="text-white">Analytics coming soon...</h2>
      )}
    </div>
  );
}
