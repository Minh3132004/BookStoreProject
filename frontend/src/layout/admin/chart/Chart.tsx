import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import {
	BY_LASTEST_15_DAYS,
	BY_LASTEST_30_DAYS,
	BY_LASTEST_3_DAYS,
	BY_LASTEST_7_DAYS,
	BY_MONTH,
	BY_YEAR,
	formatDate,
} from "./Labels";
import OrderModel from "../../../model/OrderModel";
import Top3BestSeller from "./Top3BestSeller";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Biểu đồ thống kê",
		},
	},
};

interface ChartProps {
	dataTotalPriceOrderByMonth?: number[];
	dataNumberOfOrderOrderByMonth?: number[];
	orders?: OrderModel[];
}

export const Chart: React.FC<ChartProps> = (props) => {
	const [orderByStatistics, setOrderByStatistics] = useState("monthly");
	const [orderByMonthlyOfYear, setOrderByMonthlyOfYear] = useState(
		new Date().getFullYear() + ""
	);
	const [orderByLatestDate, setOrderByLatestDate] = useState("3");
	const [labels, setLabels] = useState(BY_MONTH);
	function handleChangeOrderByStatistics(
		event: SelectChangeEvent<string>
	): void {
		setOrderByStatistics(event.target.value);
		if (event.target.value === "yearly") {
			setLabels(BY_YEAR);
			updateData(event.target.value);
		}
		if (event.target.value === "monthly") {
			setLabels(BY_MONTH);
			updateData(event.target.value, new Date().getFullYear() + "");
		}
		if (event.target.value === "daily") {
			setLabels(BY_LASTEST_3_DAYS);
			setOrderByLatestDate("3");
			updateData(
				event.target.value,
				new Date().getFullYear() + "",
				BY_LASTEST_3_DAYS
			);
		}
	}

	function handleChangeOrderByLastestDate(
		event: SelectChangeEvent<string>
	): void {
		setOrderByLatestDate(event.target.value);
		switch (event.target.value) {
			case "3":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_3_DAYS
				);
				setLabels(BY_LASTEST_3_DAYS);
				break;
			case "7":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_7_DAYS
				);
				setLabels(BY_LASTEST_7_DAYS);
				break;
			case "15":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_15_DAYS
				);
				setLabels(BY_LASTEST_15_DAYS);
				break;
			case "30":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_30_DAYS
				);
				setLabels(BY_LASTEST_30_DAYS);

				break;
			default:
				break;
		}
	}

	function handleChangeOrderByMonthlyOfYear(
		event: SelectChangeEvent<string>
	): void {
		setOrderByMonthlyOfYear(event.target.value);
		updateData(orderByStatistics, event.target.value);
	}

	const dataNumberOfOrder = useRef(new Array(12).fill(0));
	const dataTotalPrice = useRef(new Array(12).fill(0));

	const updateData = useMemo(
		() => (option: string, year?: string, latestDays?: string[]) => {
			switch (option) {
				case "yearly":
					const newDataNumberOfOrder_Yearly = new Array(
						BY_YEAR.length
					).fill(0);
					const newDataTotalPrice_Yearly = new Array(BY_YEAR.length).fill(
						0
					);
					props.orders?.forEach((order) => {
						const orderDate = new Date(order.dateCreated);
						if (order.status === "Thành công") {
							const year = orderDate.getFullYear() + "";

							newDataNumberOfOrder_Yearly[BY_YEAR.indexOf(year)] += 1;
							newDataTotalPrice_Yearly[BY_YEAR.indexOf(year)] +=
								order.totalPrice;
						}
					});
					dataNumberOfOrder.current = newDataNumberOfOrder_Yearly;
					dataTotalPrice.current = newDataTotalPrice_Yearly;
					break;
				case "monthly":
					const newDataNumberOfOrder_Monthly = new Array(12).fill(0);
					const newDataTotalPrice_Monthly = new Array(12).fill(0);
					props.orders?.forEach((order) => {
						const orderDate = new Date(order.dateCreated);
						if (
							order.status === "Thành công" &&
							orderDate.getFullYear() === parseInt(year + "")
						) {
							const month = orderDate.getMonth();

							newDataNumberOfOrder_Monthly[month] += 1;
							newDataTotalPrice_Monthly[month] += order.totalPrice;
						}
					});
					dataNumberOfOrder.current = newDataNumberOfOrder_Monthly;
					dataTotalPrice.current = newDataTotalPrice_Monthly;
					break;
				case "daily":
					console.log(latestDays);

					const newDataNumberOfOrder_Daily = new Array(
						latestDays?.length
					).fill(0);
					const newDataTotalPrice_Daily = new Array(
						latestDays?.length
					).fill(0);
					props.orders?.forEach((order) => {
						const orderDate = new Date(order.dateCreated);
						const orderDateFormatted = formatDate(orderDate);

						if (
							order.status === "Thành công" &&
							latestDays?.includes(orderDateFormatted)
						) {
							newDataNumberOfOrder_Daily[
								latestDays.indexOf(orderDateFormatted)
							] += 1;
							newDataTotalPrice_Daily[
								latestDays.indexOf(orderDateFormatted)
							] += order.totalPrice;
						}
					});
					dataNumberOfOrder.current = newDataNumberOfOrder_Daily;
					dataTotalPrice.current = newDataTotalPrice_Daily;

					break;
				default:
					break;
			}
		},
		[props.orders]
	);

	useEffect(() => {
		updateData(orderByStatistics, orderByMonthlyOfYear);
	}, [orderByMonthlyOfYear, orderByStatistics, updateData]);

	const data = {
		labels,
		datasets: [
			{
				label: "Tổng số đơn hàng (thành công)",
				data: dataNumberOfOrder.current,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
			{
				label: "Tổng số tiền (thành công)",
				data: dataTotalPrice.current,
				borderColor: "rgb(12, 99, 132)",
				backgroundColor: "rgba(12, 99, 132, 0.5)",
			},
		],
	};

	// Xử lý data trạng thái order (tính tỉ lệ % cho biểu đồ)
	const [orderSuccessful, setOrderSuccessful] = useState(0);
	const [orderProcessing, setOrderProcessing] = useState(0);
	const [orderFailure, setOrderFailure] = useState(0);
	const [orderDelivering, setOrderDelivering] = useState(0);

	// ============ EFFECT: LẤY DỮ LIỆU TRẠNG THÁI ĐƠN HÀNG ============
	/**
	 * Duyệt tất cả đơn hàng, đếm số lượng theo từng trạng thái
	 * Lưu vào state (số lượng thực tế, không phải %)
	 */
	useEffect(() => {
		let orderSuccessfulTotal = 0;
		let orderProcessingTotal = 0;
		let orderFailureTotal = 0;
		let orderDeliveringTotal = 0;
		
		// Duyệt từng đơn hàng và đếm theo trạng thái
		props.orders?.forEach((order) => {
			if (order.status === "Thành công") {
				orderSuccessfulTotal++;
			} else if (order.status === "Đang xử lý") {
				orderProcessingTotal++;
			} else if (order.status === "Bị huỷ") {
				orderFailureTotal++;
			} else if (order.status === "Đang giao hàng") {
				orderDeliveringTotal++;
			}
		});
		
		// Lưu số lượng thực tế (không phải %)
		setOrderSuccessful(orderSuccessfulTotal);
		setOrderProcessing(orderProcessingTotal);
		setOrderFailure(orderFailureTotal);
		setOrderDelivering(orderDeliveringTotal);
	}, [props.orders]);

	return (
		<div className='conatiner p-4 '>
			<div className='row'>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='shadow-4 rounded py-5 mb-5 bg-light'>
						<h4 className='text-black text-center mb-3 pb-3'>
							Biểu đồ thống kê trạng thái đơn hàng
							<hr />
						</h4>
						<div className='d-flex justify-content-center'>
							<Doughnut
								data={{
									labels: ["Đơn thành công", "Đơn bị huỷ", "Đơn đang xử lý", "Đơn đang giao"],
									datasets: [
										{
											label: "Số đơn hàng",
											data: [orderSuccessful, orderFailure, orderProcessing, orderDelivering],
											backgroundColor: [
												"#4db44d",
												"#e03c3c",
												"#4e4ee6",
												"#e1e13d",
											],
											borderColor: [
												"#3d9d3d",
												"#cc0000",
												"#3d3dcc",
												"#cccc00",
											],
											borderWidth: 2,
										},
									],
								}}
								options={{
									responsive: true,
									maintainAspectRatio: true,
									plugins: {
										legend: {
											position: "bottom" as const,
										},
										// Tooltip: Hiển thị số lượng + % khi hover
										tooltip: {
											callbacks: {
												label: function(context: any) {
													// Lấy số lượng (value)
													const value = context.parsed || 0;
													// Tính tổng để tính %
													const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
													const percentage = ((value / total) * 100).toFixed(1);
													// Hiển thị: "Số đơn hàng: 15 (25.0%)"
													return `${context.label}: ${value} đơn (${percentage}%)`;
												}
											}
										},
									},
								}}
								width={300}
								height={250}
							/>
						</div>
					</div>
				</div>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='shadow-4 rounded p-5 mb-5 bg-light'>
						<h4 className='text-black text-center mb-3'>
							Top 3 cuốn sách được mua nhiều nhất
							<hr />
						</h4>

						<Top3BestSeller />
					</div>
				</div>
			</div>
			<div className='shadow-4 rounded p-5 d-flex align-items-end flex-column bg-light'>
				<div className='d-flex'>
					<FormControl sx={{ m: 1, minWidth: 170 }} size='small'>
						<InputLabel id='demo-select-small-label'>
							Thống kê theo
						</InputLabel>
						<Select
							labelId='demo-select-small-label'
							id='demo-select-small'
							value={orderByStatistics}
							label='Thống kê theo'
							onChange={handleChangeOrderByStatistics}
						>
							<MenuItem value={"yearly"}>Hàng năm</MenuItem>
							<MenuItem value={"monthly"}>Hàng tháng</MenuItem>
							<MenuItem value={"daily"}>Hàng ngày</MenuItem>
						</Select>
					</FormControl>
					{orderByStatistics === "daily" && (
						<FormControl sx={{ m: 1, minWidth: 170 }} size='small'>
							<InputLabel id='demo-select-small-label'>
								Lọc theo
							</InputLabel>
							<Select
								labelId='demo-select-small-label'
								id='demo-select-small'
								value={orderByLatestDate}
								label='Lọc theo'
								onChange={handleChangeOrderByLastestDate}
							>
								<MenuItem value={"3"}>3 ngày gần đây</MenuItem>
								<MenuItem value={"7"}>7 ngày gần đây</MenuItem>
								<MenuItem value={"15"}>15 ngày gần đây</MenuItem>
								<MenuItem value={"30"}>30 ngày gần đây</MenuItem>
							</Select>
						</FormControl>
					)}
					{orderByStatistics === "monthly" && (
						<FormControl sx={{ m: 1, minWidth: 170 }} size='small'>
							<InputLabel id='demo-select-small-label'>Năm</InputLabel>
							<Select
								labelId='demo-select-small-label'
								id='demo-select-small'
								value={orderByMonthlyOfYear}
								label='Năm'
								onChange={handleChangeOrderByMonthlyOfYear}
							>
								{BY_YEAR.map((year) => (
									<MenuItem key={year} value={`${year}`}>
										{year}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</div>
				<Line options={options} data={data} />
			</div>
		</div>
	);
};
