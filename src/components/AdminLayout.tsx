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
import { formatDate } from "@/utils/FormatDate";

import Image from "next/image";
import EstablishmentInfo from "./EstablishmentInfo";
import CouponList from "./CouponList";
import LogoutButton from "./logoutButton";

interface IAdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: IAdminLayoutProps) {
  const [open, setOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [establishmentInfoOpen, setEstablishmentInfoOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
  const [couponTemplates, setCouponTemplates] = useState<any[]>([]);
  const [isEstablishmentSuccess, setIsEstablishmentSuccess] = useState(false);
  const supabase = useSupabaseClient();

  const [password, setPassword] = useState("");

  const handleOpen = () => setOpen(!open);
  const handleInviteOpen = () => setInviteOpen(!inviteOpen);
  const handleEstablishmentInfoOpen = () =>
    setEstablishmentInfoOpen(!establishmentInfoOpen);
  const handleUserInfoOpen = () => setUserInfoOpen(!userInfoOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInviteEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
  };

  const handleEstablishmentClick = async (establishment: Establishment) => {
    console.log(establishment);
    setSelectedEstablishment(establishment);
    await fetchCouponTemplates(establishment.user_id);
    setEstablishmentInfoOpen(true);
  };

  const fetchCouponTemplates = async (establishmentId: string) => {
    try {
      const { data, error } = await supabase
        .from("couponTemplate")
        .select("*")
        .eq("establishmentId", establishmentId);

      if (error) throw error;
      setCouponTemplates(data || []);
    } catch (error) {
      console.error("Error fetching coupon templates:", error);
      // @ts-ignore
      alert("Failed to fetch coupon templates: " + error.message);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setUserInfoOpen(true);
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

      const { data: establishmentData, error: establishmentError } =
        await supabase
          .from("establishment")
          .insert([
            {
              ...formData,
              user_id: authData.user.id,
            },
          ])
          .select();

      if (establishmentError) throw establishmentError;

      setEstablishments([...establishments, establishmentData[0]]);
      setIsEstablishmentSuccess(true);
    } catch (error) {
      console.error("Error creating establishment:", error);
      // @ts-ignore
      alert("Failed to add establishment: " + error.message);
    }
  };

  const handleEstablishmentDialogOpen = () => setOpen(true);
  const handleEstablishmentDialogClose = () => {
    setOpen(false);
    setIsEstablishmentSuccess(false);
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
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Invitation sent to:", inviteEmail);
      setInviteOpen(false);
      setInviteEmail("");
      alert("Invitation sent successfully!");
    } catch (error) {
      console.error("Error sending invitation:", error);
      // @ts-ignore
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
    <div className="admin-layout bg-[#eee] w-screen h-screen flex flex-col pb-8 pt-2 items-center ">
      <Navbar className="max-w-7xl mb-4 flex items-center justify-between rounded-md ">
        <Image
          src="/LOGO_VERMELHA.png"
          alt="Logomarca vermelha"
          width={150}
          height={100}
        />
        <LogoutButton color="red" />
      </Navbar>

      <div className="w-full h-[3rem]  mb-4 max-w-7xl flex gap-4 items-center">
        <EstablishmentDialog
          open={open}
          handleOpen={handleEstablishmentDialogOpen}
          handleClose={handleEstablishmentDialogClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handlePostalCodeChange={handlePostalCodeChange}
          isSuccess={isEstablishmentSuccess}
          establishmentPassword={formatString(formData.name)}
        />
        <Button onClick={handleInviteOpen} color="blue" className="rounded-md">
          Convidar usuário
        </Button>
      </div>
      <main className="w-full max-w-7xl grid grid-cols-2 gap-4 h-full">
        <Card className="establishments-list p-4 rounded-md">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Estabelecimentos
          </Typography>
          {establishments.map((establishment) => (
            <div
              key={establishment.id}
              className="p-4 border rounded-md mb-2 cursor-pointer hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleEstablishmentClick(establishment)}
            >
              <Typography variant="h5">{establishment.name}</Typography>
              <span className="w-full flex items-center gap-2">
                <Typography variant="paragraph">
                  {establishment.document}
                </Typography>
                <Typography variant="paragraph">
                  Desde {formatDate(establishment.created_at)}
                </Typography>
              </span>
            </div>
          ))}
        </Card>

        <Card className="users-list p-4 rounded-md">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Usuários
          </Typography>
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-md mb-2 cursor-pointer hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleUserClick(user)}
            >
              <Typography variant="h5">{user.name}</Typography>
              <span className="w-full flex items-center gap-2">
                <Typography variant="paragraph">{user.email}</Typography>
                <Typography variant="paragraph">
                  Desde {formatDate(user.created_at)}
                </Typography>
              </span>
            </div>
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

      {/* Establishment Info Modal */}
      <Dialog
        open={establishmentInfoOpen}
        handler={handleEstablishmentInfoOpen}
        size="lg"
      >
        <DialogHeader>Informações do Estabelecimento</DialogHeader>
        <DialogBody className="">
          {selectedEstablishment && (
            <div className="grid grid-cols-2">
              <EstablishmentInfo
                selectedEstablishment={selectedEstablishment}
                formatDate={formatDate}
              />

              <CouponList
                couponTemplates={couponTemplates}
                formatDate={formatDate}
              />
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleEstablishmentInfoOpen}
          >
            <span>Fechar</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* User Info Modal */}
      <Dialog open={userInfoOpen} handler={handleUserInfoOpen} size="lg">
        <DialogHeader>Informações do Usuário</DialogHeader>
        <DialogBody>
          {selectedUser && (
            <div className="space-y-4">
              <Typography variant="h4">{selectedUser.name}</Typography>
              <Typography variant="paragraph">
                Email: {selectedUser.email}
              </Typography>
              <Typography variant="paragraph">
                Telefone: {selectedUser.phone}
              </Typography>
              <Typography variant="paragraph">
                Documento: {selectedUser.document}
              </Typography>
              <Typography variant="paragraph">
                Função: {selectedUser.role}
              </Typography>
              <Typography variant="paragraph">
                Criado em: {formatDate(selectedUser.created_at)}
              </Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="blue" onClick={handleUserInfoOpen}>
            <span>Fechar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AdminLayout;
