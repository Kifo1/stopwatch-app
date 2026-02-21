import Button from "@/shared/components/Button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectModal } from "./CreateProjectModal";
import { Project } from "@/shared/components/layout/ProjectsPage";
import { ProjectTable } from "./ProjectTable";
import { invoke } from "@tauri-apps/api/core";
import { useQuery } from "@tanstack/react-query";
import { formatSecondsToString } from "@/shared/lib/utils";

interface OverallInfoComponentProps {
  title: string;
  value: string;
}

function OverallInfoComponent({ title, value }: OverallInfoComponentProps) {
  return (
    <div className="flex flex-col">
      <span className="text-blue-200 font-semibold text-xs lg:text-sm uppercase">
        {title}
      </span>
      <span className="text-white text-2xl lg:text-3xl font-bold">{value}</span>
    </div>
  );
}

interface ProjectOverviewProps {
  projects: Project[];
}

export function ProjectOverview({ projects }: ProjectOverviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: todaysTotalSeconds, isLoading: isLoading } = useQuery({
    queryKey: ["todays_overall_time"],
    queryFn: () => invoke<number>("get_todays_overall_time"),
    refetchInterval: 10000,
  });

  const { data: mostActiveProjectName, isLoading: nameIsLoading } = useQuery({
    queryKey: ["most_active_project_name"],
    queryFn: () => invoke<string>("get_most_active_project_name"),
    refetchInterval: 10000,
  });

  return (
    <>
      <div className="flex flex-col gap-10 mt-15">
        <div className="flex gap-10 p-5 rounded-2xl border border-slate-200/10 bg-slate-200/5">
          <OverallInfoComponent
            title="Total projects"
            value={projects.length.toString()}
          />
          <div className="w-px h-auto bg-slate-200/10"></div>
          <OverallInfoComponent
            title="Time tracked today"
            value={
              isLoading
                ? "Loading..."
                : formatSecondsToString(todaysTotalSeconds || 0)
            }
          />
          <div className="w-px h-auto bg-slate-200/10"></div>
          <OverallInfoComponent
            title="Most active"
            value={nameIsLoading ? "Loading..." : mostActiveProjectName || ""}
          />
          <Button
            onClick={() => setIsModalOpen(true)}
            className="font-medium rounded-md ml-auto"
          >
            <Plus className="hidden lg:inline" />
            Add Project
          </Button>
        </div>
        <div>
          <ProjectTable projects={projects} />
        </div>
        {isModalOpen && (
          <CreateProjectModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </>
  );
}
