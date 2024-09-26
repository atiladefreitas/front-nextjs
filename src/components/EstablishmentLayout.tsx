import React, { useState, useEffect } from "react";
import {
	Card,
	Navbar,
	Typography,
	Button,
	Dialog,
	Input,
	Radio,
} from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
	Calendar,
	Percent,
	Edit,
	TicketPlusIcon,
	Ticket,
	ScanEye,
} from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { format, parse, isValid } from "date-fns";
import { formatDate } from "@/utils/FormatDate";
import { DayPicker } from "react-day-picker";
import { DateInput } from "@/components/DateInput";
import "react-day-picker/dist/style.css";

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
	created_at?: Date;
	establishment?: object;
	establishmentId: string;
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
	".ql-editor": {
		fontSize: "18px",
	},
	".ql-editor p": {
		fontSize: "18px",
	},
};

function EstablishmentLayout({ children }: IEstablishmentLayout): JSX.Element {
	const [open, setOpen] = useState(false);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
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
	});
	const [isEditing, setIsEditing] = useState(false);
	const supabase = useSupabaseClient();
	const [establishmentInfo, setEstablishmentInfo] =
		useState<EstablishmentInfo | null>(null);

	useEffect(() => {
		fetchCoupons();
		fetchEstablishmentInfo();
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
			alert("Failed to fetch coupons: " + error.message);
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
			};

			if (isEditing) {
				const { error } = await supabase
					.from("couponTemplate")
					.update(couponData)
					.eq("id", formData.id);

				if (error) throw error;
				alert("Coupon updated successfully!");
			} else {
				const { error } = await supabase
					.from("couponTemplate")
					.insert([{ ...couponData, id: crypto.randomUUID() }]);

				if (error) throw error;
				alert("Coupon created successfully!");
			}

			handleClose();
			fetchCoupons();
		} catch (error) {
			console.error("Error saving coupon:", error);
			alert("Failed to save coupon: " + error.message);
		}
	};

	return (
		<div className="admin-layout bg-[#eee] w-screen h-screen flex flex-col py-8 items-center ">
			<Navbar className="max-w-7xl mb-4 flex items-center justify-end">
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
					className="flex items-center  gap-2"
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
				</Card>
			</main>

			<Dialog size="xs" open={open} handler={handleClose}>
				<Card className="mx-auto w-full" shadow={false}>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
						<Typography variant="h4" color="blue-gray">
							{isEditing ? "Edit Coupon" : "Create New Coupon"}
						</Typography>
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
								onChange={(date) => handleDateChange(date, "expirationDate")}
							/>
						</span>
						<Button type="submit" color="blue" variant="gradient">
							{isEditing ? "Atualizar cupom" : "Criar cupom"}
						</Button>
					</form>
				</Card>
			</Dialog>
		</div>
	);
}

export default EstablishmentLayout;
