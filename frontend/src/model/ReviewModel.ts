class ReviewModel {
   idReview: number;
   content: string;
   ratingPoint: number;
   timestamp: string;

   constructor(idReview: number,
      content: string,
      ratingPoint: number,
      timestamp: string) {
      this.idReview = idReview;
      this.content = content;
      this.ratingPoint = ratingPoint;
      this.timestamp = timestamp;
   }
}

export default ReviewModel;