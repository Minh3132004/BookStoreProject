import { endpointBE } from "../layout/utils/Constant";
import GenreModel from "../model/GenreModel";
import { my_request } from "./Request";


//Tạo phương thức lấy thể loại theo yêu cầu 
async function getGenre(endpoint: string): Promise<GenreModel[]> {
   // Gọi phương thức my_request()
   const response = await my_request(endpoint);

   const responeData = response._embedded.genres;

   //Gắn dữ liệu vào mảng
   const genreList = responeData.map((genre: GenreModel) =>
      new GenreModel(
         genre.idGenre,
         genre.nameGenre
      )
   )

   return genreList;
}

//Tạo phương thức lấy tất cả thể loại
export async function getAllGenres(): Promise<GenreModel[]> {
   const endpoint = endpointBE + "/genre?sort=idGenre";

   return getGenre(endpoint);
}

//Tạo phương thức lấy thể loại theo id
export async function get1Genre(idGenre: number): Promise<GenreModel> {
   const endpoint = endpointBE + `/genre/${idGenre}`;

   const response = await my_request(endpoint);

   //Gắn dữ liệu vào genre
   const genre = new GenreModel(
      response.idGenre,
      response.nameGenre
   );

   return genre;
}

//Tạo phương thức lấy thể loại theo id sách
export async function getGenreByIdBook(idBook: number): Promise<GenreModel[]> {
   const endpoint = endpointBE + `/books/${idBook}/listGenres`;

   return getGenre(endpoint);
}