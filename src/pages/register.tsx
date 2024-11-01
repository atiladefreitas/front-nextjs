import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import {
	Mail,
	Lock,
	User,
	Calendar,
	FileText,
	Phone,
	Check,
	X,
} from "lucide-react";
import { Input } from "@material-tailwind/react";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [birthday, setBirthday] = useState("");
	const [document, setDocument] = useState("");
	const [phone, setPhone] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(false);
	const supabase = useSupabaseClient();
	const router = useRouter();

	useEffect(() => {
		setPasswordsMatch(password === confirmPassword && password !== "");
	}, [password, confirmPassword]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!passwordsMatch) {
			alert("Senhas não coincidem");
			return;
		}

		try {
			// Step 1: Sign up the user
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						name,
						birthday,
						document,
						phone,
						role: "customer",
					},
				},
			});

			if (authError) throw authError;

			if (authData.user) {
				// Step 2: Insert user data into the users table
				const { error: insertError } = await supabase.from("user").insert({
					id: authData.user.id,
					role: "customer",
					name,
					birthday,
					document,
					email,
					phone,
				});

				if (insertError) throw insertError;

				alert("Registration successful!");
				router.push("/");
			} else {
				throw new Error("User creation failed");
			}
		} catch (error) {
			// @ts-ignore
			alert("Error: " + error.message);
		}
	};

	const PasswordMatchIndicator = () => {
		if (password === "" || confirmPassword === "") return null;
		return passwordsMatch ? (
			<Check className="h-5 w-5 text-green-500" />
		) : (
			<X className="h-5 w-5 text-red-500" />
		);
	};

	return (
		<div className="min-h-screen bg-obemdito-red flex flex-col justify-center py-12 px-4 lg:px-8 transition-all">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
					Cadastre-se
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full max-w-md">
				<div className="bg-white py-8 px-4 shadow-xl rounded-lg ">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									icon={<Mail className="h-5 w-5 text-gray-400" />}
									label="Email"
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									icon={<Lock className="h-5 w-5 text-gray-400" />}
									label="Senha"
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						<div className="transition-all">
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									icon={<PasswordMatchIndicator />}
									label="Confirmar Senha"
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
										confirmPassword &&
										(passwordsMatch ? "border-green-500" : "border-red-500")
									}`}
									placeholder="••••••••"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"></div>
							</div>
							{confirmPassword && !passwordsMatch && (
								<p className="mt-2 text-sm text-red-600">
									Senhas não coincidem
								</p>
							)}
						</div>

						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									icon={<User className="h-5 w-5 text-gray-400" />}
									label="Nome completo"
									id="name"
									name="name"
									type="text"
									autoComplete="name"
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									label="Data de nascimento"
									id="birthday"
									name="birthday"
									type="date"
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									value={birthday}
									onChange={(e) => setBirthday(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									icon={<FileText className="h-5 w-5 text-gray-400" />}
									label="CPF"
									id="document"
									name="document"
									type="text"
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="123.456.789-10"
									value={document}
									onChange={(e) => setDocument(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									icon={<Phone className="h-5 w-5 text-gray-400" />}
									label="Número"
									id="phone"
									name="phone"
									type="tel"
									autoComplete="tel"
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="(55) 9919-9989"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
							>
								Criar conta
							</button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Já possui uma conta?
								</span>
							</div>
						</div>

						<div className="mt-6">
							<button
								onClick={() => router.push("/")}
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								Login
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
