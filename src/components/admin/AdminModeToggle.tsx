import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useAdminMode } from "../providers/AdminModeProvider";

function AdminModeToggle() {
  const { mode, setMode } = useAdminMode();
  return (
    <div className="flex gap-2 place-items-center">
      Admin Mode:
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(val) => {
          if (val === "") setMode(mode);
          else if (val === "ON") setMode("ON");
          else if (val === "OFF") setMode("OFF");
        }}
      >
        <ToggleGroupItem value="ON" variant={"outline"}>
          On
        </ToggleGroupItem>
        <ToggleGroupItem value="OFF" variant={"outline"}>
          Off
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default AdminModeToggle;
