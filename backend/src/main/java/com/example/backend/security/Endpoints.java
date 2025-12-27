package com.example.backend.security;

public class Endpoints {

        public static final String font_end_host = "http://localhost:3000";

        // Phương thức GET không cần xác thực
        public static final String[] PUBLIC_GET = {
                        "/user/**",
                        "/user/authenticate",
                        "/user/register",
                        "/user/active-account",
                        "/books",
                        "/books/**",
                        "/users/**",
                        "/genre/**",
                        "/reviews/**",
                        "/favorite-book/**",
                        "/favorite-books/**",
                        "/cart-items/**",
                        "/orders/**",
                        "/deliveries/**",
                        "/order-detail/**",
                        "/coupons",
                        "/images/**",
                        "/feedbacks/**",
                        "/feedbacks"
        };

        // Phương thức POST không cần xác thực
        public static final String[] PUBLIC_POST = {
                        "/user/register",
                        "/user/authenticate",
                        "/favorite-book/**"
        };

        // Phương thức PUT không cần xác thực
        public static final String[] PUBLIC_PUT = {
                        "/user/forgot-password",
                        "/user/change-avatar",
                        "/order/**",
                        "/coupon/**"
        };

        // Phương thức DELETE không cần xác thực
        public static final String[] PUBLIC_DELETE = {
                        "/favorite-book/**",
        };

        // Phương thức ADMIN_ENDPOINT cần xác thực quyền ADMIN
        // Các endpoint này chỉ cho phép người dùng có role ADMIN truy cập
        // Frontend phải gửi kèm JWT token trong header Authorization để xác thực
        public static final String[] ADMIN_ENDPOINT = {
                        "/user/add-user",
                        "/user/*/update-by-admin",
                        "/books",
                        "/books/**",
                        "/users/**",
                        "/genre/**",
                        "/coupon/**",
                        "/feedbacks/**",
                        "/feedbacks"

        };

        // Phương thức CUSTOMER_ENDPOINT cần xác thực quyền CUSTOMER
        public static final String[] CUSTOMER_ENDPOINT = {
                        "/feedback/add-feedback"
        };
}