import FirstProjectTutorial from "@/features/projects-introduction/components/FirstProjectTutorial";

export default function ProjectsPage() {
  const userHasProjects = false;

  return (
    <div>
      <div>
        <h1 className="text-white text-5xl font-bold">Manage Projects</h1>
        <p className="text-blue-200 pt-3">
          Organize and track your time across different projects.
        </p>
        {!userHasProjects && <FirstProjectTutorial />}
      </div>
    </div>
  );
}
