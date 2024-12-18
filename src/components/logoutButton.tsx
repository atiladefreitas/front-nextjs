import { Button } from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LogOut } from "lucide-react";

interface ILogoutButton {
  color?: "white" | "red";
}

const LogoutButton = ({ color = "white" }: ILogoutButton) => {
  const supabase = useSupabaseClient();

  return (
    <Button
      color={color}
      variant="text"
      size="sm"
      onClick={() => supabase.auth.signOut()}
      className="flex items-center gap-2"
    >
      Sair
      <LogOut size="18" />
    </Button>
  );
};

export default LogoutButton;
