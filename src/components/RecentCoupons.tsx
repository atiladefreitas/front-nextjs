import React from "react";
import { Typography, Card, Carousel } from "@material-tailwind/react";
import { Calendar, Ticket } from "lucide-react";
import InfiniteScrollCoupons from "./InfiniteScroll";

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

const FeaturedCoupons = ({
  coupons,
  formatValue,
  getEstablishmentName,
  formatDate,
  onCouponClick,
}: CouponsProps) => {
  // Only include coupons that have a non-null, non-undefined banner_url
  const featuredCoupons = coupons.filter(
    (coupon): coupon is Coupon & { banner_url: string } =>
      Boolean(coupon.banner_url),
  );

  if (!featuredCoupons.length) return null;

  return (
    <div className="w-full max-w-xl mb-4">
      <Typography variant="h5" color="blue-gray" className="mb-4">
        Cupons em destaque
      </Typography>
      <div>
        <Carousel className="rounded-2xl" autoplay autoplayDelay={3000} loop>
          {featuredCoupons.slice(0, 10).map((coupon) => (
            <Card
              key={coupon.id}
              className="cursor-pointer hover:shadow-xl border border-[#c4c4c4]/60 duration-200 hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => onCouponClick(coupon)}
            >
              <div className="relative">
                <img
                  src={coupon.banner_url}
                  alt={coupon.title}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <Typography variant="h6" className="text-white">
                    {coupon.title}
                  </Typography>
                  <Typography variant="small" className="text-white/80">
                    {getEstablishmentName(coupon.establishment)}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

const RecentCoupons: React.FC<CouponsProps> = (props) => {
  return (
    <>
      <FeaturedCoupons {...props} />
      <InfiniteScrollCoupons {...props} />
    </>
  );
};

export default RecentCoupons;
