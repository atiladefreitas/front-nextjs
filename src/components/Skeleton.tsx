import React from "react";
import { Card, Typography } from "@material-tailwind/react";

interface CouponSkeletonProps {
	count?: number;
}

const CouponSkeleton: React.FC<CouponSkeletonProps> = ({ count = 3 }) => {
	return (
		<>
			{[...Array(count)].map((_, index) => (
				<Card key={index} className="p-4 mb-4 animate-pulse">
					<div className="flex justify-between items-start">
						<div className="w-3/4">
							<div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
						<div className="h-6 bg-gray-300 rounded w-1/5"></div>
					</div>
					<div className="mt-4 space-y-2">
						<div className="h-4 bg-gray-200 rounded w-full"></div>
						<div className="h-4 bg-gray-200 rounded w-5/6"></div>
						<div className="h-4 bg-gray-200 rounded w-4/6"></div>
					</div>
					<div className="flex gap-4 items-center mt-4">
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					</div>
				</Card>
			))}
		</>
	);
};

export default CouponSkeleton;
