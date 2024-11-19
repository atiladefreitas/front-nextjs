import React from "react";
import { Typography, Card } from "@material-tailwind/react";
import { Calendar, Ticket } from "lucide-react";

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

interface InfiniteScrollCouponsProps {
	coupons: Coupon[];
	formatValue: (coupon: Coupon) => string;
	getEstablishmentName: (establishmentJson: string) => string;
	formatDate: (date: string) => string;
	onCouponClick: (coupon: Coupon) => void;
}

interface CouponCardProps {
	coupon: Coupon;
}

const InfiniteScrollCoupons = ({
	coupons,
	formatValue,
	getEstablishmentName,
	formatDate,
	onCouponClick,
}: InfiniteScrollCouponsProps) => {
	const regularCoupons = coupons.filter((coupon) => !coupon.banner_url);

	if (!regularCoupons.length) return null;

	// Duplicate the coupons array to create a seamless loop
	const duplicatedCoupons = [...regularCoupons, ...regularCoupons];

	const CouponCard = ({ coupon }: CouponCardProps) => (
		<Card
			className="min-w-[280px] p-4 cursor-pointer hover:shadow-xl border border-[#c4c4c4]/60 duration-200 hover:-translate-y-1 transition-all"
			onClick={() => onCouponClick(coupon)}
		>
			<div className="flex flex-col h-full">
				<div className="flex justify-between items-start mb-2">
					<div className="flex-1 min-w-0">
						<Typography variant="h6" className="line-clamp-1">
							{coupon.title}
						</Typography>
						<Typography variant="small" color="gray" className="line-clamp-1">
							{getEstablishmentName(coupon.establishment)}
						</Typography>
					</div>
					<Typography
						variant="h6"
						color={coupon.type === "value" ? "green" : "blue"}
						className="font-bold whitespace-nowrap ml-2"
					>
						{formatValue(coupon)}
					</Typography>
				</div>

				<div
					dangerouslySetInnerHTML={{ __html: coupon.description }}
					className="line-clamp-2 text-sm text-gray-600 mb-3"
				/>

				<div className="mt-auto">
					<div className="flex gap-2 items-center text-sm text-gray-600">
						<span className="flex items-center gap-1">
							<Calendar size={14} />
							{formatDate(coupon.expirationDate)}
						</span>
						<span className="flex items-center gap-1">
							<Ticket size={14} />
							{coupon.amount}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);

	return (
		<div className="w-full mb-6">
			<Typography variant="h5" color="blue-gray" className="mb-4">
				Outros cupons
			</Typography>

			<div className="relative overflow-hidden">
				{/* Gradient overlays for smooth fade effect */}
				<div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#eee] to-transparent" />
				<div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#eee] to-transparent" />

				{/* Scrolling container */}
				<div className="overflow-hidden">
					<div className="flex gap-4 animate-scroll">
						{duplicatedCoupons.map((coupon, index) => (
							<div key={`${coupon.id}-${index}`} className="flex-shrink-0">
								<CouponCard coupon={coupon} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfiniteScrollCoupons;
