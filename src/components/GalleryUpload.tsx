import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { X, Loader2, ImageIcon } from "lucide-react";

interface GalleryImage {
	file: File;
	previewUrl: string;
}

interface GalleryUploadProps {
	onImagesChange: (files: File[]) => void;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ onImagesChange }) => {
	const [uploading, setUploading] = useState(false);
	const [images, setImages] = useState<GalleryImage[]>([]);

	const validateImage = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			if (file.size > 3 * 1024 * 1024) {
				alert("File size must be less than 3MB");
				resolve(false);
				return;
			}

			const img = new Image();
			img.src = URL.createObjectURL(file);

			img.onload = () => {
				URL.revokeObjectURL(img.src);

				if (img.width > 1200 || img.height > 800) {
					alert("Image dimensions must not exceed 1200x800 pixels");
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

			// Create preview URL
			const previewUrl = URL.createObjectURL(file);

			// Add to local state
			const newImages = [...images, { file, previewUrl }];
			setImages(newImages);

			// Notify parent component
			onImagesChange(newImages.map((img) => img.file));
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

	const removeImage = (index: number) => {
		const imageToRemove = images[index];
		URL.revokeObjectURL(imageToRemove.previewUrl);

		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
		onImagesChange(newImages.map((img) => img.file));
	};

	return (
		<div className="space-y-2">
			<Typography variant="small" color="blue-gray" className="font-medium">
				Gallery Images (Optional - Max 5 images)
			</Typography>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
				{images.map((img, index) => (
					<div key={index} className="relative h-[120px]">
						<img
							src={img.previewUrl}
							alt={`Gallery ${index + 1}`}
							className="w-full h-full object-cover rounded-lg"
						/>
						<Button
							color="red"
							variant="text"
							size="sm"
							className="absolute top-1 right-1 p-1"
							onClick={() => removeImage(index)}
						>
							<X size={16} />
						</Button>
					</div>
				))}

				{images.length < 5 && (
					<div className="h-[120px]">
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							disabled={uploading}
							className="hidden"
							id="gallery-upload"
						/>
						<label
							htmlFor="gallery-upload"
							className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all"
						>
							{uploading ? (
								<Loader2 className="h-6 w-6 animate-spin" />
							) : (
								<div className="flex flex-col items-center">
									<ImageIcon className="h-6 w-6 mb-1 text-gray-400" />
									<span className="text-xs text-gray-600 text-center">
										Add Image
									</span>
								</div>
							)}
						</label>
					</div>
				)}
			</div>

			<Typography variant="small" color="gray" className="text-xs">
				Images should not exceed 1200x800px and 3MB
			</Typography>
		</div>
	);
};

export default GalleryUpload;
