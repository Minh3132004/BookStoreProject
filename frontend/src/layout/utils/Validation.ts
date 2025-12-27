import { endpointBE } from "./Constant";

// Hàm check email - kiểm tra format và tồn tại
export const checkExistEmail = async (setErrorEmail: any, email: string) => {
   // Kiểm tra format email trước
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      setErrorEmail("Email không đúng định dạng");
      return true;
   }

   const endpoint = endpointBE + `/users/search/existsByEmail?email=${email}`;
   // Call api
   try {
      // Gửi request
      const response = await fetch(endpoint);
      // Lấy response
      const data = await response.text();
      // Kiểm tra response
      if (data === "true") {
         setErrorEmail("Email đã tồn tại!");
         return true;
      }
      setErrorEmail("");
      return false;
   } catch (error) {
      console.log("Lỗi api khi gọi hàm kiểm tra email");
   }
};

// Hàm check username - kiểm tra độ dài, format và tồn tại
export const checkExistUsername = async (setErrorUsername: any, username: string) => {
   if (username.trim() === "") {
      setErrorUsername("Tên đăng nhập không được để trống");
      return true;
   }
   if (username.trim().length < 8) {
      setErrorUsername("Tên đăng nhập phải chứa ít nhất 8 ký tự");
      return true;
   }
   
   // Kiểm tra format username (chỉ chữ cái, số, dấu gạch dưới)
   const usernameRegex = /^[a-zA-Z0-9_]+$/;
   if (!usernameRegex.test(username.trim())) {
      setErrorUsername("Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới");
      return true;
   }
   
   const endpoint = endpointBE + `/users/search/existsByUsername?username=${username}`;
   // Call api
   try {
      // Gửi request
      const response = await fetch(endpoint);
      // Lấy response
      const data = await response.text();
      // Kiểm tra response
      if (data === "true") {
         setErrorUsername("Username đã tồn tại!");
         return true;
      }
      setErrorUsername("");
      return false;
   } catch (error) {
      console.log("Lỗi api khi gọi hàm kiểm tra username");
   }
};

// Hàm check mật khẩu - kiểm tra format (≥8 ký tự, có chữ và số)
export const checkPassword = (setErrorPassword: any, password: string) => {
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
   if (password.trim() === "") {
      setErrorPassword("Mật khẩu không được để trống");
      return true;
   } else if (!passwordRegex.test(password)) {
      setErrorPassword(
         "Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ và số."
      );
      return true;
   } else {
      setErrorPassword("");
      return false;
   }
};

// Hàm check mật khẩu nhập lại - kiểm tra khớp
export const checkRepeatPassword = (setErrorRepeatPassword: any, repeatPassword: string, password: string) => {
   if (repeatPassword !== password) {
      setErrorRepeatPassword("Mật khẩu không khớp.");
      return true;
   } else {
      setErrorRepeatPassword("");
      return false;
   }
};

// Hàm check số điện thoại - kiểm tra format Vietnam (bắt đầu 0 hoặc 84, tổng 10-11 chữ số)
export const checkPhoneNumber = (setErrorPhoneNumber: any, phoneNumber: string) => {
   const phoneNumberRegex = /^(0[1-9]|84[1-9])[0-9]{8}$/;
   if (phoneNumber.trim() === "") {
      setErrorPhoneNumber("Số điện thoại không được để trống");
      return true;
   } else if (!phoneNumberRegex.test(phoneNumber.trim())) {
      setErrorPhoneNumber("Số điện thoại không đúng.");
      return true;
   } else {
      setErrorPhoneNumber("");
      return false;
   }
};

// ========== HÀM VALIDATE CƠ BẢN (CHỈ KIỂM TRA NGÀY SINH) ==========

//  Kiểm tra ngày sinh (tuổi từ 13-120)
export const validateDateOfBirth = (date: string): boolean => {
    if (!date) return true;
    const birthDate = new Date(date);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return false;
    
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    
    return actualAge >= 13 && actualAge <= 120;
};