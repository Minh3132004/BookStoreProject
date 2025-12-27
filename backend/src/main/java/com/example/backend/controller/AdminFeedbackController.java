package com.example.backend.controller;

import com.example.backend.dto.FeedbackResponse;
import com.example.backend.entity.Feedbacks;
import com.example.backend.service.feedback.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/feedback") // 1. Đường dẫn chung cho Admin
// 2. Tự động được bảo vệ: Vì đường dẫn này không có trong
//    danh sách PUBLIC, nó sẽ tự động yêu cầu quyền ADMIN.
public class AdminFeedbackController {

    @Autowired
    private FeedbackService feedbackService; // Tiêm (Inject) Interface Service

    /**
     * API 1: Lấy danh sách Feedback (có phân trang)
     gọi: GET /api/admin/feedback?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<FeedbackResponse>> getAllFeedback( // <--- SỬA KIỂU TRẢ VỀ Ở ĐÂY
                                                                  @PageableDefault(size = 10, sort = "dateCreated",
                                                                          direction = org.springframework.data.domain.Sort.Direction.DESC)
                                                                  Pageable pageable) {

        Page<FeedbackResponse> feedbackPage = feedbackService.getAllFeedback(pageable);
        return ResponseEntity.ok(feedbackPage); // Trả về 200 OK + danh sách có username
    }

    /**
     * API 2: Đánh dấu là "Đã đọc" (Đây chính là hàm update bạn vừa xóa)
     gọi: PUT /api/admin/feedback/1/read (với 1 là id_feedback)
     */
    @PutMapping("/{idFeedback}/read")
    public ResponseEntity<?> markFeedbackAsRead(@PathVariable int idFeedback) {
        try {
            // Gọi hàm service bạn vừa viết
            feedbackService.markFeedbackAsRead(idFeedback);
            return ResponseEntity.ok("Đã đánh dấu là đã đọc."); // Trả về 200 OK
        } catch (Exception e) {
            // Bắt lỗi (ví dụ: "Không tìm thấy feedback") mà Service ném ra
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * API 3: Xóa một Feedback
     gọi: DELETE /api/admin/feedback/1
     */
    @DeleteMapping("/{idFeedback}")
    public ResponseEntity<?> deleteFeedback(@PathVariable int idFeedback) {
        try {
            // Gọi hàm service bạn vừa viết
            feedbackService.deleteFeedback(idFeedback);
            return ResponseEntity.ok("Đã xóa feedback thành công."); // Trả về 200 OK
        } catch (Exception e) {
            // Bắt lỗi (ví dụ: "Không tìm thấy feedback") mà Service ném ra
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * API 4: Lấy số lượng feedback chưa đọc
     * Gọi: GET /api/admin/feedback/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadFeedbackCount() {
        long count = feedbackService.getUnreadFeedbackCount();
        return ResponseEntity.ok(count);
    }
}