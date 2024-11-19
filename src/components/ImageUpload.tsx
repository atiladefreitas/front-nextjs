import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@material-tailwind/react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
	bucketName: string;
	path: string;
	onUploadComplete: (url: string) => void;
	maxSize?: number; // in MB
	aspectRatio?: number; // width/height
	maxWidth?: number;
	maxHeight?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	bucketName,
	path,
	onUploadComplete,
	maxSize = 5, // Default 5MB
	aspectRatio,
	maxWidth,
	maxHeight,
}) => {
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const supabase = useSupabaseClient();

	const validateImage = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			if (file.size > maxSize * 1024 * 1024) {
				alert(`File size must be less than ${maxSize}MB`);
				resolve(false);
				return;
			}

			const img = new Image();
			img.src = URL.createObjectURL(file);

			img.onload = () => {
				URL.revokeObjectURL(img.src);

				if (maxWidth && img.width > maxWidth) {
					alert(`Image width must be less than ${maxWidth}px`);
					resolve(false);
					return;
				}

				if (maxHeight && img.height > maxHeight) {
					alert(`Image height must be less than ${maxHeight}px`);
					resolve(false);
					return;
				}

				if (aspectRatio) {
					const imageRatio = img.width / img.height;
					const tolerance = 0.1; // Allow 10% deviation from desired ratio
					if (Math.abs(imageRatio - aspectRatio) > tolerance) {
						alert(`Image aspect ratio must be approximately ${aspectRatio}`);
						resolve(false);
						return;
					}
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

	const uploadImage = async (file: File) => {
		try {
			setUploading(true);

			const isValid = await validateImage(file);
			if (!isValid) {
				setUploading(false);
				return;
			}

			// Create a preview
			setPreview(URL.createObjectURL(file));

			const fileExt = file.name.split(".").pop();
			const fileName = `${Math.random()}.${fileExt}`;
			const filePath = `${path}/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from(bucketName)
				.upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			const {
				data: { publicUrl },
			} = supabase.storage.from(bucketName).getPublicUrl(filePath);

			onUploadComplete(publicUrl);
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Error uploading image");
		} finally {
			setUploading(false);
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || event.target.files.length === 0) {
			return;
		}
		uploadImage(event.target.files[0]);
	};

	const clearPreview = () => {
		setPreview(null);
		onUploadComplete("");
	};

	return (
		<div className="relative">
			{preview ? (
				<div className="relative">
					<img
						src={preview}
						alt="Preview"
						className="w-full h-full object-cover rounded-lg"
					/>
					<Button
						color="red"
						variant="text"
						size="sm"
						className="absolute top-2 right-2"
						onClick={clearPreview}
					>
						<X size={20} />
					</Button>
				</div>
			) : (
				<div className="relative">
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						disabled={uploading}
						className="hidden"
						id="image-upload"
					/>
					<label
						htmlFor="image-upload"
						className="cursor-pointer flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all"
					>
						{uploading ? (
							<Loader2 className="h-6 w-6 animate-spin" />
						) : (
							<div className="flex flex-col items-center">
								<Upload className="h-6 w-6 mb-2" />
								<span className="text-sm text-gray-600">
									Toque para enviar uma imagem
								</span>
							</div>
						)}
					</label>
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
