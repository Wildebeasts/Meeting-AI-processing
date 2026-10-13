# Meeting AI Processing MVP — Trí Tuệ Cuộc Họp

> **Mission 2: Hiện thực hóa (MVP / Prototype)**  
> Biến nội dung cuộc họp thành dữ liệu có cấu trúc phục vụ công việc, quy trình và kho tri thức doanh nghiệp.  
> Chứng minh phần quan trọng nhất: **Hiểu diễn biến cuộc họp, xử lý thay đổi phương án (Terminal Consensus), trích xuất dữ liệu có cấu trúc và liên kết bằng chứng đối soát (Click-to-Verify).**

---

## 1. Giới thiệu bài toán & Mục tiêu MVP

Trong các cuộc họp kỹ thuật và điều hành, thảo luận diễn ra phi tuyến tính: ý kiến ban đầu thường xuyên bị thay đổi, phản biện và chốt lại ở cuối buổi.
Các giải pháp tóm tắt văn bản thông thường (Passive Text Summarization) thường thất bại vì:
1. **Mất dấu quyết định cuối cùng:** Gom cả ý kiến đề xuất ban đầu lẫn quyết định bị bác bỏ vào một chỗ.
2. **Hành động không rõ trách nhiệm:** Nhầm lẫn giữa gợi ý bộc phát và cam kết thực thi.
3. **Thiếu khả năng đối soát (Zero Grounding):** Không liên kết được về đúng mốc thời gian phát ngôn, khiến người dùng mất 20–30 phút nghe lại để kiểm tra.

### Giả thuyết cốt lõi được chứng minh trong MVP:
> **"Nếu AI hiểu được dòng thời gian đồng thuận (Terminal Consensus), tách bạch phương án bị loại (Rejected Alternatives) và liên kết từng đầu việc với mốc thời gian gốc (Click-to-Verify) trong giao diện 2 cột, thời gian rà soát và phê duyệt sau họp của PM/Tech Lead sẽ giảm từ 30 phút xuống dưới 60 giây mà không bị sót hoặc sai dữ liệu."**

---

## 2. Các tính năng cốt lõi đã hiện thực hóa

- **Cấu trúc 2 cột tương tác chuẩn Stitch AI:**
  - **Cột trái (Master Transcript):** Hiển thị hội thoại gốc theo lượt người nói, kèm mốc thời gian `[MM:SS]`, bộ lọc người nói (Alex, Lan, Nam, Sarah...), tìm kiếm từ khóa và thanh mô phỏng Audio Scrubber.
  - **Cột phải (Structured Intelligence):**
    - **Quyết định (Key Decisions):** Hiển thị quyết định cuối cùng, huy hiệu đồng thuận (`Terminal Consensus`), mức độ ảnh hưởng, và đặc biệt là **Danh mục phương án thảo luận ban đầu bị loại bỏ (Rejected Alternatives)** kèm lý do loại trừ.
    - **Việc cần làm (Action Items):** Nhiệm vụ cụ thể, người nhận việc, hạn chót và nút **Phê duyệt 1-Click (1-Click Verify)**.
    - **Vấn đề chưa chốt (Open Issues / Blockers):** Ghi nhận các thảo luận bế tắc hoặc hoãn lại, ngăn chặn AI tự ý suy diễn (Anti-hallucination).
- **Cơ chế Đối soát Tức thì (Click-to-Verify):** Bấm vào bất kỳ trích dẫn nào ở cột phải, cột transcript bên trái sẽ tự động cuộn đến đúng câu nói gốc và nhấp nháy hiệu ứng làm nổi bật (Highlight pulse).
- **Bộ 5 Tình Huống Kiểm Thử (Test Bench Modal):** Tích hợp sẵn bộ test đầy đủ các trường hợp: Thành công, Dữ liệu khó/mơ hồ, và Thất bại.
- **Tùy chọn LLM đa dạng:** Chạy 100% tự động ngoại tuyến thông qua bộ máy suy luận cục bộ, hoặc tích hợp trực tiếp Google Gemini API qua modal cài đặt key an toàn trên trình duyệt.
- **Xuất dữ liệu chuẩn (Export):** Hỗ trợ xuất Pydantic JSON Schema (sẵn sàng tích hợp Jira/Slack) hoặc Markdown Report.

---

## 3. Hướng dẫn cài đặt & Chạy ứng dụng (Quickstart)

Dự án được xây dựng bằng **Vite**, **React**, và **TailwindCSS**, tối ưu tốc độ và không yêu cầu backend phức tạp.

### Yêu cầu môi trường:
- Node.js >= 18.x (hoặc Bun / pnpm)

### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/meeting-ai-processing-mvp.git
cd meeting-ai-processing-mvp
```

### Bước 2: Cài đặt thư viện phụ thuộc
Sử dụng một trong các công cụ quản lý gói sau:
```bash
# Bằng pnpm (khuyên dùng):
pnpm install

# Hoặc bằng npm:
npm install

# Hoặc bằng bun:
bun install
```

### Bước 3: Chạy ứng dụng tại môi trường phát triển (Local Dev)
```bash
pnpm run dev
# hoặc: npm run dev
```
Mở trình duyệt tại: `http://localhost:5173`

### Bước 4: Đóng gói bản Production (Build)
```bash
pnpm run build
pnpm run preview
```

> **Lưu ý bảo mật:** Dự án **KHÔNG CHỨA** API key, mật khẩu hoặc dữ liệu nhạy cảm. Người dùng có thể chạy hoàn toàn ngoại tuyến với bộ 5 test case có sẵn, hoặc tự nhập Gemini API key cá nhân trong modal của giao diện (chỉ lưu trên LocalStorage trình duyệt).

---

## 4. Bộ Kiểm Thử Mission 2 (5 Test Cases)

