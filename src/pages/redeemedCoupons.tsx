import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, Typography, Button, Chip } from "@material-tailwind/react";
import { formatDate } from "@/utils/FormatDate";
import { useRouter } from "next/router";
import { Ticket, ArrowLeft, Calendar } from "lucide-react";

interface RedeemedCoupon {
	id: string;
	coupon_id: string;
	status: string;
	amount: number;
	expirationDate: string;
	user_id: string;
	user_email: string;
	user_phone: string;
	token: string;
	created_at: string;
}

function RedeemedCouponsPage() {
	const [redeemedCoupons, setRedeemedCoupons] = useState<RedeemedCoupon[]>([]);
	const supabase = useSupabaseClient();
	const router = useRouter();

	useEffect(() => {
		fetchRedeemedCoupons();
	}, []);

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
		} catch (error) {
			console.error("Error fetching redeemed coupons:", error);
			// @ts-ignore
			alert("Failed to fetch redeemed coupons: " + error.message);
		}
	};

	return (
		<div className="bg-[#eee] w-screen min-h-screen flex flex-col py-8 items-center">
			<div className="w-full max-w-xl flex justify-between items-center mb-4">
				<Button
					color="blue"
					variant="text"
					className="flex items-center gap-2"
					onClick={() => router.back()}
				>
					<ArrowLeft size={20} />
					Voltar
				</Button>
				<Typography variant="h4" color="blue-gray">
					Meus Cupons Resgatados
				</Typography>
			</div>
			<main className="w-full max-w-xl grid grid-cols-1 gap-4">
				{redeemedCoupons.map((coupon) => (
					<Card key={coupon.id} className="p-4">
						<div className="flex justify-between items-start">
							<div>
								<Typography variant="h5">Cupom Resgatado</Typography>
								<Typography variant="small" color="gray" className="mt-1">
									ID do Cupom: {coupon.coupon_id}
								</Typography>
							</div>

							{coupon.status === "used" && <Chip value="usado" color="green" />}
							{coupon.status === "redeemed" && (
								<Typography variant="h6" color="blue" className="font-bold">
									Token: {coupon.token}
								</Typography>
							)}

							{coupon.status === "expired" && (
								<Chip value="expirado" color="red" />
							)}
						</div>
						<div className="flex gap-4 items-center mt-4">
							<span className="flex items-center text-sm gap-2">
								<Ticket size={16} />
								Resgatado em: {formatDate(coupon.created_at)}
							</span>
							<span className="flex items-center text-sm gap-2">
								<Calendar size={16} />
								Válido até: {formatDate(coupon.expirationDate)}
							</span>
						</div>
					</Card>
				))}
			</main>
		</div>
	);
}

export default RedeemedCouponsPage;
