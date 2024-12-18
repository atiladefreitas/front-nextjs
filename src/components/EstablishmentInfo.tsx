import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  IdCard,
  MapPinned,
  Building,
  Home,
} from "lucide-react";

interface Establishment {
  name: string;
  document: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  created_at: string;
}

interface EstablishmentInfoProps {
  selectedEstablishment: Establishment;
  formatDate: (date: string) => string;
}

interface AddressDetail {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const EstablishmentInfo: React.FC<EstablishmentInfoProps> = ({
  selectedEstablishment,
  formatDate,
}) => {
  const addressDetails: AddressDetail[] = [
    {
      label: "Endereço",
      value: `${selectedEstablishment.street}, ${selectedEstablishment.number}`,
      icon: <Home className="h-5 w-5" />,
    },
    ...(selectedEstablishment.complement
      ? [
          {
            label: "Complemento",
            value: selectedEstablishment.complement,
            icon: <Building className="h-5 w-5" />,
          },
        ]
      : []),
    {
      label: "Bairro",
      value: selectedEstablishment.neighborhood,
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: "Cidade/Estado",
      value: `${selectedEstablishment.city} - ${selectedEstablishment.state}`,
      icon: <MapPinned className="h-5 w-5" />,
    },
    {
      label: "CEP",
      value: selectedEstablishment.postal_code,
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  return (
    <Card className="w-full shadow-none bg-white">
      <CardBody className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 border-b border-blue-gray-50 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="p-3 rounded-lg bg-blue-gray-50/50 w-fit">
              <Building2 className="h-6 w-6 text-blue-gray-800" />
            </div>
            <div className="flex-1 min-w-0">
              <Typography
                variant="h4"
                className="text-blue-gray-900 font-medium text-xl sm:text-2xl break-words"
              >
                {selectedEstablishment.name}
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <IdCard className="h-4 w-4 text-blue-gray-500 flex-shrink-0" />
                <Typography className="text-blue-gray-500 text-sm sm:text-base break-words">
                  {selectedEstablishment.document}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 rounded-lg bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-sm sm:text-base"
              >
                Email
              </Typography>
            </div>
            <Typography className="text-blue-600 font-medium ml-8 break-words text-sm sm:text-base">
              {selectedEstablishment.email}
            </Typography>
          </div>

          <div className="p-3 sm:p-4 rounded-lg bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-sm sm:text-base"
              >
                Telefone
              </Typography>
            </div>
            <Typography className="text-blue-gray-800 font-medium ml-8 break-words text-sm sm:text-base">
              {selectedEstablishment.phone}
            </Typography>
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MapPin className="h-5 w-5 text-blue-gray-800 flex-shrink-0" />
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-sm sm:text-base"
            >
              Informações de Endereço
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-50/50 p-3 sm:p-4 rounded-lg">
            {addressDetails.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">{detail.icon}</div>
                <div className="min-w-0 flex-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium mb-1 text-sm"
                  >
                    {detail.label}
                  </Typography>
                  <Typography className="text-blue-gray-800 break-words text-sm sm:text-base">
                    {detail.value}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creation Date */}
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-gray-50/30 rounded-lg mt-4 sm:mt-6">
          <Clock className="h-5 w-5 text-blue-gray-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <Typography
              variant="small"
              className="font-medium text-blue-gray-700 text-sm sm:text-base"
            >
              Data de Criação
            </Typography>
            <Typography className="text-blue-gray-800 break-words text-sm sm:text-base">
              {formatDate(selectedEstablishment.created_at)}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EstablishmentInfo;
