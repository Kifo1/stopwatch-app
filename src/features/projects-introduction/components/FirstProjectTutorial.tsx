import Button from "@/shared/components/Button";
import { ChartLine, CirclePlus, LucideIcon, Plus, Timer } from "lucide-react";

interface TutorialStepProps {
  position: number;
  title: string;
  description: string;
  Icon: LucideIcon;
  highlighted: boolean;
}

function TutorialStep({
  position,
  title,
  description,
  Icon,
  highlighted,
}: TutorialStepProps) {
  return (
    <div className="bg-slate-800 p-6 border rounded-2xl border-slate-700">
      <div className="flex">
        <div
          className={`${highlighted ? "text-blue-500 bg-blue-500/10" : "text-white bg-slate-700"} mt-2 p-4 rounded-2xl`}
        >
          <Icon></Icon>
        </div>
        <span className="text-slate-700 font-bold ml-auto text-6xl opacity-50 hover:opacity-80">
          {position}
        </span>
      </div>
      <div className="flex flex-col pt-5 gap-3">
        <h3 className="text-white text-2xl font-semibold">{title}</h3>
        <p className="text-blue-200 opacity-70 font-light">{description}</p>
        {highlighted && (
          <Button className="font-medium rounded-md">
            <Plus />
            Add Project
          </Button>
        )}
      </div>
    </div>
  );
}

export default function FirstProjectTutorial() {
  return (
    <>
      <div className="text-center justify-center mt-30">
        <h2 className="text-white text-4xl font-semibold">No projects found</h2>
        <p className="text-blue-200 max-w-150 ml-auto mr-auto">
          Get started with FocusFlow in three simple steps. Create your first
          project to begin tracking your productivity journey.
        </p>
      </div>
      <div className="grid pt-15 pl-15 pr-15 grid-cols-3 gap-10">
        <TutorialStep
          position={1}
          title="Create a Project"
          description="Set up a new workspace for your tasks and give it a name."
          Icon={CirclePlus}
          highlighted={true}
        />
        <TutorialStep
          position={2}
          title="Start the Timer"
          description="Select your project and hit play. Use Pomodoro intervals to stay focused."
          Icon={Timer}
          highlighted={false}
        />
        <TutorialStep
          position={3}
          title="View Progress"
          description="See detailed analytics of your time spent and improve your workflow."
          Icon={ChartLine}
          highlighted={false}
        />
      </div>
    </>
  );
}
