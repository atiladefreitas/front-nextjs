import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@material-tailwind/react";
import Image from "next/image";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const supabase = useSupabaseClient();
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			if (data && data.user) {
				const userMetadata = data.user.user_metadata;
				localStorage.setItem("userMetadata", JSON.stringify(userMetadata));

				localStorage.setItem("userId", data.user.id);
				// @ts-ignore
				localStorage.setItem("userEmail", data.user.email);
			}
		} catch (error) {
			// @ts-ignore
			alert("Error: " + error.message);
		}
	};

	return (
		<div className="min-h-screen px-4 bg-obemdito-red flex flex-col justify-center py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md flex items-center justify-center">
				<Image src="/OBEMDITO.png" width={300} height={100} alt="logo" />
			</div>
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleLogin}>
						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin="anonymous"
									id="email"
									name="email"
									label="E-mail"
									type="email"
									autoComplete="email"
									icon={<Mail className="h-5 w-5 text-gray-400" />}
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md "
									placeholder="john@exemplo.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin="anonymous"
									id="password"
									name="password"
									type="password"
									label="Senha"
									autoComplete="current-password"
									icon={<Lock className="h-5 w-5 text-gray-400" />}
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Acessar
								<ArrowRight className="ml-2 h-5 w-5" />
							</button>
						</div>
					</form>
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">OU</span>
							</div>
						</div>
						<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
							<button
								onClick={() => router.push("/register")}
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								Registrar
							</button>
							<button
								onClick={() => router.push("/recover-password")}
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								Esqueceu a senha?
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
