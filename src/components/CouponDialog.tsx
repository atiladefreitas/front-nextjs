import React, { useState } from "react";
import { Card, Typography, Button, Carousel } from "@material-tailwind/react";
import { X, Calendar, Ticket, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";
import Image from "next/image";

interface CouponTemplate {
  id: string;
  title: string;
  description: string;
  value: number;
  type: "value" | "percentage";
  amount: number;
  startPromotionDate: string;
  expirationDate: string;
  establishmentId: string;
  establishment: string;
  banner_url?: string | null;
  gallery_images?: string[] | null;
  created_at?: Date;
}

interface CouponDialogProps {
  selectedCoupon: CouponTemplate | null;
  handleCloseDialog: () => void;
  handleClaimCoupon: () => void;
  getEstablishmentName: (establishmentJson: string) => string;
  formatValue: (coupon: CouponTemplate) => string;
}

const CouponDialog: React.FC<CouponDialogProps> = ({
  selectedCoupon,
  handleCloseDialog,
  handleClaimCoupon,
  getEstablishmentName,
  formatValue,
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  if (!selectedCoupon) return null;

  const galleryImages = Array.isArray(selectedCoupon.gallery_images)
    ? selectedCoupon.gallery_images
    : typeof selectedCoupon.gallery_images === "string"
      ? JSON.parse(selectedCoupon.gallery_images || "[]")
      : [];

  const handleImagesLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <div className="rounded-md overflow-hidden max-h-[90vh] overflow-y-auto">
      <Card className="mx-auto w-full" shadow={false}>
        {selectedCoupon.banner_url ? (
          <div className="relative">
            <div className="absolute w-full flex flex-col justify-between h-full inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex justify-end p-2">
                <Button
                  variant="outlined"
                  color="white"
                  onClick={handleCloseDialog}
                  className=""
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="w-full relative">
                <div className="bottom-0 left-0 right-0 p-6 text-white">
                  <Typography variant="h3" className="z text-white">
                    {selectedCoupon.title}
                  </Typography>
                  <Typography variant="paragraph" className="mt-2 opacity-80">
                    {getEstablishmentName(selectedCoupon.establishment)}
                  </Typography>
                </div>
                <div className="absolute " />
              </div>
            </div>
            <img
              src={selectedCoupon.banner_url}
              alt={selectedCoupon.title}
              className="w-full h-64 object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4">
            <Typography variant="h4" color="blue-gray">
              Detalhes
            </Typography>
            <Button
              variant="text"
              color="blue-gray"
              onClick={handleCloseDialog}
              className="p-2"
            >
              <X size={20} />
            </Button>
          </div>
        )}

        <div className="p-6">
          {!selectedCoupon.banner_url && (
            <>
              <Typography variant="h4" color="blue-gray">
                {selectedCoupon.title}
              </Typography>
              <Typography variant="small" color="gray" className="mt-1">
                {getEstablishmentName(selectedCoupon.establishment)}
              </Typography>
            </>
          )}

          <Typography
            variant="h5"
            color={selectedCoupon.type === "value" ? "green" : "blue"}
            className="font-bold mt-4"
          >
            {formatValue(selectedCoupon)}
          </Typography>

          <div
            className="mt-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedCoupon.description }}
          />

          {galleryImages.length > 0 && (
            <div className="relative mt-2">
              {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                </div>
              )}
              <Carousel
                className="rounded-2xl"
                autoplay
                autoplayDelay={3000}
                loop
                navigation={({ setActiveIndex, activeIndex, length }) => null}
                onLoad={handleImagesLoad}
              >
                {galleryImages.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="h-[300px] w-full object-cover"
                    onLoad={handleImagesLoad}
                  />
                ))}
              </Carousel>
            </div>
          )}

          <div className="mt-4">
            <Typography variant="small" className="flex items-center gap-2">
              <Calendar size={16} />
              Data Inicial: {formatDate(selectedCoupon.startPromotionDate)}
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-2 mt-1"
            >
              <Calendar size={16} />
              Data Final: {formatDate(selectedCoupon.expirationDate)}
            </Typography>
          </div>

          <div className="w-full bg-orange-50 p-2 mt-4 border border-orange-700 rounded-md flex items-center justify-center">
            <Typography variant="small" className="text-orange-800 font-bold">
              RESTAM APENAS {selectedCoupon.amount} CUPONS
            </Typography>
          </div>

          <Button
            size="lg"
            color="green"
            variant="gradient"
            className="mt-6 flex items-center justify-center"
            fullWidth
            onClick={handleClaimCoupon}
          >
            Resgatar cupom <Ticket className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CouponDialog;
