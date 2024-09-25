import { Button } from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const LogoutButton = () => {
	const supabase = useSupabaseClient();

	return (
		<Button variant="text" size="sm" onClick={() => supabase.auth.signOut()}>
			Sair
		</Button>
	);
};

export default LogoutButton;
