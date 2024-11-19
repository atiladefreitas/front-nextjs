import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Typography, Button } from "@material-tailwind/react";
import { X } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface CouponGalleryProps {
	galleryImages: string[];
	onImagesChange: (urls: string[]) => void;
	bannerUrl: string;
	onBannerChange: (url: string) => void;
}

const CouponGallery: React.FC<CouponGalleryProps> = ({
	galleryImages,
	onImagesChange,
	bannerUrl,
	onBannerChange,
}) => {
	const supabase = useSupabaseClient();

	const handleGalleryUpload = (url: string) => {
		onImagesChange([...galleryImages, url]);
	};

	const removeImage = (urlToRemove: string) => {
		onImagesChange(galleryImages.filter((url) => url !== urlToRemove));
	};

	return (
		<div className="space-y-6">
			{/* Banner Upload */}
			<div>
				<Typography variant="h6" color="blue-gray" className="mb-2">
					Coupon Banner (600x400)
				</Typography>
				<ImageUpload
					bucketName="coupons"
					path={`banners/${new Date().getTime()}`}
					onUploadComplete={onBannerChange}
					maxSize={5}
					maxWidth={600}
					maxHeight={400}
					aspectRatio={1.5} // 600/400
				/>
			</div>

			{/* Gallery Upload */}
			<div>
				<Typography variant="h6" color="blue-gray" className="mb-2">
					Gallery Images (Max 5)
				</Typography>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{galleryImages.map((url, index) => (
						<div key={index} className="relative">
							<img
								src={url}
								alt={`Gallery ${index + 1}`}
								className="w-full h-32 object-cover rounded-lg"
							/>
							<Button
								color="red"
								variant="text"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => removeImage(url)}
							>
								<X size={20} />
							</Button>
						</div>
					))}
					{galleryImages.length < 5 && (
						<ImageUpload
							bucketName="coupons"
							path={`gallery/${new Date().getTime()}`}
							onUploadComplete={handleGalleryUpload}
							maxSize={3}
							maxWidth={800}
							maxHeight={600}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default CouponGallery;
