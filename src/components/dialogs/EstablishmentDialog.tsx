import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Loader2 } from "lucide-react";
import { FormData } from "../../types";
import { useCopyToClipboard } from "usehooks-ts";
import { Copy, Check } from "lucide-react";

interface EstablishmentDialogProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePostalCodeChange: (value: string) => void;
  isSuccess: boolean;
  establishmentPassword: string;
}

const EstablishmentDialog: React.FC<EstablishmentDialogProps> = ({
  open,
  handleOpen,
  handleClose,
  formData,
  handleInputChange,
  handleSubmit,
  handlePostalCodeChange,
  isSuccess,
  establishmentPassword,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [value, copy] = useCopyToClipboard();
  const [copied, setCopied] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSubmit(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        placeholder=""
        onClick={handleOpen}
        color="green"
        className="rounded-md"
      >
        Novo estabelecimento
      </Button>

      <Dialog
        size="xs"
        open={open}
        handler={handleClose}
        className="max-w-[32rem]"
      >
        <Card className="mx-auto w-full max-w-[30rem]" shadow={false}>
          {!isSuccess ? (
            <>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="blue-gray">
                  Adicionar novo estabelecimento
                </Typography>
                <form onSubmit={onSubmit} className="gap-4 flex flex-col gap-2">
                  <Input
                    crossOrigin={""}
                    label="Nome"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <Input
                    crossOrigin={""}
                    label="CNPJ"
                    name="document"
                    value={formData.document}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <Input
                    crossOrigin={""}
                    label="Telefone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <Input
                    crossOrigin={""}
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <Input
                    crossOrigin={""}
                    label="CEP"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handlePostalCodeChange(e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="flex gap-2">
                    <Input
                      crossOrigin={""}
                      label="Cidade"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Input
                      crossOrigin={""}
                      label="Estado"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      crossOrigin={""}
                      label="Bairro"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Input
                      crossOrigin={""}
                      label="Rua"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      crossOrigin={""}
                      label="Numero"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Input
                      crossOrigin={""}
                      label="Complemento"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    color="green"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 transition-all"
                  >
                    Salvar
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                  </Button>
                </form>
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  fullWidth
                  color="red"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4">
                Estabelecimento criado com sucesso
              </Typography>
              <div className="w-full">
                <Typography variant="lead">
                  Por favor solicite que o estabelecimento confirme o email
                </Typography>
                <div className="bg-orange-50 p-4 flex flex-col items-center mt-4 justify-center rounded-md border border-orange-800">
                  <Typography className="mb-2 font-bold text-orange-800">
                    Aqui está a senha de acesso do estabelecimento, ele poderá
                    realizar a troca após o primeiro login.
                  </Typography>
                  <Button
                    onMouseLeave={() => setCopied(false)}
                    onClick={() => {
                      copy("npm i @material-tailwind/react");
                      setCopied(true);
                    }}
                    color="green"
                    className="flex items-center gap-x-3 px-4 py-2.5 lowercase"
                  >
                    <Typography
                      className="border-r border-gray-400/50 pr-3 font-normal"
                      variant="small"
                    >
                      {establishmentPassword}
                    </Typography>
                    {copied ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>
              <Button onClick={handleClose} color="blue">
                Fechar
              </Button>
            </CardBody>
          )}
        </Card>
      </Dialog>
    </>
  );
};

export default EstablishmentDialog;
