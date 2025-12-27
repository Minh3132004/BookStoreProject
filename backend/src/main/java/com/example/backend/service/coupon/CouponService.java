package com.example.backend.service.coupon;

import org.springframework.http.ResponseEntity;
import com.example.backend.dto.CouponDTO;

public interface CouponService {
    ResponseEntity<?> validateCoupon(String code);

    ResponseEntity<?> createCoupon(int quantity, CouponDTO couponDTO);

    ResponseEntity<?> deleteCoupon(int id);

    ResponseEntity<?> updateActiveCoupon(int id, CouponDTO couponDTO);

    ResponseEntity<?> updateUsedCoupon(String code);

}