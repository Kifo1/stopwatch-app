import { ProjectOverview } from "@/features/projects/components/ProjectOverview";
import FirstProjectTutorial from "@features/projects/components/FirstProjectTutorial";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  let userHasProjects = projects.length > 0;

  useEffect(() => {
    const syncProjects = async () => {
      let projectList = await invoke<Project[]>("get_projects");
      setProjects(projectList);
      userHasProjects = projects.length > 0;
    };

    syncProjects();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-white text-5xl font-bold">Manage Projects</h1>
        <p className="text-blue-200 pt-3">
          Organize and track your time across different projects.
        </p>
        {!userHasProjects && <FirstProjectTutorial />}
        {userHasProjects && <ProjectOverview projects={projects} />}
      </div>
    </div>
  );
}
