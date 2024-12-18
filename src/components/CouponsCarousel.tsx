import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Typography } from "@material-tailwind/react";
import Autoplay from "embla-carousel-autoplay";

interface Coupon {
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

interface CouponsProps {
  coupons: Coupon[];
  formatValue: (coupon: Coupon) => string;
  getEstablishmentName: (establishmentJson: string) => string;
  formatDate: (date: string) => string;
  onCouponClick: (coupon: Coupon) => void;
}

export function CarouselCoupons({
  coupons,
  getEstablishmentName,
  onCouponClick,
}: CouponsProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const featuredCoupons = coupons.filter(
    (coupon): coupon is Coupon & { banner_url: string } =>
      Boolean(coupon.banner_url),
  );

  if (!featuredCoupons.length) return null;

  return (
    <div className="w-full max-w-6xl mb-4 hidden md:flex md:flex-col">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Cupons em destaque
      </Typography>
      <Carousel
        className="w-full rounded-md"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="-ml-2">
          {featuredCoupons.slice(0, 10).map((coupon) => (
            <CarouselItem
              key={coupon.id}
              className="pl-2 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card
                  className="cursor-pointer hover:shadow-xl border border-[#c4c4c4]/60 duration-200 hover:-translate-y-1 transition-all overflow-hidden"
                  onClick={() => onCouponClick(coupon)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={coupon.banner_url}
                        alt={coupon.title}
                        className="w-full h-60 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">
                          {coupon.title}
                        </h3>
                        <p className="text-sm text-white/80">
                          {getEstablishmentName(coupon.establishment)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default CarouselCoupons;