| Mã test | Loại tình huống | Tên tình huống | Trạng thái |
| :--- | :--- | :--- | :--- |
| **TC-01** | **Làm tốt (Success)** | Thay đổi phương án & Đồng thuận cuối cùng (Memcached $\to$ Redis Cluster) | **ĐẠT (PASS)** |
| **TC-02** | **Khó / Mơ hồ (Difficult)** | Đồng thuận ngầm & Đại từ nhân xưng mơ hồ ("You take care of this ASAP") | **ĐẠT CÓ CẢNH BÁO** |
| **TC-03** | **Thất bại / Chưa tốt (Fail)** | Tranh luận mỉa mai ("Rewrite in Flutter") & Đổi ý phút chót | **CHƯA ĐẠT $\to$ ĐÃ SỬA CÓ HẠN CHẾ** |
| **TC-04** | **Phức tạp (Multi-turn)** | Đàm phán Deadline 3 mốc (Trưa mai $\to$ Thứ Tư $\to$ Chủ Nhật 23:59) | **ĐẠT (PASS)** |
| **TC-05** | **Bế tắc (Stalemate)** | Cuộc họp bất đồng sâu sắc ("No decision today") $\to$ Không bịa quyết định | **ĐẠT (PASS)** |

*(Chi tiết đầy đủ về Kỳ vọng, Kết quả thực tế, và Điều học được có sẵn trong giao diện mục **Bộ Kiểm Thử (5 TC)** và tài liệu `MISSION_2_REPORT.md`).*

---

## 5. Trả lời 3 Câu Hỏi Bắt Buộc

### Câu 1: Phần quan trọng nhất bạn chọn để hiện thực hóa trong MVP là gì? Vì sao nếu phần này hoạt động, bạn tin rằng hướng giải quyết của mình là khả thi?
* **Phần quan trọng nhất:** Bộ lọc **Terminal Consensus (Đồng thuận chốt chặn)** kết hợp **Danh mục phương án bị loại (Rejected Alternatives)** và **Trích dẫn đối soát 1-click (Evidence Timestamp Citations)**.
* **Vì sao chứng minh khả thi:** Vì đây là bài toán khó nhất của cuộc họp thực tế (người tham gia đổi ý liên tục). Khi hệ thống chứng minh được việc giữ đúng kết luận cuối cùng (Redis Cluster) và loại bỏ phương án cũ (Memcached) có lý do rõ ràng, đồng thời cho phép người dùng click đối soát trực tiếp câu thoại gốc trong 5 giây, toàn bộ giả thuyết về tiết kiệm 80% thời gian duyệt biên bản của Mission 1 được chứng minh.

### Câu 2: So với kế hoạch ở Mission 1, bạn đã thay đổi quyết định hoặc thiết kế nào? Điều gì trong quá trình làm khiến bạn thay đổi?
* **Thay đổi 1:** Bổ sung trường `rejected_alternatives` trực tiếp trong thẻ Decision thay vì vẽ sơ đồ Timeline phức tạp. Điều này giúp giao diện gọn gàng, người dùng đọc hiểu ngay lập tức lý do tại sao không chọn phương án cũ.
* **Thay đổi 2:** Tách bạch triệt để giữa `Action Items` và `Open Issues / Blockers`. Quá trình kiểm thử cho thấy các câu nói bộc phát (*"someone ought to look into that someday"*) nếu để chung sẽ bị AI gán bừa thành task rác. Đưa vào `Open Issues` giúp bảo vệ backlog của doanh nghiệp.

### Câu 3: Loại thông tin nào hệ thống hiện dễ ghi nhận sai nhất? Bạn đang làm gì để tránh tạo ra một quyết định, công việc hoặc dữ liệu không thực sự tồn tại trong cuộc họp?
* **Dễ ghi nhận sai nhất:**
  1. *Ngữ nghĩa mỉa mai (Sarcasm/Irony):* Câu nói đùa như *"sao không viết lại bằng Flutter luôn đi"* dễ bị AI tưởng là giải pháp thật.
  2. *Cam kết nửa vời & Đại từ mơ hồ:* Phát ngôn *"You do this ASAP"* khiến AI dễ bịa ra deadline hoặc gán sai người.
* **Biện pháp phòng ngừa:**
  - *Cam kết trách nhiệm rõ ràng (Commitment Gate):* Chỉ tạo task khi có phát ngôn nhận việc tự nguyện ngôi thứ nhất (*"I will handle..."*) hoặc giao việc trực tiếp được đồng ý.
  - *Ràng buộc bằng chứng (Grounding Constraint):* Bắt buộc có quote và timestamp nguyên văn; không có thì không sinh dữ liệu.
  - *Human-in-the-Loop:* Mọi dữ liệu mặc định ở trạng thái Nháp (Draft), con người chỉ mất 1-click để duyệt hoặc sửa trước khi đưa vào hệ thống chính thức.

---

## 6. Kịch bản Video Demo (Dưới 5 Phút)

Xem chi tiết kịch bản phân cảnh từng phút trong tệp [`MISSION_2_REPORT.md`](MISSION_2_REPORT.md).
- **Phút 0:00 - 0:45:** Giới thiệu bài toán & Lựa chọn phần quan trọng nhất (Case đổi ý).
- **Phút 0:45 - 2:30:** Live Demo thao tác trên Web MVP (Click-to-Verify, 1-Click Approve, Rejected alternatives).
- **Phút 2:30 - 3:45:** Trình diễn tình huống khó (TC-02) và tình huống thất bại do mỉa mai (TC-03).
- **Phút 3:45 - 4:45:** Hạn chế hiện tại của MVP và bài học kinh nghiệm.
- **Phút 4:45 - 5:00:** Kết luận & Hướng phát triển tiếp theo.
