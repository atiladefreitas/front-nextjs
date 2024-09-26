import React, { useState, useEffect } from "react";
import {
	Card,
	Navbar,
	Typography,
	Button,
	Dialog,
} from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Calendar, Percent, Ticket, X } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";

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
	created_at?: Date;
	establishment: string; // JSON string
}

function CustomerLayout({ children }: ICustomerLayout): JSX.Element {
	const [couponTemplates, setCouponTemplates] = useState<CouponTemplate[]>([]);
	const [selectedCoupon, setSelectedCoupon] = useState<CouponTemplate | null>(
		null,
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const supabase = useSupabaseClient();

	useEffect(() => {
		fetchCouponTemplates();
	}, []);

	const fetchCouponTemplates = async () => {
		try {
			const { data, error } = await supabase
				.from("couponTemplate")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setCouponTemplates(data || []);
		} catch (error) {
			console.error("Error fetching coupon templates:", error);
			alert("Failed to fetch coupon templates: " + error.message);
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
		const userPhone = userMetadata.phone;

		if (!userId || !userEmail || !userPhone) {
			alert("User information is missing. Please make sure you are logged in.");
			return;
		}

		const token = generateToken();

		try {
			// Insert into couponRedeem table
			const { data: redeemData, error: redeemError } = await supabase
				.from("couponRedeem")
				.insert({
					coupon_id: selectedCoupon.id,
					amount: selectedCoupon.amount,
					expirationDate: selectedCoupon.expirationDate,
					user_id: userId,
					user_email: userEmail,
					user_phone: userPhone,
					token: token,
				});

			if (redeemError) throw redeemError;

			// Update couponTemplate
			const { error: updateError } = await supabase
				.from("couponTemplate")
				.update({ amount: selectedCoupon.amount - 1 })
				.eq("id", selectedCoupon.id);

			if (updateError) throw updateError;

			alert(`Coupon claimed successfully! Your token is: ${token}`);
			handleCloseDialog();
			fetchCouponTemplates(); // Refresh the coupon list
		} catch (error) {
			console.error("Error claiming coupon:", error);
			alert("Failed to claim coupon: " + error.message);
		}
	};

	return (
		<div className="customer-layout bg-[#eee] w-screen min-h-screen flex flex-col py-8 items-center">
			<Navbar className="max-w-xl mb-4">{children}</Navbar>
			<main className="w-full max-w-xl grid grid-cols-1 gap-4 ">
				<Typography variant="h4" color="blue-gray" className="mb-4">
					Available Coupons
				</Typography>
				{couponTemplates.map((coupon) => (
					<Card
						key={coupon.id}
						className="p-4 mb-4 cursor-pointer hover:shadow-xl duration-200 hover:-translate-y-1 hover:scale-105 transition-all"
						onClick={() => handleCouponClick(coupon)}
					>
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
							key={coupon.id}
							dangerouslySetInnerHTML={{ __html: coupon.description }}
						/>
						<div className="flex gap-4 items-center mt-4">
							<span className="flex items-center text-sm gap-2">
								<Calendar size={16} />
								Valid until: {formatDate(coupon.expirationDate)}
							</span>

							<span className="flex items-center text-sm gap-2">
								<Ticket size={16} />
								{coupon.amount}
							</span>
						</div>
					</Card>
				))}
			</main>

			<Dialog
				size="xs"
				open={isDialogOpen}
				handler={handleCloseDialog}
				className="bg-white p-8"
			>
				{selectedCoupon && (
					<Card className="mx-auto w-full" shadow={false}>
						<div className="flex items-center justify-between">
							<Typography variant="h5" color="blue-gray">
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
						<div className="mt-4">
							<Typography variant="h4" color="blue-gray">
								{selectedCoupon.title}
							</Typography>
							<Typography variant="small" color="gray" className="mt-1">
								{getEstablishmentName(selectedCoupon.establishment)}
							</Typography>
							<Typography
								variant="h5"
								color={selectedCoupon.type === "value" ? "green" : "blue"}
								className="font-bold mt-2"
							>
								{formatValue(selectedCoupon)}
							</Typography>

							<div
								key={selectedCoupon.id}
								dangerouslySetInnerHTML={{ __html: selectedCoupon.description }}
							/>
							<div className="mt-4">
								<Typography variant="small" className="flex items-center gap-2">
									<Calendar size={16} />
									Start Date: {formatDate(selectedCoupon.startPromotionDate)}
								</Typography>
								<Typography
									variant="small"
									className="flex items-center gap-2 mt-1"
								>
									<Calendar size={16} />
									Expiration Date: {formatDate(selectedCoupon.expirationDate)}
								</Typography>
							</div>
							<div className="w-full bg-orange-50 p-2 mt-2 border border-orange-700 rounded-md flex items-center justify-center">
								<Typography
									variant="small"
									className="text-orange-800 font-bold"
								>
									RESTAM APENAS {selectedCoupon.amount} CUPONS
								</Typography>
							</div>
						</div>
						<Button
							size="lg"
							color="green"
							variant="gradient"
							className="mt-6 flex items-center justify-center"
							fullWidth
							onClick={handleClaimCoupon}
						>
							Resgatar cupom <Ticket />
						</Button>
					</Card>
				)}
			</Dialog>
		</div>
	);
}

export default CustomerLayout;
