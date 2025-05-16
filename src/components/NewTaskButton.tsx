import { useAdminMode } from "@/components/admin-mode-provider";

function NewTaskButton() {
  const { mode } = useAdminMode();
  if (mode === "OFF") return null;
  return <div>NewTaskButton</div>;
}

export default NewTaskButton;
