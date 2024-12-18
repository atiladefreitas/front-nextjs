import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  CalendarDays,
  FileText,
  Loader2,
  Camera,
} from "lucide-react";
import { useRouter } from "next/router";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    birthday: "",
    avatar_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });

  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("user")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const userData = {
          name: profile.name || "",
          email: user.email || "",
          phone: profile.phone || "",
          document: profile.document || "",
          birthday: profile.birthday || "",
          avatar_url: user.user_metadata.avatar_url || "",
        };

        setUserData(userData);
        setEditedData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpload = async (url: string) => {
    setEditedData((prev) => ({
      ...prev,
      avatar_url: url,
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: editedData.name,
          avatar_url: editedData.avatar_url,
        },
      });

      if (metadataError) throw metadataError;

      // Update user profile
      const { error: profileError } = await supabase
        .from("user")
        .update({
          name: editedData.name,
          phone: editedData.phone,
          document: editedData.document,
          birthday: editedData.birthday,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      setUserData(editedData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eee] ">
      <nav className="w-full bg-[#be1e2f] flex items-center justify-center min-h-[6rem] mb-6">
        <div className="w-full max-w-5xl flex items-center justify-between h-full">
          <Image
            src="/OBEMDITO.png"
            alt="Logomarca branca"
            width={200}
            height={100}
          />
        </div>
      </nav>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="text"
            className="flex items-center gap-2"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          {!isEditing ? (
            <Button color="blue" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="red"
                className="rounded-md"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(userData);
                }}
              >
                Cancelar
              </Button>
              <Button
                color="green"
                onClick={handleUpdate}
                disabled={updating}
                size="sm"
                className="flex items-center gap-2 rounded-md"
              >
                {updating && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          )}
        </div>

        <Card className="rounded-md">
          <CardBody className="p-6">
            <div className="mb-8">
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Perfil do Usuário
              </Typography>

              {isEditing ? (
                <div className="mb-6">
                  <Typography variant="small" className="mb-2">
                    Foto do Perfil
                  </Typography>
                  <ImageUpload
                    bucketName="avatars"
                    path={`users/${new Date().getTime()}`}
                    onUploadComplete={handleAvatarUpload}
                    maxSize={2}
                    aspectRatio={1}
                    maxWidth={1000}
                    maxHeight={1000}
                  />
                </div>
              ) : (
                userData.avatar_url && (
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                    <img
                      src={userData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>

            <div className="grid gap-4">
              <div className="flex gap-2">
                <Input
                  crossOrigin=""
                  label="Nome Completo"
                  name="name"
                  icon={<User className="h-5 w-5" />}
                  value={isEditing ? editedData.name : userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  crossOrigin=""
                  label="Data de Nascimento"
                  name="birthday"
                  type="date"
                  icon={<CalendarDays className="h-5 w-5" />}
                  value={isEditing ? editedData.birthday : userData.birthday}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Input
                  crossOrigin=""
                  label="Email"
                  name="email"
                  icon={<Mail className="h-5 w-5" />}
                  value={userData.email}
                  disabled
                />
              </div>

              <div className="flex gap-2">
                <Input
                  crossOrigin=""
                  label="Telefone"
                  name="phone"
                  icon={<Phone className="h-5 w-5" />}
                  value={isEditing ? editedData.phone : userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />

                <Input
                  crossOrigin=""
                  label="CPF"
                  name="document"
                  icon={<FileText className="h-5 w-5" />}
                  value={isEditing ? editedData.document : userData.document}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
