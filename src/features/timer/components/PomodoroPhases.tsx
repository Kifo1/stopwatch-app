interface Props {
  currentPhase: number;
}

export function PomodoroPhases({ currentPhase }: Props) {
  return (
    <>
      <div className="text-center mt-auto mb-15">
        <ul className="flex gap-2 justify-center">
          <li className="">
            <span
              className={`${currentPhase === 0 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
            ></span>
          </li>
          <li>
            <span
              className={`${currentPhase === 1 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
            ></span>{" "}
          </li>
          <li>
            <span
              className={`${currentPhase === 2 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
            ></span>{" "}
          </li>
          <li>
            <span
              className={`${currentPhase === 3 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
            ></span>{" "}
          </li>
        </ul>
        <span className="text-gray-500 font-semibold text-sm uppercase">
          {currentPhase === 0 || currentPhase === 2
            ? "Focus"
            : currentPhase === 1
              ? "Short Break"
              : "Long Break"}
        </span>
      </div>
    </>
  );
}
