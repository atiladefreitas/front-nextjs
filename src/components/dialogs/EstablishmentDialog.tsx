import React from "react";
import {
	Button,
	Dialog,
	Card,
	CardBody,
	CardFooter,
	Typography,
	Input,
} from "@material-tailwind/react";
import { FormData } from "../../types";

interface EstablishmentDialogProps {
	open: boolean;
	handleOpen: () => void;
	formData: FormData;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	handlePostalCodeChange: (value: string) => void;
}

const EstablishmentDialog: React.FC<EstablishmentDialogProps> = ({
	open,
	handleOpen,
	formData,
	handleInputChange,
	handleSubmit,
	handlePostalCodeChange,
}) => {
	return (
		<>
			<Button placeholder="" onClick={handleOpen} size="sm">
				Novo estabelecimento
			</Button>

			<Dialog
				size="xs"
				open={open}
				handler={handleOpen}
				className="max-w-[32rem]"
			>
				<Card className="mx-auto w-full max-w-[30rem]" shadow={false}>
					<CardBody className="flex flex-col gap-4">
						<Typography variant="h4" color="blue-gray">
							Adicionar novo estabelecimento
						</Typography>
						<form onSubmit={handleSubmit} className="gap-4 flex flex-col gap-2">
							<Input
								crossOrigin={""}
								label="Name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
							/>
							<Input
								crossOrigin={""}
								label="Document"
								name="document"
								value={formData.document}
								onChange={handleInputChange}
							/>
							<Input
								crossOrigin={""}
								label="Phone"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
							/>
							<Input
								crossOrigin={""}
								label="Email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleInputChange}
							/>
							<Input
								crossOrigin={""}
								label="CEP"
								name="postal_code"
								value={formData.postal_code}
								onChange={(e) => handlePostalCodeChange(e.target.value)}
							/>
							<div className="flex gap-2">
								<Input
									crossOrigin={""}
									label="City"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
								/>
								<Input
									crossOrigin={""}
									label="State"
									name="state"
									value={formData.state}
									onChange={handleInputChange}
								/>
							</div>
							<div className="flex gap-2">
								<Input
									crossOrigin={""}
									label="Neighborhood"
									name="neighborhood"
									value={formData.neighborhood}
									onChange={handleInputChange}
								/>
								<Input
									crossOrigin={""}
									label="Rua"
									name="street"
									value={formData.street}
									onChange={handleInputChange}
								/>
							</div>
							<div className="flex gap-2">
								<Input
									crossOrigin={""}
									label="Number"
									name="number"
									value={formData.number}
									onChange={handleInputChange}
								/>
								<Input
									crossOrigin={""}
									label="Complement"
									name="complement"
									value={formData.complement}
									onChange={handleInputChange}
								/>
							</div>
							<Button type="submit" color="green">
								Salvar
							</Button>
						</form>
					</CardBody>
					<CardFooter className="pt-0">
						<Button
							variant="outlined"
							onClick={handleOpen}
							fullWidth
							color="red"
						>
							Cancelar
						</Button>
					</CardFooter>
				</Card>
			</Dialog>
		</>
	);
};

export default EstablishmentDialog;
