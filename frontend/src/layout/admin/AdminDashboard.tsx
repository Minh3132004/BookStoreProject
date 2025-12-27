import { ParameterDigital } from "./ParameterDigital";
import { Chart } from "./chart/Chart";
import RequireAdmin from "./RequireAdmin";
import { useEffect, useState } from "react";
import { getAllUserRole } from "../../api/UserApi";
import { getAllOrders } from "../../api/OrderApi";
import OrderModel from "../../model/OrderModel";
import { getTotalNumberOfBooks } from "../../api/BookApi";
import { getTotalNumberOfFeedbacks } from "../../api/FeedbackApi";
import { getTotalNumberOfReviews } from "../../api/ReviewApi";
import { Container, Box, CircularProgress, Alert } from "@mui/material";

/**
 * Dashboard Component - Trang tổng quan admin
 * Hiển thị 6 chỉ số thống kê chính và các biểu đồ phân tích
 * - Tính toán các chỉ số (tổng tiền, số account, etc)
 * - Hiển thị loading spinner khi đang tải
 * - Hiển thị error alert nếu có lỗi
 */
const Dashboard = () => {
	// Chỉ số thống kê
	const [totalPrice, setTotalPrice] = useState(0);           // Tổng tiền kiếm được (chỉ từ đơn thành công)
	const [numberOfAccount, setNumberOfAccount] = useState(0); // Tổng số tài khoản trong hệ thống
	const [numberOfOrder, setNumberOfOrder] = useState(0);     // Tổng số đơn hàng
	const [totalNumberOfBooks, setTotalNumberOfBooks] = useState(0); // Tổng số sách
	const [totalNumberOfFeedbacks, setTotalNumberOfFeedbacks] = useState(0); // Tổng số feedback từ khách
	const [totalNumberOfReviews, setTotalNumberOfReviews] = useState(0); // Tổng số review của sách
	const [orders, setOrders] = useState<OrderModel[]>([]);    // Danh sách tất cả đơn hàng (dùng cho chart)
	const [loading, setLoading] = useState(true);              // Trạng thái loading - true khi tải, false khi xong
	const [error, setError] = useState<string | null>(null);   // Thông báo lỗi - null nếu ok, string nếu lỗi

	//EFFECT 1: LẤY TỔNG SỐ TÀI KHOẢN
	/**
	 * Gọi getAllUserRole() để lấy tất cả users
	 * Đếm số lượng users và lưu vào state numberOfAccount
	 * Nếu lỗi: hiển thị thông báo lỗi
	 */
	useEffect(() => {
		getAllUserRole()
			.then((response) => {
				// response là mảng UserModel[]
				// .flat() dùng để làm phẳng mảng (nếu có mảng lồng)
				// .length để đếm số phần tử
				setNumberOfAccount(response.flat().length);
			})
			.catch((error) => {
				console.log("Lỗi lấy users:", error);
				setError("Lỗi khi tải dữ liệu tài khoản");
			});
	}, []); // Dependency rỗng = chạy 1 lần khi mount

	// EFFECT 2: LẤY TỔNG SỐ HÓA ĐƠN VÀ TỔNG TIỀN 
	/**
	 * Gọi getAllOrders() để lấy tất cả đơn hàng
	 * Tính 2 giá trị:
	 * 1. numberOfOrder = tổng số đơn hàng (response.length)
	 * 2. totalPrice = tổng tiền chỉ từ đơn "Thành công" (dùng reduce)
	 */
	useEffect(() => {
		getAllOrders()
			.then((response) => {
				// response là mảng OrderModel[]
				setOrders(response); // Lưu danh sách đơn hàng để dùng cho biểu đồ (Chart component)
				
				// Tính tổng số đơn hàng = độ dài mảy
				const numberOfOrders = response.length;
				setNumberOfOrder(numberOfOrders);
				
				// Tính tổng tiền chỉ từ các đơn hàng "Thành công"
				// reduce((prevValue, order) => {...}, 0) = duyệt từng phần tử, accumulate kết quả
				const totalPriceResponse = response.reduce((prevValue, order) => {
					if (order.status === "Thành công") {
						// Nếu đơn hàng đã thành công, cộng thêm giá trị vào tổng
						return prevValue + order.totalPrice;
					}
					// Nếu không, giữ nguyên tổng cũ
					return prevValue;
				}, 0); // Khởi giá trị = 0
				setTotalPrice(totalPriceResponse);
			})
			.catch((error) => {
				console.log("Lỗi lấy orders:", error);
				setError("Lỗi khi tải dữ liệu đơn hàng");
			});
	}, []);

	// EFFECT 3: LẤY TỔNG SỐ SÁCH
	/**
	 * Gọi getTotalNumberOfBooks()
	 * API trả về: số lượng sách (number)
	 * Lưu vào state totalNumberOfBooks
	 */
	useEffect(() => {
		getTotalNumberOfBooks()
			.then((response) => {
				// response là number - tổng số sách trong DB
				setTotalNumberOfBooks(response);
			})
			.catch((error) => {
				console.log("Lỗi lấy total books:", error);
				setError("Lỗi khi tải dữ liệu sách");
			});
	}, []);

	//  EFFECT 4: LẤY TỔNG SỐ FEEDBACK
	/**
	 * Gọi getTotalNumberOfFeedbacks()
	 * API trả về: số lượng feedback (number)
	 * Lưu vào state totalNumberOfFeedbacks
	 */
	useEffect(() => {
		getTotalNumberOfFeedbacks()
			.then((response) => {
				// response là number - tổng số feedback từ khách
				setTotalNumberOfFeedbacks(response);
			})
			.catch((error) => {
				console.log("Lỗi lấy total feedbacks:", error);
				setError("Lỗi khi tải dữ liệu feedback");
			});
	}, []);

	// EFFECT 5: LẤY TỔNG SỐ REVIEW 
	/**
	 * Gọi getTotalNumberOfReviews()
	 * API trả về: số lượng review (number)
	 * Lưu vào state totalNumberOfReviews
	 * 
	 *  Đây là effect cuối cùng, nên khi xong sẽ setLoading(false)
	 * báo hiệu rằng tất cả dữ liệu đã load xong
	 */
	useEffect(() => {
		getTotalNumberOfReviews()
			.then((response) => {
				// response là number - tổng số review của tất cả sách
				setTotalNumberOfReviews(response);
				// Tất cả API đã được load xong, tắt loading spinner
				setLoading(false);
			})
			.catch((error) => {
				console.log("Lỗi lấy total reviews:", error);
				setError("Lỗi khi tải dữ liệu review");
				setLoading(false); // Tắt loading dù có lỗi
			});
	}, []);

	// RENDER: LOADING STATE 
	/**
	 * Nếu đang loading, hiển thị spinner
	 */
	if (loading) {
		return (
			<Box 
				display="flex" 
				justifyContent="center" 
				alignItems="center" 
				minHeight="100vh"
			>
				<CircularProgress /> {/* Loading spinner */}
			</Box>
		);
	}

	//RENDER: MAIN DASHBOARD 
	/**
	 * Hiển thị dashboard chính
	 * Gồm 2 phần:
	 * 1. ParameterDigital: 6 thẻ thống kê chính
	 * 2. Chart: Biểu đồ phân tích đơn hàng
	 */
	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Hiển thị error alert nếu có lỗi */}
			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
			
			{/* Box 1: 6 thẻ thống kê (ParameterDigital) */}
			<Box sx={{ mb: 4 }}>
				<ParameterDigital
					totalPrice={totalPrice}                    // Tổng tiền
					numberOfAccount={numberOfAccount}          // Tổng tài khoản
					numberOfOrder={numberOfOrder}              // Tổng đơn hàng
					totalNumberOfBooks={totalNumberOfBooks}    // Tổng sách
					totalNumberOfFeedbacks={totalNumberOfFeedbacks} // Tổng feedback
					totalNumberOfReviews={totalNumberOfReviews}     // Tổng review
				/>
			</Box>
			
			{/* Box 2: Biểu đồ phân tích (Chart) */}
			<Box>
				<Chart orders={orders} /> {/* Truyền danh sách đơn hàng để vẽ chart */}
			</Box>
		</Container>
	);
};

const DashboardPage = RequireAdmin(Dashboard);

export default DashboardPage;