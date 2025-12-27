//Sử dụng thư viện jwt-decode để giúp decode token 
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "./JwtPayload";
import { useNavigate } from "react-router-dom";


//Kiểm tra token có tồn tại không 
export function isToken() {
   const token = localStorage.getItem('token');
   if (token) {
      return true;
   }
   return false;
}

// Kiểm tra token có hết hạn không
export function isTokenExpired(token: string) {
   const decodedToken = jwtDecode(token);

   if (!decodedToken.exp) {
      // Token không có thời gian hết hạn (exp)
      return false;
   }

   const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

   return currentTime < decodedToken.exp;
}

// Lấy avatar từ token
export function getAvatarByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload ;
      return decodedToken.avatar;
   }
}

// Lấy lastName từ token
export function getLastNameByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      //as JwtPayload đây là type assertion giúp thông báo cho typescript biết rằng decodedToken có các thuộc tính như trong interface JwtPayload
      const decodedToken = jwtDecode(token) as JwtPayload ;
      return decodedToken.lastName;
   }
}

// Lấy username từ token
export function getUsernameByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      return jwtDecode(token).sub;
   }
}

// Lấy idUser từ token
export function getIdUserByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload ;
      return decodedToken.id;
   }
}

// Lấy role từ token
export function getRoleByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload ;
      return decodedToken.role;
   }
}

//Đăng xuất cho user
export function logout(navigate : any) {
   navigate("/login");
   localStorage.removeItem('token');
}