import { endpointBE } from "../layout/utils/Constant";
import BookModel from "../model/BookModel";
import { my_request } from "./Request";

// Tạo ra các biến trả về
interface resultInterface {
   bookList: BookModel[];
   totalElements: number;
   totalPages: number;
   size: number;
}

// Tạo phương thức lấy sách 
async function getBook(endpoint: string): Promise<resultInterface> {
   // Gọi phương thức request()
   const response = await my_request(endpoint);

   const responseData = response._embedded.books;

   // Lấy ra thông tin trang
   const totalPages: number = response.page.totalPages;
   const totalElements: number = response.page.totalElements;
   const size = response.page.size;

   const bookList: BookModel[] = responseData.map((book: BookModel) =>
      new BookModel(
         book.idBook,
         book.nameBook,
         book.author,
         book.description,
         book.listPrice,
         book.sellPrice,
         book.quantity,
         book.avgRating,
         book.soldQuantity,
         book.discountPercent
      )
   );

   console.log(bookList);

   return { bookList, totalPages, size, totalElements };
}

// Tạo phương thức lấy sách bán chạy
export async function getHotBook(): Promise<resultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/books?sort=soldQuantity,desc&sort=avgRating,desc&size=4";

   return getBook(endpoint);
}

//Tạo phương thức lấy sách mới
export async function getNewBook(): Promise<resultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/books?sort=idBook,desc&size=4";

   return getBook(endpoint);
}

//Tạo phương thức lấy tất cả các sách 
export async function getAllBook(size?: number, page?: number): Promise<resultInterface> {
   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   // Xác định endpoint
   const endpoint: string = endpointBE + `/books?sort=soldQuantity,desc&sort=idBook,asc&size=${size}&page=${page}`;

   return getBook(endpoint);
}

//Tạo phương thức tìm kiếm sách .
export async function searchBook(idGenre?: number, keySearch?: string, size?: number, page?: number): Promise<resultInterface> {

   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   // Nếu không truyền page thì mặc định là 0
   if (page === undefined) {
      page = 0;
   }

   // Xác định endpoint

   let endpoint: string;

   //Tìm bởi thể loại
   if (keySearch === "" && idGenre !== undefined) {
      endpoint = endpointBE + `/books/search/findByListGenres_idGenre?sort=idBook,desc&size=${size}&page=${page}&idGenre=${idGenre}`;
   }

   //Tìm bởi tên sách
   else if (keySearch !== "" && idGenre === undefined) {
      endpoint = endpointBE + `/books/search/findByNameBookContaining?sort=idBook,desc&size=${size}&page=${page}&nameBook=${keySearch}`;
   }

   //Tìm bởi cả tên sách và thể loại
   else if (keySearch != "" && idGenre !== undefined) {
      endpoint = endpointBE + `/books/search/findByNameBookContainingAndListGenres_idGenre?sort=idBook,desc&size=${size}&page=${page}&nameBook=${keySearch}&idGenre=${idGenre}`;
   }

   //Nếu không thuộc trường hợp nào thì sẽ lấy tất cả sách
   else {
      endpoint = endpointBE + `/books?sort=idBook,desc&size=${size}&page=${page}`;
   }

   return getBook(endpoint);
}

// Tạo phương thức lấy sách theo mã sách
export async function getBookById(idBook: number): Promise<BookModel> {
   // Xác định endpoint
   const endpoint: string = endpointBE + `/books/${idBook}`;

   // Gọi phương thức request()
   const response = await my_request(endpoint);

   // Lấy ra thông tin sách
   const book: BookModel = new BookModel(
      response.idBook,
      response.nameBook,
      response.author,
      response.description,
      response.listPrice,
      response.sellPrice,
      response.quantity,
      response.avgRating,
      response.soldQuantity,
      response.discountPercent
   );

   return book;
}

// Tạo phương thức lấy sách theo mã sách trong giỏ hàng
export async function getBookByIdCartItem(idCart: number): Promise<BookModel | null> {
   const endpoint = endpointBE + `/cart-items/${idCart}/book`;

   try {
      const response = await my_request(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {

         const book: BookModel = new BookModel(
            response.idBook,
            response.nameBook,
            response.author,
            response.description,
            response.listPrice,
            response.sellPrice,
            response.quantity,
            response.avgRating,
            response.soldQuantity,
            response.discountPercent
         );

         return book;
      } else {
         throw new Error("Sách không tồn tại");
      }

   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

// Cập nhật thông tin sách
export async function updateBook(book: BookModel): Promise<BookModel> {
   const endpoint = `${endpointBE}/books/update`;
   const token = localStorage.getItem('token');

   const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(book)
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Lỗi khi cập nhật sách');
   }

   return response.json();
}

//Lấy sách theo mã chi tiết đơn hàng
export async function getBookByIdOrderDetail(idOrderDetail: number): Promise<BookModel> {
   const endpoint = endpointBE + `/order-detail/${idOrderDetail}/book`;
   const response = await my_request(endpoint);
   const book: BookModel = new BookModel(
      response.idBook,
      response.nameBook,
      response.author,
      response.description,
      response.listPrice,
      response.sellPrice,
      response.quantity,
      response.avgRating,
      response.soldQuantity,
      response.discountPercent
   );
   return book;
}

// Hàm lấy tổng số sách
export async function getTotalNumberOfBooks(): Promise<number> {
   try {
      const endPoint = endpointBE + "/books?size=1"; // Chỉ lấy 1 item để có page metadata
      const response = await my_request(endPoint);
      return response.page?.totalElements || 0;
   } catch (error) {
      console.error("Error fetching total number of books:", error);
      return 0;
   }
}

// Hàm lấy 3 sách bán chạy nhất
export async function get3BestSellerBooks(): Promise<BookModel[]> {
   try {
      const endpoint: string = endpointBE + "/books?sort=soldQuantity,desc&size=3";
      const result = await getBook(endpoint);
      return result.bookList;
   } catch (error) {
      console.error("Error fetching best seller books:", error);
      return [];
   }
}

// Hàm lấy số lượng sách theo genre ID
export async function getBookCountByGenreId(genreId: number): Promise<number> {
   try {
      const endpoint = endpointBE + `/genre/${genreId}/listBooks`;
      const response = await my_request(endpoint);
      const responseData: BookModel[] = await Promise.all(response._embedded.books.map(async (book: any) =>
         new BookModel(
            book.idBook,
            book.nameBook,
            book.author,
            book.description,
            book.listPrice,
            book.sellPrice,
            book.quantity,
            book.avgRating,
            book.soldQuantity,
            book.discountPercent
         )
      ));
      return responseData.length;
   } catch (error) {
      console.error("Error fetching book count by genre:", error);
      return 0;
   }
}

