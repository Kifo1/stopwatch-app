import {
  ChartLine,
  FolderDot,
  LucideIcon,
  Settings,
  Timer,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavbarItemProps {
  name: string;
  Icon: LucideIcon;
  to: string;
}

function NavbarItem({ name, Icon, to }: NavbarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive
            ? "border-blue-500 text-blue-500 bg-blue-500/10"
            : "border-transparent text-blue-200 hover:bg-gray-700 hover:text-white"
        } flex border items-center gap-3 px-3 py-2.5 rounded-lg transition-colors`
      }
    >
      <span className="material-symbols-outlined group-hover:text-primary transition-colors">
        <Icon />
      </span>
      <span className="text-sm font-medium">{name}</span>
    </NavLink>
  );
}

export default function Sidebar() {
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
          <NavbarItem name="Timer" Icon={Timer} to="/timer"></NavbarItem>
          <NavbarItem
            name="Projects"
            Icon={FolderDot}
            to="/projects"
          ></NavbarItem>
          <NavbarItem
            name="Analytics"
            Icon={ChartLine}
            to="/analytics"
          ></NavbarItem>
          <NavbarItem
            name="Settings"
            Icon={Settings}
            to="/settings"
          ></NavbarItem>
        </nav>
      </div>
    </aside>
  );
}
