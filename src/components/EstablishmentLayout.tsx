import React, { useState, useEffect } from "react";
import {
	Card,
	Navbar,
	Typography,
	Button,
	Dialog,
	Input,
	Radio,
	Chip,
} from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
	Calendar,
	Percent,
	Edit,
	TicketPlusIcon,
	Ticket,
	ScanEye,
	CalendarDays,
	Badge,
} from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { format, parse, isValid } from "date-fns";
import { formatDate } from "@/utils/FormatDate";
import { DayPicker } from "react-day-picker";
import { DateInput } from "@/components/DateInput";
import "react-day-picker/dist/style.css";
import Image from "next/image";
import {
	showErrorAlert,
	showSuccessAlert,
	showInfoAlert,
	showConfirmationAlert,
} from "@/utils/customAlerts";
import CouponGallery from "./CouponGallery";
import BannerUpload from "./BannerUpload";
import GalleryUpload from "./GalleryUpload";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IEstablishmentLayout {
	children: React.ReactNode;
}

interface Coupon {
	id: string;
	title: string;
	description: string;
	value: number;
	type: "value" | "percentage";
	amount: number;
	startPromotionDate: Date | null;
	expirationDate: Date | null;
	created_at?: any;
	establishment?: object;
	establishmentId: string;
	banner_url?: string;
	gallery_images?: string[];
}

interface EstablishmentInfo {
	id: string;
	name: string;
	email: string;
	phone: string;
	document: string;
	role: string;
}

const modules = {
	toolbar: [
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "bullet" }],
		["clean"],
	],
};

const formats = ["header", "bold", "italic", "underline", "strike"];

const quillStyle = {
	fontSize: "18px",
};

