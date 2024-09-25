import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Mail, ArrowLeft } from "lucide-react";
import { Input } from "@material-tailwind/react";

const RecoverPassword = () => {
	const [email, setEmail] = useState("");
	const supabase = useSupabaseClient();
	const router = useRouter();

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});
			if (error) throw error;
			alert("Password reset email sent. Check your inbox.");
			router.push("/");
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	return (
		<div className="min-h-screen bg-obemdito-red flex flex-col justify-center py-12 px-4 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
					Recupere sua senha
				</h2>
				<p className="mt-2 text-center text-sm text-gray-200">
					Digite seu endereço de e-mail e nós lhe enviaremos um link para
					redefinir sua senha.
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow rounded-lg">
					<form className="space-y-6" onSubmit={handleResetPassword}>
						<div>
							<div className="mt-1 relative rounded-md shadow-sm">
								<Input
									crossOrigin={""}
									label="Email"
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									icon={<Mail className="h-5 w-5 text-gray-400" />}
									className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									placeholder="john@exemplo.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
							>
								Enviar link de recuperação
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

						<div className="mt-6">
							<button
								onClick={() => router.push("/")}
								className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Voltar para Login
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecoverPassword;
