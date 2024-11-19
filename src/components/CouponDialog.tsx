import React from "react";
import { Card, Typography, Button, Carousel } from "@material-tailwind/react";
import { X, Calendar, Ticket } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";

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
	if (!selectedCoupon) return null;

	return (
		<div className="bg-white rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
			<Card className="mx-auto w-full" shadow={false}>
				{selectedCoupon.banner_url ? (
					<div className="relative">
						<img
							src={selectedCoupon.banner_url}
							alt={selectedCoupon.title}
							className="w-full h-64 object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
						<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
							<Typography variant="h3">{selectedCoupon.title}</Typography>
							<Typography variant="paragraph" className="mt-2 opacity-80">
								{getEstablishmentName(selectedCoupon.establishment)}
							</Typography>
						</div>
						<Button
							variant="text"
							color="white"
							onClick={handleCloseDialog}
							className="absolute top-4 right-4 p-2"
						>
							<X size={24} />
						</Button>
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

					{Array.isArray(selectedCoupon.gallery_images) &&
						selectedCoupon.gallery_images.length > 0 && (
							<div className="w-full h-64 my-4">
								<Carousel
									className="rounded-xl"
									prevArrow={({ handlePrev }) => (
										<Button
											variant="text"
											color="white"
											size="lg"
											onClick={handlePrev}
											className="!absolute top-2/4 left-4 -translate-y-2/4"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="h-6 w-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
												/>
											</svg>
										</Button>
									)}
									nextArrow={({ handleNext }) => (
										<Button
											variant="text"
											color="white"
											size="lg"
											onClick={handleNext}
											className="!absolute top-2/4 !right-4 -translate-y-2/4"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="h-6 w-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
												/>
											</svg>
										</Button>
									)}
									navigation={({ setActiveIndex, activeIndex, length }) => (
										<div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
											{new Array(length).fill("").map((_, i) => (
												<span
													key={i}
													className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
														activeIndex === i
															? "w-8 bg-white"
															: "w-4 bg-white/50"
													}`}
													onClick={() => setActiveIndex(i)}
												/>
											))}
										</div>
									)}
								>
									{selectedCoupon.gallery_images.map(
										(image: string, index: number) => (
											<img
												key={index}
												src={image}
												alt={`Gallery ${index + 1}`}
												className="h-full w-full object-cover"
											/>
										),
									)}
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
