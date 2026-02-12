import Button from "@/shared/components/Button";
import { TextInput } from "@/shared/components/TextInput";
import Modal from "@shared/components/Modal";
import { useState } from "react";

interface CreateProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
}

export function CreateProjectModal({
  isModalOpen,
  setIsModalOpen,
}: CreateProjectModalProps) {
  const [_projectName, setProjectName] = useState("");
  const [_projectDescription, setProjectDescription] = useState("");
  const [_projectColor, setProjectColor] = useState("#3B82F6");

  return (
    <Modal
      variant={"default"}
      scale={"md"}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      className=""
    >
      <form>
        <fieldset className="flex flex-col items-center gap-5">
          <legend className="text-white text-4xl font-semibold pb-10">
            Create Project
          </legend>
          <p className="grid grid-cols-3 gap-10 text-left justify-between w-full">
            <label htmlFor="name" className="text-white text-xl col-span-1">
              Name
            </label>
            <TextInput
              className="col-span-2"
              type="text"
              name="name"
              id="name"
              placeholder="name"
              required
              minLength={3}
              maxLength={20}
              onChange={(e) => setProjectName(e.target.value)}
            ></TextInput>
          </p>
          <p className="grid grid-cols-3 gap-10 text-left justify-between w-full">
            <label
              htmlFor="description"
              className="text-white text-xl col-span-1"
            >
              Description
            </label>{" "}
            <TextInput
              className="col-span-2"
              type="text"
              name="description"
              id="description"
              placeholder="description"
              required
              minLength={10}
              maxLength={70}
              onChange={(e) => setProjectDescription(e.target.value)}
            ></TextInput>
          </p>
          <p className="grid grid-cols-3 gap-10 text-left justify-between w-full">
            <label htmlFor="color" className="text-white text-xl col-span-1">
              Color
            </label>
            <input
              className="w-full h-full col-span-2"
              type="color"
              name="color"
              id="color"
              defaultValue="#3B82F6"
              required
              onChange={(e) => setProjectColor(e.target.value)}
            ></input>
          </p>
          <Button type="submit">Create Project</Button>
        </fieldset>
      </form>
    </Modal>
  );
}
