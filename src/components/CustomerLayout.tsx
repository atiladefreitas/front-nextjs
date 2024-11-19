import React, { useState, useEffect } from "react";
import {
	Card,
	Navbar,
	Typography,
	Button,
	Dialog,
} from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Calendar, Ticket, User, X } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";
import { useRouter } from "next/router";
import CouponSkeleton from "./Skeleton";
import Image from "next/image";
import CouponDialog from "./CouponDialog";

import {
	showErrorAlert,
	showSuccessAlert,
	showInfoAlert,
} from "@/utils/customAlerts";

interface ICustomerLayout {
	children: React.ReactNode;
}

interface Establishment {
	id: string;
	name: string;
	email: string;
	phone: string;
	document: string;
	role: string;
}

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

interface RedeemedCoupon {
	id: string;
	coupon_id: string;
	amount: number;
	expirationDate: string;
	user_id: string;
	user_email: string;
	user_phone: string;
	token: string;
	created_at: string;
}

function CustomerLayout({ children }: ICustomerLayout): JSX.Element {
	const [couponTemplates, setCouponTemplates] = useState<CouponTemplate[]>([]);
	const [redeemedCoupons, setRedeemedCoupons] = useState<RedeemedCoupon[]>([]);
	const [selectedCoupon, setSelectedCoupon] = useState<CouponTemplate | null>(
		null,
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = useSupabaseClient();
	const router = useRouter();

	useEffect(() => {
		fetchRedeemedCoupons();
	}, []);

	const handleMyRedeemCoupons = () => {
		router.push("/redeemedCoupons");
	};

	const fetchRedeemedCoupons = async () => {
		const userId = localStorage.getItem("userId");
		if (!userId) {
			alert("User ID not found. Please log in.");
			return;
		}

		try {
			const { data, error } = await supabase
				.from("couponRedeem")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			setRedeemedCoupons(data || []);
			fetchCouponTemplates(data || []);
		} catch (error) {
			console.error("Error fetching redeemed coupons:", error);
			// @ts-ignore
			alert("Failed to fetch redeemed coupons: " + error.message);
		}
	};

	const fetchCouponTemplates = async (redeemedCoupons: RedeemedCoupon[]) => {
		setIsLoading(true);
		try {
			const { data, error } = await supabase
				.from("couponTemplate")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;

			const redeemedCouponIds = new Set(
				redeemedCoupons.map((coupon) => coupon.coupon_id),
			);
			const filteredCouponTemplates =
				data?.filter((template) => !redeemedCouponIds.has(template.id)) || [];

			setCouponTemplates(filteredCouponTemplates);
		} catch (error) {
			console.error("Error fetching coupon templates:", error);
			// @ts-ignore
			alert("Failed to fetch coupon templates: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const formatValue = (coupon: CouponTemplate) => {
		if (coupon.type === "value") {
			return `R$ ${coupon.value.toFixed(2)}`;
		} else {
			return `${coupon.value}%`;
		}
	};

	const handleCouponClick = (coupon: CouponTemplate) => {
		setSelectedCoupon(coupon);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedCoupon(null);
	};

	const getEstablishmentName = (establishmentJson: string): string => {
		try {
			const establishment: Establishment = JSON.parse(establishmentJson);
			return establishment.name;
		} catch (error) {
			console.error("Error parsing establishment JSON:", error);
			return "Unknown Establishment";
		}
	};

	const generateToken = (): string => {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let result = "";
		for (let i = 0; i < 6; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		return result;
	};

	const handleClaimCoupon = async () => {
		if (!selectedCoupon) return;

		const userId = localStorage.getItem("userId");
		const userEmail = localStorage.getItem("userEmail");
		const userMetadata = JSON.parse(
			localStorage.getItem("userMetadata") || "{}",
		);

		const userName = userMetadata.name;
		const userPhone = userMetadata.phone;

		if (!userId || !userEmail || !userPhone || !userName) {
			alert("User information is missing. Please make sure you are logged in.");
			return;
		}

		const token = generateToken();

		const establishmentData = JSON.parse(selectedCoupon.establishment);
		console.log("Establishment ID:", establishmentData.id);

		try {
			const { data: redeemData, error: redeemError } = await supabase
				.from("couponRedeem")
				.insert({
					coupon_id: selectedCoupon.id,
					amount: selectedCoupon.amount,
					expirationDate: selectedCoupon.expirationDate,
					user_id: userId,
					user_email: userEmail,
					user_name: userName,
					user_phone: userPhone,
					token: token,
					establishment_id: establishmentData.id,
				});

			if (redeemError) throw redeemError;

			// Update couponTemplate
			const { error: updateError } = await supabase
				.from("couponTemplate")
				.update({ amount: selectedCoupon.amount - 1 })
				.eq("id", selectedCoupon.id);

			if (updateError) throw updateError;

			handleCloseDialog();

			await showSuccessAlert(
				`Cupom resgatado com sucesso! O seu token é: ${token}`,
			);
			fetchRedeemedCoupons();
		} catch (error) {
			console.error("Error claiming coupon:", error);
			// @ts-ignore
			alert("Failed to claim coupon: " + error.message);
		}
	};

	return (
		<div className="customer-layout bg-[#eee] w-screen min-h-screen flex flex-col py-8 items-center">
			<Navbar className="max-w-xl mb-4 flex items-center justify-between">
				<Image
					src="/LOGO_VERMELHA.png"
					alt="Logomarca vermelha"
					width={150}
					height={100}
				/>
				{children}
			</Navbar>
			<div className="w-full flex gap-2 max-w-xl mb-4 mt-4">
				<Button
					size="sm"
					className=""
					color="green"
					onClick={handleMyRedeemCoupons}
				>
					Meus cupons
				</Button>

				<Button
					className="flex items-center gap-2"
					color="blue"
					variant="outlined"
					size="sm"
				>
					<User size={18} />
					Perfil
				</Button>
			</div>
			<main className="w-full max-w-xl grid grid-cols-1 gap-4">
				<Typography variant="h4" color="blue-gray" className="mb-4">
					Cupons disponíveis
				</Typography>
				{isLoading ? (
					<CouponSkeleton count={3} />
				) : (
					couponTemplates.map((coupon) => (
						<Card
							key={coupon.id}
							className={`p-4 cursor-pointer hover:shadow-xl border border-[#c4c4c4]/60 duration-200 hover:-translate-y-1 hover:scale-105 transition-all ${
								coupon.banner_url ? "p-0 overflow-hidden" : ""
							}`}
							onClick={() => handleCouponClick(coupon)}
						>
							{coupon.banner_url ? (
								<div>
									<div className="relative w-full h-[200px]">
										<img
											src={coupon.banner_url}
											alt={coupon.title}
											className="w-full h-full object-cover"
										/>
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4">
											<Typography variant="h5" className="text-white">
												{coupon.title}
											</Typography>
											<Typography
												variant="small"
												color="white"
												className="mt-1 opacity-80"
											>
												{getEstablishmentName(coupon.establishment)}
											</Typography>
										</div>
									</div>
									<div className="py-2 px-4">
										<div className="flex justify-between items-center">
											<div className="flex gap-4 items-center">
												<span className="flex items-center text-sm gap-2">
													<Calendar size={14} />
													Válido até: {formatDate(coupon.expirationDate)}
												</span>
												<span className="flex items-center text-sm gap-2">
													<Ticket size={14} />
													{coupon.amount}
												</span>
											</div>
											<Typography
												variant="h6"
												color={coupon.type === "value" ? "green" : "blue"}
												className="font-bold"
											>
												{formatValue(coupon)}
											</Typography>
										</div>
									</div>
								</div>
							) : (
								<div>
									<div className="flex justify-between items-start">
										<div>
											<Typography variant="h5">{coupon.title}</Typography>
											<Typography variant="small" color="gray" className="mt-1">
												{getEstablishmentName(coupon.establishment)}
											</Typography>
										</div>
										<Typography
											variant="h6"
											color={coupon.type === "value" ? "green" : "blue"}
											className="font-bold"
										>
											{formatValue(coupon)}
										</Typography>
									</div>
									<div
										className="line-clamp-2 text-sm text-gray-600 my-4"
										dangerouslySetInnerHTML={{ __html: coupon.description }}
									/>
									<div className="flex gap-4 items-center">
										<span className="flex items-center text-sm gap-2">
											<Calendar size={16} />
											Válido até: {formatDate(coupon.expirationDate)}
										</span>
										<span className="flex items-center text-sm gap-2">
											<Ticket size={16} />
											{coupon.amount}
										</span>
									</div>
								</div>
							)}
						</Card>
					))
				)}
			</main>

			<Dialog
				size="xs"
				open={isDialogOpen}
				handler={handleCloseDialog}
				className="bg-transparent shadow-none"
			>
				<CouponDialog
					selectedCoupon={selectedCoupon}
					handleCloseDialog={handleCloseDialog}
					handleClaimCoupon={handleClaimCoupon}
					getEstablishmentName={getEstablishmentName}
					formatValue={formatValue}
				/>
			</Dialog>
		</div>
	);
}

export default CustomerLayout;
