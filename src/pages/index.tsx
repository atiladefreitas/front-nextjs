import { useSession } from "@supabase/auth-helpers-react";
import Login from "../components/Login";
import AdminLayout from "@/components/AdminLayout";
import LogoutButton from "@/components/logoutButton";
import EstablishmentLayout from "@/components/EstablishmentLayout";
import CustomerLayout from "@/components/CustomerLayout";

const Home = () => {
	const session = useSession();

	if (!session) {
		return <Login />;
	}

	const role = session.user.user_metadata.role;

	return (
		<section className="w-screen h-screen">
			{role === "customer" && <CustomerLayout children={<LogoutButton />} />}
			{role === "admin" && <AdminLayout children={<LogoutButton />} />}
			{role === "establishment" && (
				<EstablishmentLayout children={<LogoutButton />} />
			)}
		</section>
	);
};

export default Home;
