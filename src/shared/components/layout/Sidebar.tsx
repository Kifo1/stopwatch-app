import {
  ChartLine,
  FolderDot,
  LucideIcon,
  Settings,
  Timer,
} from "lucide-react";
import { useState } from "react";

function NavbarItem({
  name,
  Icon,
  active,
  onClick,
}: {
  name: string;
  Icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      className={`${active ? "border-blue-500 text-blue-500 bg-blue-500/10" : "border-transparent hover:bg-gray-700 hover:text-white hover:border-transparent"} flex border items-center gap-3 px-3 py-2.5 rounded-lg text-blue-200 transition-colors`}
      href="#"
      onClick={onClick}
    >
      <span className="material-symbols-outlined group-hover:text-primary transition-colors">
        <Icon />
      </span>
      <span className="text-sm font-medium">{name}</span>
    </a>
  );
}

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Timer");

  return (
    <aside className="w-64 border-r flex border-blue-300 flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        <div className="px-2">
          <h1 className="text-white text-xl font-bold tracking-tight">
            Stopwatch App
          </h1>
          <p className="text-blue-200 text-xs font-normal">Track your time</p>
        </div>
        <nav className="flex flex-col gap-2">
          <NavbarItem
            name="Timer"
            Icon={Timer}
            active={activeItem === "Timer"}
            onClick={() => setActiveItem("Timer")}
          ></NavbarItem>
          <NavbarItem
            name="Projects"
            Icon={FolderDot}
            active={activeItem === "Projects"}
            onClick={() => setActiveItem("Projects")}
          ></NavbarItem>
          <NavbarItem
            name="Analysis"
            Icon={ChartLine}
            active={activeItem === "Analysis"}
            onClick={() => setActiveItem("Analysis")}
          ></NavbarItem>
          <NavbarItem
            name="Settings"
            Icon={Settings}
            active={activeItem === "Settings"}
            onClick={() => setActiveItem("Settings")}
          ></NavbarItem>
        </nav>
      </div>
    </aside>
  );
}