function EstablishmentLayout({ children }: IEstablishmentLayout): JSX.Element {
	const [open, setOpen] = useState(false);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [redeemedCoupons, setRedeemedCoupons] = useState<any[]>([]);
	const [formData, setFormData] = useState<Coupon>({
		id: "",
		establishmentId: "",
		title: "",
		description: "",
		value: 0,
		type: "value",
		amount: 0,
		startPromotionDate: null,
		expirationDate: null,
		banner_url: "",
		gallery_images: [],
	});
	const [isEditing, setIsEditing] = useState(false);
	const supabase = useSupabaseClient();
	const [establishmentInfo, setEstablishmentInfo] =
		useState<EstablishmentInfo | null>(null);
	const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
	const [tokenInput, setTokenInput] = useState("");
	const [validatedCoupon, setValidatedCoupon] = useState<any>(null);
	const [validationStep, setValidationStep] = useState<"input" | "confirm">(
		"input",
	);
	const [bannerFile, setBannerFile] = useState<File | null>(null);
	const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

	useEffect(() => {
		fetchCoupons();
		fetchEstablishmentInfo();
		fetchRedeemedCoupons();
	}, []);

	const fetchEstablishmentInfo = () => {
		const userMetadata = JSON.parse(
			localStorage.getItem("userMetadata") || "{}",
		);
		const userId = localStorage.getItem("userId");
		setEstablishmentInfo({
			id: userMetadata.sub,
			name: userMetadata.name,
			email: userMetadata.email,
			phone: userMetadata.phone,
			document: userMetadata.document,
			role: userMetadata.role,
		});
	};

	const fetchCoupons = async () => {
		try {
			const { data, error } = await supabase
				.from("couponTemplate")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setCoupons(data || []);
		} catch (error) {
			console.error("Error fetching coupons:", error);
			// @ts-ignore
			await showErrorAlert("Falha ao carregar cupons: " + error.message);
		}
	};

	const handleOpen = (coupon?: Coupon) => {
		if (coupon) {
			setFormData({
				...coupon,
				startPromotionDate: coupon.startPromotionDate
					? new Date(coupon.startPromotionDate)
					: null,
				expirationDate: coupon.expirationDate
					? new Date(coupon.expirationDate)
					: null,
				banner_url: coupon.banner_url || "",
				gallery_images: coupon.gallery_images || [],
			});
			setIsEditing(true);
		} else {
			setFormData({
				id: "",
				title: "",
				description: "",
				establishmentId: "",
				value: 0,
				type: "value",
				amount: 0,
				startPromotionDate: null,
				expirationDate: null,
				banner_url: "",
				gallery_images: [],
			});
			setIsEditing(false);
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setIsEditing(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleDescriptionChange = (content: string) => {
		setFormData({ ...formData, description: content });
	};

	const handleTypeChange = (value: "value" | "percentage") => {
		setFormData({ ...formData, type: value });
	};

	const handleDateChange = (
		date: Date | null,
		name: "startPromotionDate" | "expirationDate",
	) => {
		setFormData({ ...formData, [name]: date });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const userId = localStorage.getItem("userId");

			const {
				data: { user },
			} = await supabase.auth.getUser();
			console.log("User:", user);
			console.log("User ID:", userId);
			console.log("User Role:", user?.user_metadata?.role);

			let bannerUrl = "";
			if (bannerFile) {
				const bannerFileName = `banners/${Date.now()}-${bannerFile.name}`;
				const { error: bannerError } = await supabase.storage
					.from("coupons")
					.upload(bannerFileName, bannerFile);

				if (bannerError) throw bannerError;

				const {
					data: { publicUrl },
				} = supabase.storage.from("coupons").getPublicUrl(bannerFileName);

				bannerUrl = publicUrl;
			}

			const galleryUrls: string[] = [];
			for (const file of galleryFiles) {
				const fileName = `gallery/${Date.now()}-${file.name}`;
				const { error: uploadError } = await supabase.storage
					.from("coupons")
					.upload(fileName, file);

				if (uploadError) throw uploadError;

				const {
					data: { publicUrl },
				} = supabase.storage.from("coupons").getPublicUrl(fileName);

				galleryUrls.push(publicUrl);
			}

			const couponData = {
				...formData,
				establishmentId: userId,
				startPromotionDate: formData.startPromotionDate
					? format(formData.startPromotionDate, "yyyy-MM-dd")
					: null,
				expirationDate: formData.expirationDate
					? format(formData.expirationDate, "yyyy-MM-dd")
					: null,
				establishment: establishmentInfo
					? JSON.stringify({
							id: establishmentInfo.id,
							name: establishmentInfo.name,
							email: establishmentInfo.email,
							phone: establishmentInfo.phone,
							document: establishmentInfo.document,
							role: establishmentInfo.role,
						})
					: null,
				banner_url: bannerUrl || null,
				gallery_images: galleryUrls,
			};

			if (isEditing) {
				const { error } = await supabase
					.from("couponTemplate")
					.update(couponData)
					.eq("id", formData.id);

				if (error) throw error;
				await showSuccessAlert("Cupom atualizado com sucesso!");
			} else {
				const { error } = await supabase
					.from("couponTemplate")
					.insert([{ ...couponData, id: crypto.randomUUID() }]);

				if (error) throw error;
				await showSuccessAlert("Cupom criado com sucesso!");
			}

			handleClose();
			fetchCoupons();
		} catch (error) {
			console.error("Error saving coupon:", error);
			// @ts-ignore
			await showErrorAlert("Failed to save coupon: " + error.message);
		}
	};

	const fetchRedeemedCoupons = async () => {
		try {
			const userId = localStorage.getItem("userId");
			if (!userId) {
				console.error("User ID not found in localStorage");
				return;
			}

			const { data, error } = await supabase
				.from("couponRedeem")
				.select("*")
				.eq("establishment_id", userId)
				.order("created_at", { ascending: false })
				.limit(10);

			if (error) throw error;
			setRedeemedCoupons(data || []);
		} catch (error) {
			console.error("Error fetching redeemed coupons:", error);
			// @ts-ignore
			alert("Failed to fetch redeemed coupons: " + error.message);
		}
	};
	const handleValidateCouponClick = () => {
		setIsValidateDialogOpen(true);
		setValidationStep("input");
		setTokenInput("");
		setValidatedCoupon(null);
	};
	const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTokenInput(e.target.value);
	};
	const handleTokenSubmit = async () => {
		if (tokenInput.length !== 6) {
			alert("Please enter a valid 6-digit token.");
			return;
		}

		try {
			const { data, error } = await supabase
				.from("couponRedeem")
				.select(`*`)
				.eq("token", tokenInput)
				.single();

			if (error) throw error;

			if (data) {
				setValidatedCoupon(data);
				setValidationStep("confirm");
			} else {
				alert("No coupon found with this token.");
			}
		} catch (error) {
			console.error("Error fetching coupon:", error);
			// @ts-ignore
			alert("Failed to fetch coupon: " + error.message);
		}
	};

	const handleCouponAction = async (action: "used" | "expired") => {
		try {
			const { error } = await supabase
				.from("couponRedeem")
				.update({ status: action })
				.eq("id", validatedCoupon.id);

			if (error) throw error;

			setIsValidateDialogOpen(false);

			await showSuccessAlert(
				`Cupom ${action === "used" ? "validado" : "invalidado"} com sucesso!.`,
			);
			setValidationStep("input");
			setValidatedCoupon(null);
			fetchRedeemedCoupons(); // Refresh the list of redeemed coupons
		} catch (error) {
			console.error("Error updating coupon status:", error);
			// @ts-ignore
			alert("Failed to update coupon status: " + error.message);
		}
	};

	return (
		<div className="admin-layout bg-[#eee] w-screen h-screen flex flex-col py-8 items-center px-4">
			<Navbar className=" max-w-7xl mb-4 flex items-center justify-between">
				<Image
					src="/LOGO_VERMELHA.png"
					alt="Logomarca vermelha"
					width={150}
					height={100}
				/>
				{children}
			</Navbar>
			<div className="w-full mb-4 max-w-7xl flex items-center gap-4">
				<Button
					color="green"
					variant="gradient"
					onClick={() => handleOpen()}
					className="flex items-center  gap-2"
				>
					<TicketPlusIcon />
					Criar cupom
				</Button>

				<Button
					color="blue-gray"
					variant="gradient"
					className="flex items-center gap-2"
					onClick={handleValidateCouponClick}
				>
					<ScanEye />
					Validar cupom
				</Button>
			</div>
			<main className="w-full max-w-7xl grid grid-cols-2 gap-4 h-full">
				<Card className="establishments-list p-4">
					<Typography variant="h5" color="blue-gray" className="mb-4">
						Cupons criados
					</Typography>
					{coupons.map((coupon) => (
						<div key={coupon.id} className="border mb-2 rounded-xl p-4">
							<div className="flex justify-between items-start">
								<Typography variant="h5">{coupon.title}</Typography>
								<Button
									size="sm"
									color="blue"
									variant="text"
									className="p-2"
									onClick={() => handleOpen(coupon)}
								>
									<Edit size={16} />
								</Button>
							</div>
							<div className="w-full h-[2rem] flex gap-4">
								<span className="flex items-center text-sm gap-2 mt-2">
									<Calendar size={18} />
									Criado em: {formatDate(coupon.created_at)}
								</span>

								<span className="flex items-center text-sm gap-2 mt-2">
									<Ticket size={18} />
									{coupon.amount}
								</span>
							</div>
						</div>
					))}
				</Card>
				<Card className="establishments-list p-4">
					<Typography variant="h5" color="blue-gray" className="mb-4">
						Resgatou recentemente
					</Typography>
					{redeemedCoupons.map((coupon) => (
						<div key={coupon.id} className="border mb-2 rounded-xl p-4">
							<span className="flex justify-between">
								<Typography variant="h6">{coupon.user_name}</Typography>
								{coupon.status === "used" && (
									<Chip value="usado" color="green" />
								)}
								{coupon.status === "redeem" && (
									<Chip value="regatado" color="blue" />
								)}

								{coupon.status === "expired" && (
									<Chip value="expirado" color="red" />
								)}
							</span>
							<div className="w-full flex gap-4">
								<span className="flex items-center text-sm gap-2 mt-2">
									<Calendar size={18} />
									Resgatado em: {formatDate(coupon.created_at)}
								</span>
								<span className="flex items-center text-sm gap-2 mt-2">
									<Ticket size={18} />
									{coupon.user_email}
								</span>
							</div>
						</div>
					))}
				</Card>
			</main>

			<Dialog size="xl" open={open} handler={handleClose}>
				<Card className=" w-full" shadow={false}>
					<form onSubmit={handleSubmit} className="gap-4 p-4 ">
						<Typography variant="h4" color="blue-gray">
							{isEditing ? "Editar Cupom" : "Criar novo cupom"}
						</Typography>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<div className="flex flex-col gap-4 ">
								<Input
									crossOrigin={""}
									label="Titulo"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
								/>
								<div className="mb-2">
									<Typography color="blue-gray" className="font-medium mb-2">
										Descrição
									</Typography>
									<div className="h-52">
										<ReactQuill
											theme="snow"
											value={formData.description}
											modules={modules}
											formats={formats}
											onChange={handleDescriptionChange}
											className="h-full"
											style={quillStyle}
										/>
									</div>
								</div>
								<div className="items-center gap-4 grid grid-cols-2">
									<Typography
										color="blue-gray"
										className="font-medium col-span-2 -mb-4"
									>
										Tipo:
									</Typography>
									<Radio
										crossOrigin={""}
										name="type"
										label="Valor"
										checked={formData.type === "value"}
										onChange={() => handleTypeChange("value")}
									/>
									<Radio
										crossOrigin={""}
										name="type"
										label="Porcentagem"
										checked={formData.type === "percentage"}
										onChange={() => handleTypeChange("percentage")}
									/>
								</div>
								<div className="relative flex items-center justify-center">
									{formData.type === "value" && (
										<div className="h-[2.5rem] bg-gray-200 w-[3rem] flex items-center justify-center rounded-l-md border-l border-[#c4c4c4] border-t border-b">
											<span className="font-semibold">R$</span>
										</div>
									)}
									<Input
										crossOrigin={""}
										label="Valor"
										name="value"
										type="number"
										value={formData.value}
										onChange={handleInputChange}
										className={
											formData.type === "value"
												? "rounded-l-none"
												: "rounded-r-none"
										}
									/>
									{formData.type === "percentage" && (
										<div className="h-[2.5rem] bg-gray-200 w-fit px-3 flex items-center justify-center rounded-r-md border-r border-[#c4c4c4] border-t border-b">
											<span className="flex items-center gap-1 font-semibold">
												<Percent size={18} />
												OFF
											</span>
										</div>
									)}
								</div>
								<Input
									crossOrigin={""}
									label="Quantidade"
									name="amount"
									type="number"
									value={formData.amount}
									onChange={handleInputChange}
								/>
								<span className="w-full flex gap-4">
									<DateInput
										label="Início da promoção"
										name="startPromotionDate"
										selected={formData.startPromotionDate}
										onChange={(date) =>
											handleDateChange(date, "startPromotionDate")
										}
									/>
									<DateInput
										label="Data de expiração"
										name="expirationDate"
										selected={formData.expirationDate}
										onChange={(date) =>
											handleDateChange(date, "expirationDate")
										}
									/>
								</span>
							</div>

							<div className="flex flex-col gap-4">
								<BannerUpload
									currentBanner={formData.banner_url}
									onBannerChange={(file) => setBannerFile(file)}
								/>

								<GalleryUpload
									onImagesChange={(files) => setGalleryFiles(files)}
								/>
							</div>
						</div>
						<div className="mt-2 flex justify-end">
							<Button type="submit" color="blue" variant="gradient">
								{isEditing ? "Atualizar cupom" : "Criar cupom"}
							</Button>
						</div>
					</form>
				</Card>
			</Dialog>

			{/* New Dialog for Coupon Validation */}
			<Dialog
				size="xs"
				open={isValidateDialogOpen}
				handler={() => setIsValidateDialogOpen(false)}
				className="bg-white p-8 "
			>
				<Card className="mx-auto w-full " shadow={false}>
					{validationStep === "input" ? (
						<>
							<Typography variant="h5" color="blue-gray" className="mb-4">
								Validar Cupom
							</Typography>
							<Input
								crossOrigin={""}
								label="Token do Cupom (6 dígitos)"
								value={tokenInput}
								onChange={handleTokenInputChange}
								size="lg"
							/>
							<Button
								className="mt-4"
								onClick={handleTokenSubmit}
								color="blue"
								fullWidth
							>
								Verificar
							</Button>
						</>
					) : (
						<>
							<Typography variant="h5" color="blue-gray" className="mb-4">
								Validar Cupom
							</Typography>
							<Typography variant="h5">
								{validatedCoupon?.user_name || "N/A"}
							</Typography>
							<Typography variant="paragraph">
								{validatedCoupon?.user_email || "N/A"}
							</Typography>
							<span className="flex items-center gap-4 mt-2">
								<Typography
									variant="paragraph"
									className="flex items-center gap-2"
								>
									<Ticket size={18} /> {validatedCoupon?.amount || "N/A"}
								</Typography>
								<Typography
									variant="paragraph"
									className="flex items-center gap-2"
								>
									<CalendarDays size={18} />
									{formatDate(validatedCoupon.created_at)}
								</Typography>
							</span>
							{validatedCoupon?.status === "used" ? (
								<>
									<div className="w-full bg-orange-100 p-2 mt-4 flex items-center justify-center rounded-lg border border-orange-500">
										<p className="text-orange-900 font-bold">
											Este cupom já foi utilizado
										</p>
									</div>
									<div className="mt-4">
										<Button
											color="red"
											onClick={() => setIsValidateDialogOpen(false)}
										>
											Fechar
										</Button>
									</div>
								</>
							) : (
								<>
									<div className="flex justify-between mt-4">
										<Button
											onClick={() => handleCouponAction("expired")}
											variant="outlined"
											color="red"
										>
											Invalidar
										</Button>
										<Button
											onClick={() => handleCouponAction("used")}
											color="green"
										>
											Aprovar
										</Button>
									</div>
								</>
							)}
						</>
					)}
				</Card>
			</Dialog>
		</div>
	);
}

export default EstablishmentLayout;
