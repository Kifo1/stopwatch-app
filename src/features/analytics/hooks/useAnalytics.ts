import { Project } from '@features/projects/ProjectsPage.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export function useAnalytics() {
  const queryClient = useQueryClient();

  const { data: selectedProjects = [] } = useQuery<Project[]>({
    queryKey: ['localSelectedProjects'],
    queryFn: async () => {
      return await invoke<Project[]>('get_selected_projects');
    },
    staleTime: Infinity,
  });

  const setSelectedProjects = (nextProjects: Project[]) => {
    queryClient.setQueryData(['localSelectedProjects'], nextProjects);
  };

  return { selectedProjects, setSelectedProjects };
}
