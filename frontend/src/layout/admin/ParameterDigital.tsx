import { Card, CardContent, Typography } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import React from "react";

/**
 * Props Interface for ParameterDigital Component
 * Nhận 6 chỉ số thống kê từ AdminDashboard
 */
interface ParameterDigitalProps {
	totalPrice: number;                 // Tổng tiền kiếm được (VND)
	numberOfAccount: number;            // Tổng số tài khoản
	numberOfOrder: number;              // Tổng số đơn hàng
	totalNumberOfBooks: number;         // Tổng số sách
	totalNumberOfFeedbacks: number;     // Tổng số feedback
	totalNumberOfReviews: number;       // Tổng số review
}

/**
 * ParameterDigital Component
 * Hiển thị 6 thẻ (Card) với các chỉ số thống kê chính của dashboard
 * - Nhận 6 số liệu từ props (tính toán ở AdminDashboard)
 * - Hiển thị mỗi chỉ số trên 1 Card riêng
 */
export const ParameterDigital: React.FC<ParameterDigitalProps> = ({
	totalPrice,
	numberOfAccount,
	numberOfOrder,
	totalNumberOfBooks,
	totalNumberOfFeedbacks,
	totalNumberOfReviews,
}: ParameterDigitalProps) => {
	return (
		<div className='conatiner p-4'>
			<div className='shadow-4 rounded p-5 bg-light'>
				<div className='row'>
					{/* ============ CARD 1: TỔNG TIỀN ============ */}
					<div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,

								backgroundColor: "#4db44da3",
							}}
						>
							<CardContent>
								{/* Tiêu đề */}
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG TIỀN KIẾM ĐƯỢC
								</Typography>
								
								{/* Nội dung: Số liệu + Icon */}
								<div className='d-flex align-item-center justify-content-between'>
									{/* Số tiền (format Vietnamese locale: 1000000 -> 1.000.000) */}
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{totalPrice.toLocaleString("vi")} đ
									</Typography>

									{/* Icon tiền */}
									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<PaidOutlinedIcon
												fontSize='large'
												color='success'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					
					{/* ============ CARD 2: TỔNG TÀI KHOẢN ============ */}
					<div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								backgroundColor: "#1976d2a3",
							}}
						>
							<CardContent>
								{/* Tiêu đề */}
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG SỐ TÀI KHOẢN
								</Typography>
								
								{/* Nội dung: Số liệu + Icon */}
								<div className='d-flex align-item-center justify-content-between'>
									{/* Số tài khoản (format Vietnamese) */}
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{numberOfAccount.toLocaleString("vi")}
									</Typography>

									{/* Icon con người */}
									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<PeopleAltOutlinedIcon
												fontSize='large'
												color='primary'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					
					{/* ============ CARD 3: TỔNG HÓA ĐƠN ============ */}
					<div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								backgroundColor: "#757575a3",
							}}
						>
							<CardContent>
								{/* Tiêu đề */}
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG HÓA ĐƠN
								</Typography>
								
								{/* Nội dung: Số liệu + Icon */}
								<div className='d-flex align-item-center justify-content-between'>
									{/* Số đơn hàng (format Vietnamese) */}
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{numberOfOrder.toLocaleString("vi")}
									</Typography>

									{/* Icon giỏ hàng */}
									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<LocalMallOutlinedIcon
												fontSize='large'
												color='action'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					
					{/* ============ CARD 4: TỔNG SỐ SÁCH ============ */}
					<div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								// Màu tím semi-transparent
								backgroundColor: "#9c27b0a3",
							}}
						>
							<CardContent>
								{/* Tiêu đề */}
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG SỐ SÁCH
								</Typography>
								
								{/* Nội dung: Số liệu + Icon */}
								<div className='d-flex align-item-center justify-content-between'>
									{/* Số sách (format Vietnamese) */}
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{totalNumberOfBooks.toLocaleString("vi")}
									</Typography>

									{/* Icon sách */}
									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<MenuBookOutlinedIcon
												fontSize='large'
												color='secondary'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					
					{/* ============ CARD 5: TỔNG FEEDBACK ============ */}
					<div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								// Màu cam semi-transparent
								backgroundColor: "#ed6c02a1",
							}}
						>
							<CardContent>
								{/* Tiêu đề */}
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									PHẢN HỒI
								</Typography>
								
								{/* Nội dung: Số liệu + Icon */}
								<div className='d-flex align-item-center justify-content-between'>
									{/* Số feedback (format Vietnamese) */}
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{totalNumberOfFeedbacks.toLocaleString("vi")}
									</Typography>

									{/* Icon chat/nhận xét */}
									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<ChatOutlinedIcon
												fontSize='large'
												color='warning'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					
					{/* ============ CARD 6: TỔNG REVIEW ============ */}
					<div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								// Màu đỏ semi-transparent
								backgroundColor: "#d32f2fa1",
							}}
						>
							<CardContent>
								{/* Tiêu đề */}
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG ĐÁNH GIÁ 
								</Typography>
								
								{/* Nội dung: Số liệu + Icon */}
								<div className='d-flex align-item-center justify-content-between'>
									{/* Số review (format Vietnamese) */}
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{totalNumberOfReviews.toLocaleString("vi")}
									</Typography>

									{/* Icon đánh giá */}
									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<RateReviewOutlinedIcon
												fontSize='large'
												color='error'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};
