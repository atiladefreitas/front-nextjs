import React, { useState, useEffect } from "react";
import { Card, Navbar, Typography } from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Establishment, User, FormData } from "../types";
import EstablishmentDialog from "../components/dialogs/EstablishmentDialog";
import formatString from "@/utils/FormatString";

interface IAdminLayoutProps {
	children: React.ReactNode;
}

function AdminLayout({ children }: IAdminLayoutProps) {
	const [open, setOpen] = useState(false);
	const [establishments, setEstablishments] = useState<Establishment[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		document: "",
		phone: "",
		email: "",
		role: "establishment",
		postal_code: "",
		city: "",
		state: "",
		neighborhood: "",
		street: "",
		number: "",
		complement: "",
	});
	const supabase = useSupabaseClient();

	const handleOpen = () => setOpen(!open);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email: formData.email,
				password: formatString(formData.name),
				options: {
					data: {
						name: formData.name,
						phone: formData.phone,
						document: formData.document,
						role: formData.role,
						password: formatString(formData.name),
					},
				},
			});

			if (authError) throw authError;

			if (!authData.user) throw new Error("User creation failed");

			// Step 2: Insert establishment data
			const { data: establishmentData, error: establishmentError } =
				await supabase
					.from("establishment")
					.insert([
						{
							...formData,
							user_id: authData.user.id, // Link the establishment to the created user
						},
					])
					.select();

			if (establishmentError) throw establishmentError;

			setEstablishments([...establishments, establishmentData[0]]);
			setOpen(false);
			setFormData({
				name: "",
				document: "",
				phone: "",
				email: "",
				role: "establishment",
				postal_code: "",
				city: "",
				state: "",
				neighborhood: "",
				street: "",
				number: "",
				complement: "",
			});

			alert("Establishment created successfully!");
		} catch (error) {
			console.error("Error creating establishment:", error);
			alert("Failed to add establishment: " + error.message);
		}
	};

	useEffect(() => {
		const fetchEstablishments = async () => {
			const { data, error } = await supabase.from("establishment").select("*");

			if (error) {
				console.error("Error fetching establishments:", error);
			} else {
				console.log("Establishments:", data);
				setEstablishments(data);
			}
		};

		const fetchUsers = async () => {
			const { data, error } = await supabase.from("user").select("*");

			if (error) {
				console.error("Error fetching users:", error);
			} else {
				console.log("Users:", data);
				setUsers(data);
			}
		};

		fetchEstablishments();
		fetchUsers();
	}, [supabase]);

	const fetchAddress = async (cep: string) => {
		try {
			const response = await fetch(
				`https://brasilapi.com.br/api/cep/v1/${cep}`,
			);
			if (response.ok) {
				const data = await response.json();
				setFormData((prevData) => ({
					...prevData,
					city: data.city,
					state: data.state,
					street: data.street,
					neighborhood: data.neighborhood,
				}));
			} else {
				console.error("Error fetching address data");
			}
		} catch (error) {
			console.error("Error fetching address data:", error);
		}
	};

	const handlePostalCodeChange = (value: string) => {
		setFormData((prevData) => ({ ...prevData, postal_code: value }));
		if (value.length === 8) {
			fetchAddress(value);
		}
	};

	return (
		<div className="admin-layout bg-[#eee] w-screen h-screen flex flex-col py-8 items-center ">
			<Navbar className="max-w-7xl mb-4">{children}</Navbar>
			<main className="w-full max-w-7xl grid grid-cols-2 gap-4 h-full">
				<Card className="establishments-list p-4">
					<Typography variant="h5" color="blue-gray" className="mb-4">
						Estabelecimentos
					</Typography>
					{establishments.map((establishment) => (
						<div key={establishment.id}>{establishment.name}</div>
					))}
					<EstablishmentDialog
						open={open}
						handleOpen={handleOpen}
						formData={formData}
						handleInputChange={handleInputChange}
						handleSubmit={handleSubmit}
						handlePostalCodeChange={handlePostalCodeChange}
					/>
				</Card>

				<Card className="users-list p-4">
					<Typography variant="h5" color="blue-gray" className="mb-4">
						Usuários
					</Typography>
					{users.map((user) => (
						<div key={user.id}>{user.name}</div>
					))}
				</Card>
			</main>
		</div>
	);
}

export default AdminLayout;
