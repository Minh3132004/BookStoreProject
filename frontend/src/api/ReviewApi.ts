import { endpointBE } from "../layout/utils/Constant";
import ReviewModel from "../model/ReviewModel";
import { my_request } from "./Request";

// Hàm lấy danh sách review
async function getReview(endPoint: string) : Promise<ReviewModel[]>  {
    const response = await my_request(endPoint);
    const responseData = response._embedded.reviews;

    const reviewList = responseData.map((review: ReviewModel) => {
        return new ReviewModel(
            review.idReview,
            review.content,
            review.ratingPoint,
            review.timestamp
        );
    });
    
    return reviewList;
}

// Hàm lấy danh sách review theo id sách
export function getReviewByIdBook(idBook: number) : Promise<ReviewModel[]>  {
    const endPoint = endpointBE + `/books/${idBook}/listReviews`;
    return getReview(endPoint);
}

// Hàm lấy tổng số review
export async function getTotalNumberOfReviews(): Promise<number> {
    try {
        const endPoint = endpointBE + "/reviews?size=1"; // Chỉ lấy 1 item để có page metadata
        const response = await my_request(endPoint);
        return response.page?.totalElements || 0;
    } catch (error) {
        console.error("Error fetching total number of reviews:", error);
        return 0;
    }
}
