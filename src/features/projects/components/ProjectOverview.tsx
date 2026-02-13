import Button from "@/shared/components/Button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectModal } from "./CreateProjectModal";
import { Project } from "@/shared/components/layout/ProjectsPage";
import { ProjectTable } from "./ProjectTable";

interface OverallInfoComponentProps {
  title: string;
  value: string;
}

function OverallInfoComponent({ title, value }: OverallInfoComponentProps) {
  return (
    <div className="flex flex-col">
      <span className="text-blue-200 font-semibold text-sm uppercase">
        {title}
      </span>
      <span className="text-white text-3xl font-bold">{value}</span>
    </div>
  );
}

interface ProjectOverviewProps {
  projects: Project[];
}

export function ProjectOverview({ projects }: ProjectOverviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            value="coming soon..."
          />
          <div className="w-px h-auto bg-slate-200/10"></div>
          <OverallInfoComponent title="Most active" value="coming soon..." />
          <Button
            onClick={() => setIsModalOpen(true)}
            className="font-medium rounded-md ml-auto"
          >
            <Plus />
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
