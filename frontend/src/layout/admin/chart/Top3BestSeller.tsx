import { useEffect, useState } from "react";
import BookModel from "../../../model/BookModel";
import { get3BestSellerBooks } from "../../../api/BookApi";
import { getAllImageByBook } from "../../../api/ImageApi";
import ImageModel from "../../../model/ImageModel";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Top3BestSeller Component
 * Hiển thị bảng 3 cuốn sách bán chạy nhất với ảnh thumbnail từ Cloudinary
 * - Lấy 3 sách có lượng bán nhiều nhất (từ backend, sắp xếp theo soldQuantity DESC)
 * - Fetch ảnh từ ImageApi (Cloudinary URLs)
 * - Ưu tiên ảnh có thumbnail=true, nếu không có dùng ảnh đầu tiên
 * - Hiển thị trong bảng với link tới chi tiết sách
 * Mỗi Book có thể có nhiều Image, cần gọi getAllImageByBook(bookId)
 */
const Top3BestSeller = () => {

	const [top3BestSeller, setTop3BestSeller] = useState<BookModel[]>([]); // Danh sách 3 sách bán chạy nhất
	const [bookImages, setBookImages] = useState<{ [key: number]: string }>({});   // Map {bookId => Cloudinary URL}
	const [loading, setLoading] = useState(true); // Trạng thái loading

	//  EFFECT: LẤY DỮ LIỆU TOP 3 VÀ ẢNH CLOUDINARY 
	useEffect(() => {
		get3BestSellerBooks()
			.then(async (response: BookModel[]) => {
				// response = mảng BookModel, sắp xếp từ cao xuống thấp theo soldQuantity
				setTop3BestSeller(response);
				
				// Tạo map để lưu {bookId => urlImage}
				const imageMap: { [key: number]: string } = {};
				
				// Duyệt từng cuốn sách để fetch ảnh từ Cloudinary
				for (const book of response) {
					try {
						// Lấy tất cả ảnh của cuốn sách này
						const images = await getAllImageByBook(book.idBook);
						
						// Ưu tiên: tìm ảnh có isThumbnail=true
						// Nếu không có: lấy ảnh đầu tiên trong mảng
						// Nếu mảng rỗng: dùng placeholder
						const thumbnailImage = images.find((img) => img.thumbnail);
						const image = thumbnailImage || images[0];
						
						// Lưu URL từ Cloudinary (image.urlImage), hoặc fallback placeholder
						imageMap[book.idBook] = image?.urlImage || "/images/books/hinh-nen-sach.jpg";
					} catch (error) {
						// Nếu lỗi khi fetch ảnh, dùng placeholder
						console.log("Lỗi khi lấy ảnh:", error);
						imageMap[book.idBook] = "/images/books/hinh-nen-sach.jpg";
					}
				}
				
				// Lưu map vào state
				setBookImages(imageMap);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setLoading(false);
			});
	}, []);
	
	// HELPER FUNCTION 
	/**
	 * Hàm cắt ngắn text
	 * @param text - Văn bản cần cắt
	 * @param limit - Số ký tự tối đa
	 * @returns Text được cắt + "..." nếu vượt quá limit
	 */
	const truncateText = (text: string, limit: number): string => {
		return text.length > limit ? text.substring(0, limit) + "..." : text;
	};
	
	//  RENDER: LOADING STATE 
	if (loading) {
		return <p>Đang tải dữ liệu...</p>;
	}

	//  RENDER: TABLE 
	return (
		<table className='table table-striped table-hover'>
			<thead>
				<tr>
					<th scope='col'>ID</th>
					<th scope='col'>ẢNH</th>
					<th scope='col'>TÊN SÁCH</th>
					<th scope='col'>ĐÃ BÁN</th>
				</tr>
			</thead>
			<tbody>
				{/* Duyệt 3 sách và render 3 hàng */}
				{top3BestSeller.map((book) => {
					return (
						<tr key={book.idBook}>
							{/* Cột 1: ID sách */}
							<th scope='row'>{book.idBook}</th>
							
							{/* Cột 2: ẢNH - Link tới chi tiết sách */}
							<td>
								<Link
									to={`/book/${book.idBook}`}
									className='d-inline text-decoration-none'
								>
									<img 
										// Lấy URL từ map, fallback placeholder
										src={bookImages[book.idBook] || "/images/books/hinh-nen-sach.jpg"}
										alt={book.nameBook}
										width={50}
										height={70}
										// objectFit: 'cover' => ảnh không bị méo, chỉ cắt thừa
										style={{ objectFit: 'cover' }}
									/>
								</Link>
							</td>
							
							{/* Cột 3: TÊN SÁCH - Cắt 25 ký tự, có Tooltip */}
							<td>
								<Tooltip title={book.nameBook} arrow>
									<Link
										to={`/book/${book.idBook}`}
										className='d-inline text-black text-decoration-none'
									>
										{/* Cắt tên nếu >25 ký tự, cộng "..." */}
										{truncateText(book.nameBook || "", 25)}
									</Link>
								</Tooltip>
							</td>
							
							{/* Cột 4: ĐÃ BÁN - Số lượng đã bán */}
							<td>{book.soldQuantity}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default Top3BestSeller;
