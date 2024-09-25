import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
	const [supabase] = useState(() => createBrowserSupabaseClient());

	return (
		<ThemeProvider>
			<SessionContextProvider
				supabaseClient={supabase}
				initialSession={pageProps.initialSession}
			>
				<Component {...pageProps} />
			</SessionContextProvider>
		</ThemeProvider>
	);
}
