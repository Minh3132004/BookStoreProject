import React from "react";
import "../utils/Pagination.css";

interface PaginationInterface {
	currentPage: number;  //Trang hiện tại
	totalPages: number; //Tổng số trang
	handlePagination: any; //Phương thức thay đổi trang
}

const Pagination: React.FC<PaginationInterface> = (props) => {
	const showListPage = []; //Mảng chứa các trang cần hiển thị

	//Trường hợp 1 : Đang ở trang đầu tiên
	if (props.currentPage === 1) {
		// Thêm trang hiện tại vào
		showListPage.push(props.currentPage); //Thêm trang 1

		// Nếu có trang 2 thì thêm vào
		if (props.totalPages >= 2) {
			showListPage.push(props.currentPage + 1); //Thêm trang 2
		}

		// Nếu có trang 3 thì thêm vào
		if (props.totalPages >= 3) {
			showListPage.push(props.currentPage + 2); //Thêm trang 3
		}
	} else if (props.currentPage > 1) { //Đang ở trang giữa (currentPage > 1) 
		// Trang - 2
		if (props.currentPage >= 3) {
			// Thêm trang đằng sau vào
			showListPage.push(props.currentPage - 2);
		}

		// Trang - 1
		if (props.currentPage >= 2) {
			// Thêm trang đăng sau vào
			showListPage.push(props.currentPage - 1);
		}

		// Trang hiện tại
		showListPage.push(props.currentPage);

		// Trang + 1
		if (props.currentPage + 1 <= props.totalPages) {
			// Thêm trang đằng trước vào
			showListPage.push(props.currentPage + 1);
		}

		// Trang + 2
		if (props.currentPage + 2 <= props.totalPages) {
			// Thêm trang đằng trước vào
			showListPage.push(props.currentPage + 2);
		}
	}

	return (
		<nav aria-label='Page navigation example' className='mt-5 fs-5'>
			<ul className='pagination justify-content-center'>
				<li
					//Kiểm tra xem có phải trang 1 không (nếu đúng thì disabled không cho click, không đúng thì cho click)
					className={
						"page-item " + (props.currentPage === 1 ? "disabled" : "")
					}
					onClick={
						//Nếu trang hiện tại là 1 thì không làm gì cả , không đúng thì cho phép gọi phương thức thay đổi trang (bấm nút Previous)
						props.currentPage === 1
							? () => { }
							: () => props.handlePagination(props.currentPage - 1)
					}
				>
					<button className='page-link'>
						Previous
					</button>
				</li>
				{/* Nếu đang ở trang 4 hoặc lớn hơn */}
				{props.currentPage >= 4 && (
					<>
						{/* Hiển thị nút để chuyển đến trang đầu tiên */}
						<li
							className='page-item'
							onClick={() => props.handlePagination(1)}
						>
							<button className='page-link'>1</button>
						</li>
						{/* Hiển thị dấu ... */}
						<li className='page-item'>
							<button className='page-link'>...</button>
						</li>
					</>
				)}

				{/* Hiện các trang tiếp theo */}
				{showListPage.map((pageNumber) => (
					<li
						// Nếu đang ở trang hiện tại thì highlight 

						className={
							"page-item" +
							(props.currentPage === pageNumber ? " actived" : "")
						}
						key={pageNumber}
						// Khi click vào trang nào thì sẽ gọi handlePagination cho trang đó

						onClick={() => props.handlePagination(pageNumber)}
					>
						{/* Hiển thị số trang */}

						<button className='page-link'>{pageNumber}</button>
					</li>
				))}

				{/* Hiện trang cuối cùng */}
				{props.currentPage < props.totalPages - 2 && (
					<>
						{/* Hiển thị dấu ... */}
						<li className='page-item'>
							<button className='page-link'>...</button>
						</li>
						{/* Hiển thị nút để chuyển đến trang cuối cùng */}
						<li
							className='page-item'
							//Khi click vào trang cuối cùng thì sẽ gọi handlePagination cho trang cuối cùng
							onClick={() => props.handlePagination(props.totalPages)}
						>
							{/* Hiển thị số trang cuối cùng */}
							<button className='page-link'>{props.totalPages}</button>
						</li>
					</>
				)}
				<li
					// Nếu đang ở trang cuối cùng thì disabled

					className={
						"page-item " +
						(props.totalPages === props.currentPage ? "disabled" : "")
					}
					//Nếu trang hiện tại là cuối cùng thì không làm gì cả , không đúng thì cho phép gọi phương thức thay đổi trang (bấm nút Next)

					onClick={
						props.totalPages === props.currentPage
							? () => { }
							: () => props.handlePagination(props.currentPage + 1)
					}
				>
					<button className='page-link'>Next</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
