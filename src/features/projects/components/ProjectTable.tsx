import Button from "@/shared/components/Button";
import { Project } from "@/shared/components/layout/ProjectsPage";
import { formatSecondsToString } from "@/shared/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Clock3, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface ProjectTableEntryProps {
  project: Project;
}

function ProjectTableEntry({ project }: ProjectTableEntryProps) {
  const queryClient = useQueryClient();

  const { data: totalSeconds, isLoading: isLoading } = useQuery({
    queryKey: ["overall_project_time", project.id],
    queryFn: () =>
      invoke<number>("get_overall_project_time", { projectId: project.id }),
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return invoke("delete_project", { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(project.id);
  };

  return (
    <tr className="group">
      <td className="grid- px-2 pt-6 pb-6  py-2 md:px-6 md:py-5 whitespace-nowrap">
        <div className="flex items-center gap-2 md:gap-3">
          <div
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: project.color }}
          ></div>
          <div>
            <p className="text-sm font-semibold text-white">{project.name}</p>
            <p className="text-xs text-blue-200">{project.description}</p>
          </div>
        </div>
      </td>
      <td className="px-2 pt-6 pb-6  py-2 md:px-6 md:py-5 whitespace-nowrap">
        <div
          className="w-6 md:w-15 h-6 rounded-full"
          style={{ backgroundColor: project.color }}
        ></div>
      </td>
      <td className="px-2 pt-6 pb-6  py-2 md:px-6 md:py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Clock3 color="white"></Clock3>
          <span className="text-sm font-medium text-blue-200">
            {isLoading ? (
              <span className="animate-pulse opacity-50">Loading...</span>
            ) : (
              formatSecondsToString(totalSeconds || 0)
            )}
          </span>
        </div>
      </td>
      <td className="px-2 pt-6 pb-6  py-2 md:px-6 md:py-5 whitespace-nowrap">
        <div className="flex items-center justify-end gap-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="hover:cursor-pointer rounded-lg text-blue-200 hover:text-white"></Pencil>
          <Trash2
            className={`text-blue-200 hover:cursor-pointer hover:text-red-700 ${deleteMutation.isPending ? "opacity-50" : ""}`}
            onClick={handleDelete}
          />
        </div>
      </td>
    </tr>
  );
}

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const [page, _setPage] = useState(1);
  return (
    <div className="rounded-xl border border-slate-200/10 overflow-hidden bg-slate-200/5">
      <div>
        <table>
          <thead>
            <tr className="border-b border-slate-200/10 bg-slate-200/5">
              <th className="px-2 pt-6 pb-6 py-2 md:px-6 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-200 w-1/3">
                Project name
              </th>
              <th className="px-2 pt-6 pb-6 py-2 md:px-6 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-200 w-1/3">
                Color tag
              </th>
              <th className="px-2 pt-6 pb-6 py-2 md:px-6 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-200 w-1/3">
                Total time
              </th>
              <th className="px-2 pt-6 pb-6 py-2 md:px-6 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-200 w-1/3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectTableEntry key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-200/5 border-slate-200/10 overflow-hidden">
        <div className="text-sm text-blue-200">
          <span>Showing </span>
          <span className="font-medium text-white">{projects.length}</span>
          <span> of </span>
          <span className="font-medium text-white">{projects.length}</span>
          <span> projects</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={page === 1 ? "ghost" : "secondary"}
            className="border border-white/20 rounded-xl"
          >
            Previous
          </Button>
          <Button
            variant={"secondary"}
            className="border border-white/20 rounded-xl"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
