import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button, Typography } from "@material-tailwind/react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface BannerUploadProps {
	currentBanner?: string;
	onBannerChange: (file: File | null) => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({
	currentBanner,
	onBannerChange,
}) => {
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(currentBanner || null);

	const validateImage = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			if (file.size > 5 * 1024 * 1024) {
				alert("File size must be less than 5MB");
				resolve(false);
				return;
			}

			const img = new Image();
			img.src = URL.createObjectURL(file);

			img.onload = () => {
				URL.revokeObjectURL(img.src);

				if (img.width !== 600 || img.height !== 400) {
					alert("Image must be exactly 600x400 pixels");
					resolve(false);
					return;
				}

				resolve(true);
			};

			img.onerror = () => {
				URL.revokeObjectURL(img.src);
				alert("Invalid image file");
				resolve(false);
			};
		});
	};

	const handleFileSelect = async (file: File) => {
		try {
			setUploading(true);

			const isValid = await validateImage(file);
			if (!isValid) {
				return;
			}

			// Create preview
			const previewUrl = URL.createObjectURL(file);
			setPreview(previewUrl);

			// Pass the file to parent component
			onBannerChange(file);
		} catch (error) {
			console.error("Error handling file:", error);
			alert("Error processing image");
		} finally {
			setUploading(false);
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || event.target.files.length === 0) {
			return;
		}
		handleFileSelect(event.target.files[0]);
	};

	const removeBanner = () => {
		if (preview) {
			URL.revokeObjectURL(preview);
		}
		setPreview(null);
		onBannerChange(null);
	};

	return (
		<div className="space-y-2">
			<Typography variant="small" color="blue-gray" className="font-medium">
				Banner Image (Optional - 600x400px)
			</Typography>

			<div className="relative w-full h-[200px]">
				{preview ? (
					<div className="relative w-full h-full">
						<img
							src={preview}
							alt="Banner Preview"
							className="w-full h-full object-cover rounded-lg"
						/>
						<Button
							color="red"
							variant="text"
							size="sm"
							className="absolute top-2 right-2 p-2"
							onClick={removeBanner}
						>
							<X size={20} />
						</Button>
					</div>
				) : (
					<div className="w-full h-full">
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							disabled={uploading}
							className="hidden"
							id="banner-upload"
						/>
						<label
							htmlFor="banner-upload"
							className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all"
						>
							{uploading ? (
								<Loader2 className="h-6 w-6 animate-spin" />
							) : (
								<div className="flex flex-col items-center">
									<ImageIcon className="h-8 w-8 mb-2 text-gray-400" />
									<span className="text-sm text-gray-600">
										Add Banner Image
									</span>
									<span className="text-xs text-gray-400 mt-1">
										Recommended size: 600x400px
									</span>
								</div>
							)}
						</label>
					</div>
				)}
			</div>
		</div>
	);
};

export default BannerUpload;
