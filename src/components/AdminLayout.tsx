import React, { useState, useEffect } from "react";
import {
	Card,
	Navbar,
	Typography,
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Input,
} from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Establishment, User, FormData } from "../types";
import EstablishmentDialog from "../components/dialogs/EstablishmentDialog";
import formatString from "@/utils/FormatString";

interface IAdminLayoutProps {
	children: React.ReactNode;
}

function AdminLayout({ children }: IAdminLayoutProps) {
	const [open, setOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
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
	const handleInviteOpen = () => setInviteOpen(!inviteOpen);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleInviteEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInviteEmail(e.target.value);
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

	const handleInviteSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Here you would typically send an invitation email
			// For now, we'll just log the email and close the modal
			console.log("Invitation sent to:", inviteEmail);
			setInviteOpen(false);
			setInviteEmail("");
			alert("Invitation sent successfully!");
		} catch (error) {
			console.error("Error sending invitation:", error);
			alert("Failed to send invitation: " + error.message);
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
			<div className="w-full h-[3rem]  mb-4 max-w-7xl flex gap-4 items-center px-4">
				<EstablishmentDialog
					open={open}
					handleOpen={handleOpen}
					formData={formData}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					handlePostalCodeChange={handlePostalCodeChange}
				/>
				<Button onClick={handleInviteOpen} color="blue">
					Convidar usuário
				</Button>
			</div>
			<main className="w-full max-w-7xl grid grid-cols-2 gap-4 h-full">
				<Card className="establishments-list p-4">
					<Typography variant="h5" color="blue-gray" className="mb-4">
						Estabelecimentos
					</Typography>
					{establishments.map((establishment) => (
						<div key={establishment.id}>{establishment.name}</div>
					))}
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

			{/* Invitation Modal */}
			<Dialog open={inviteOpen} handler={handleInviteOpen} size="xs">
				<form onSubmit={handleInviteSubmit}>
					<DialogHeader>Convidar usuário</DialogHeader>
					<DialogBody>
						<Input
							crossOrigin={""}
							type="email"
							label="Email"
							value={inviteEmail}
							onChange={handleInviteEmailChange}
							required
						/>
					</DialogBody>
					<DialogFooter>
						<Button
							variant="text"
							color="red"
							onClick={handleInviteOpen}
							className="mr-1"
						>
							<span>Cancelar</span>
						</Button>
						<Button variant="gradient" color="green" type="submit">
							<span>Enviar convite</span>
						</Button>
					</DialogFooter>
				</form>
			</Dialog>
		</div>
	);
}

export default AdminLayout;
