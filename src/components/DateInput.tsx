import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Input } from "@material-tailwind/react";

interface DateInputProps {
	label: string;
	name: string;
	selected: Date | null;
	onChange: (date: Date | null) => void;
}

export const DateInput: React.FC<DateInputProps> = ({
	label,
	name,
	selected,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const date = parse(value, "dd-MM-yyyy", new Date());
		if (isValid(date)) {
			onChange(date);
		}
	};

	const handleDaySelect = (date: Date | undefined) => {
		onChange(date || null);
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<Input
				crossOrigin={""}
				label={label}
				name={name}
				type="text"
				value={selected ? format(selected, "dd-MM-yyyy") : ""}
				onChange={handleInputChange}
				onFocus={() => setIsOpen(true)}
				placeholder="DD-MM-YYYY"
			/>
			{isOpen && (
				<div className="absolute z-10 bg-white shadow-lg rounded-lg mt-1">
					<DayPicker
						mode="single"
						selected={selected || undefined}
						onSelect={handleDaySelect}
						footer={false}
					/>
				</div>
			)}
		</div>
	);
};
