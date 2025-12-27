import Rating from "@mui/material/Rating";
import React from "react";

interface RatingStarProps {
	readonly?: boolean;
	ratingPoint?: number;
}

const RatingStar: React.FC<RatingStarProps> = (props) => {
	const [value, setValue] = React.useState<number | null>(
		props.ratingPoint || 0
	);


	// Xử lý khi thay đổi rating
	const handleChangeRating = (event: React.SyntheticEvent, newValue: number | null) => {
		setValue(newValue);
	};

	return (
		<Rating
			name='half-rating'	
			value={value}
			precision={0.5}
			onChange={handleChangeRating}
			readOnly={props.readonly}
			size='small'
		/>
	);
};

export default RatingStar;
