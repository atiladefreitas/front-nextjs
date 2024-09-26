import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
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
	const inputRef = useRef<HTMLDivElement>(null);
	const calendarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const date = parse(value, "dd/MM/yyyy", new Date());
		if (isValid(date)) {
			onChange(date);
		}
	};

	const handleDaySelect = (date: Date | undefined) => {
		onChange(date || null);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full" ref={inputRef}>
			<Input
				crossOrigin={""}
				label={label}
				name={name}
				type="text"
				value={selected ? format(selected, "dd/MM/yyyy") : ""}
				onChange={handleInputChange}
				onFocus={() => setIsOpen(true)}
				placeholder="DD/MM/YYYY"
			/>
			{isOpen && (
				<div
					ref={calendarRef}
					className="absolute z-10 bg-white shadow-xl rounded-lg p-2 border"
					style={{
						bottom: "calc(100% + 10px)",
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
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
