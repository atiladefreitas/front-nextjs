import React from "react";
import { Typography, Card, CardBody, Chip } from "@material-tailwind/react";
import {
  Tag,
  Calendar,
  Package,
  Percent,
  DollarSign,
  Ticket,
} from "lucide-react";

interface CouponTemplate {
  id: string;
  title: string;
  description: string;
  type: "value" | "percentage";
  value: number;
  amount: number;
  expirationDate: string;
}

interface CouponListProps {
  couponTemplates: CouponTemplate[];
  formatDate: (date: string) => string;
}

const CouponList: React.FC<CouponListProps> = ({
  couponTemplates,
  formatDate,
}) => {
  const formatValue = (type: "value" | "percentage", value: number): string => {
    if (type === "value") {
      return `R$ ${value.toFixed(2)}`;
    }
    return `${value}%`;
  };

  const getValueIcon = (type: "value" | "percentage"): React.ReactNode => {
    return type === "value" ? (
      <DollarSign className="h-4 w-4" />
    ) : (
      <Percent className="h-4 w-4" />
    );
  };

  return (
    <Card className="w-full shadow-none ">
      <div className="flex items-center gap-2 px-4">
        <Ticket className="h-5 w-5 text-blue-gray-800" />
        <Typography variant="h5" className="text-blue-gray-800">
          Cupons
        </Typography>
      </div>

      <CardBody className="px-4 py-2">
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(80vh-10rem)]">
          {couponTemplates.length > 0 ? (
            couponTemplates.map((coupon) => (
              <Card
                key={coupon.id}
                className="border border-blue-gray-100"
                shadow={false}
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-1"
                      >
                        {coupon.title}
                      </Typography>
                      <div className="prose prose-sm">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: coupon.description,
                          }}
                        />
                      </div>
                    </div>
                    <Chip
                      value={formatValue(coupon.type, coupon.value)}
                      className="rounded-full flex items-center justify-center"
                      color={coupon.type === "value" ? "green" : "blue"}
                      icon={getValueIcon(coupon.type)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-blue-gray-700">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>Quantidade: {coupon.amount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Validade: {formatDate(coupon.expirationDate)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-blue-gray-500">
              <Tag className="h-12 w-12 mb-2 opacity-50" />
              <Typography>Nenhum cupom encontrado.</Typography>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CouponList;
