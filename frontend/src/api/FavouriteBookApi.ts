import { endpointBE } from "../layout/utils/Constant";
import { my_request } from "./Request";

//Lấy danh sách sách yêu thích của người dùng
export async function getFavoriteBooksByUser(idUser: number | undefined) {
    const endpoint = `${endpointBE}/favorite-book/get-favorite-book/${idUser}`;
    const response = await my_request(endpoint);  
    return response;   
}

//Thêm sách vào danh sách yêu thích
export async function addFavoriteBook(idUser: number, idBook: number) {
    const endpoint = `${endpointBE}/favorite-book/add-book`;
    
    const requestBody = {
        idUser: idUser,
        idBook: idBook
    };

    const response = await my_request(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    return response;
}

//Xóa sách khỏi danh sách yêu thích
export async function removeFavoriteBook(idUser: number, idBook: number) {
    const endpoint = `${endpointBE}/favorite-book/remove-book`;
    
    const requestBody = {
        idUser: idUser,
        idBook: idBook
    };

    const response = await my_request(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    return response;
}