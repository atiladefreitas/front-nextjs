import { useSession } from "@supabase/auth-helpers-react";
import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import AdminLayout from "@/components/AdminLayout";
import LogoutButton from "@/components/logoutButton";
import EstablishmentLayout from "@/components/EstablishmentLayout";
import CustomerLayout from "@/components/CustomerLayout";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => (
  <div className="flex items-center justify-center w-screen h-screen">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const session = useSession(); // Moved to top level

  useEffect(() => {
    // Handle loading state with useEffect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Login />;
  }

  const role = session.user.user_metadata.role;

  return (
    <section className="w-screen h-screen bg-red-100">
      {role === "customer" && (
        <CustomerLayout>
          <LogoutButton />
        </CustomerLayout>
      )}
      {role === "admin" && (
        <AdminLayout>
          <LogoutButton />
        </AdminLayout>
      )}
      {role === "establishment" && (
        <EstablishmentLayout>
          <LogoutButton />
        </EstablishmentLayout>
      )}
    </section>
  );
};

export default Home;
