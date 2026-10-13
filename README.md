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
- **Tích hợp Google Gemini Live API thực tế:** Xử lý và suy luận trực tiếp thông qua Google Gemini API với hệ thống Prompt ràng buộc nghiêm ngặt và JSON Schema có cấu trúc; lưu trữ API key an toàn cục bộ trên trình duyệt (không lưu trữ backend).

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

> **Lưu ý thực thi & bảo mật:** Dự án **KHÔNG CHỨA** API key, mật khẩu hoặc dữ liệu nhạy cảm. Người dùng dán Google Gemini API Key trực tiếp trên giao diện Header (lưu cục bộ trong trình duyệt) để gọi Live API thực tế.

---

## 4. Trình Bày Bài Làm (Submission Overview)

### 4.1. Cách chạy sản phẩm:
1. Chạy lệnh `pnpm install` để cài đặt dependencies.
2. Chạy lệnh `pnpm run dev` và truy cập `http://localhost:5173`.
3. Nhập Gemini API Key tại nút **Key Configured / Configure Key** trên Header.
4. Chọn một trong 5 kịch bản mẫu từ menu **Load Different Transcript** hoặc dán transcript thực tế từ Google Meet để xem AI xử lý và đối soát.

### 4.2. Các quyết định thiết kế cốt lõi (Decisions Made):
- **Terminal Consensus Gate:** Chỉ công nhận phương án cuối cùng làm quyết định chính thức khi có xác nhận đồng thuận dứt khoát. Các đề xuất bị bác bỏ được tự động chuyển vào mục `Rejected Alternatives` kèm lý do loại bỏ.
- **Commitment Gate cho Action Items:** Bắt buộc có cam kết ngôi thứ nhất (*"I will..."*, *"I own this..."*) hoặc giao việc được người nhận đồng ý. Mọi deadline mơ hồ (*"ASAP"*, *"càng sớm càng tốt"*) hoặc phân công đại từ thiếu rõ ràng đều bị gắn cờ cảnh báo `⚠ Needs Confirmation`.
- **Zero-Hallucination khi Bế tắc (Stalemate):** Khi cuộc họp không đạt được thỏa thuận (*"No decision today"*, *"impasse"* như ở TC-05), hệ thống kiên quyết không tự bịa quyết định (`decisions: []`), mà chuyển sang quản lý tại mục `Key Friction & Blockers` và `Unresolved Items`.
- **Hành trình Đồng thuận Đa giai đoạn & Đối soát 1-Click:** Tái hiện trajectory từ phân kỳ ban đầu đến điểm chốt (Interactive Timeline Stage Buttons), hỗ trợ bấm vào bất kỳ mốc nào để nhảy trực tiếp đến phát ngôn gốc trong transcript (Click-to-Verify).

### 4.3. Hạn chế đã biết (Known Limitations):
- **Thiếu dữ liệu âm thanh/ngữ điệu (Audio Prosody):** Phân tích văn bản thuần túy (Text-only transcript) không nắm bắt được cao độ và ngữ điệu giọng nói, khiến mô hình ngôn ngữ dễ nhầm các phát ngôn mỉa mai, cay đắng (sarcasm/irony) thành đồng thuận chân thực nếu người nói dùng từ ngữ khẳng định bề mặt.
- **Phân nhánh quyết định song song phức tạp:** Với các cuộc họp lớn có nhiều chủ đề đan xen liên tục mà không có người điều phối gọi tên chủ đề rõ ràng, các giai đoạn thảo luận có thể bị gộp lẫn vào một trajectory chung.
- **Phụ thuộc chất lượng ASR:** Bản ghi nếu bị sai tên riêng, thuật ngữ kỹ thuật viết tắt hoặc thiếu mốc thời gian sẽ làm giảm độ chính xác của cơ chế neo bằng chứng (Evidence Anchor).

---

## 5. Báo Cáo Kiểm Thử Tối Thiểu 05 Tình Huống (Format: Kỳ vọng → Kết quả thực tế → Đạt/Chưa đạt → Điều học được)

| Mã | Tên tình huống & Loại | Kỳ vọng | Kết quả thực tế | Đạt / Chưa đạt | Điều học được |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Kiến trúc Cache Redis vs Memcached**<br>*(Sản phẩm làm tốt)* | Phát hiện quyết định chọn Redis Cluster thay vì Memcached; tái hiện hành trình 3 giai đoạn tranh luận; gán việc cho Minh với deadline thứ Sáu. | Trích xuất chính xác `DEC-201` với huy hiệu `✓ Clear Explicit Consensus` (xanh lá); timeline 3 pha đầy đủ quote; Action Item gán đúng người và hạn chót. | **ĐẠT** | Khi luận điểm kỹ thuật rõ ràng và câu chốt dứt khoát (*"Agreed then..."*), CoT prompt và schema trích xuất đạt độ chính xác gần như tuyệt đối. |
| **TC-02** | **Incident Postmortem & Phân công nhiệm vụ**<br>*(Dữ liệu khó / Không rõ ràng)* | Nhận diện quyết định kỹ thuật do 1 người nhận trách nhiệm; phát hiện việc giao việc bị động cho Elena với thời hạn mơ hồ *"ASAP"*. | Trích xuất quyết định cấu hình connection pool với huy hiệu `? Assumed Consent`; Action item của Elena tự động kích hoạt cảnh báo vàng `ASAP (⚠ Needs Confirmation / Date)`. | **ĐẠT** | Giao tiếp thực tế thường dùng cụm từ mơ hồ. Hệ thống cần bộ lọc cam kết (Commitment Gate) để gắn cờ rủi ro thay vì chấp nhận mù quáng. |
| **TC-03** | **Chiến lược Mobile & Châm biếm (Sarcasm)**<br>*(Chưa xử lý tốt / Thất bại)* | Phát hiện câu nói mỉa mai *"Rewrite app in Flutter in 2 days"* là châm biếm, không coi đây là quyết định được thông qua. | Text-only LLM bị đánh lừa bởi từ ngữ bề mặt, ban đầu ghi nhận thành quyết định triển khai với huy hiệu đồng thuận giả định trước khi có prompt cấm châm biếm nghiêm ngặt. | **CHƯA ĐẠT** | Transcript chữ làm mất ngữ điệu âm thanh; cần bổ sung lớp kiểm tra cảm xúc và mức độ bất đồng chưa giải quyết để loại trừ false consensus. |
| **TC-04** | **Đàm phán Deadline Auth Gateway v2**<br>*(Đàm phán đa vòng)* | Xuyên suốt đàm phán nhiều mốc (Trưa mai $\to$ Thứ Tư $\to$ Chủ Nhật 23:59), chỉ giữ lại mốc cuối cùng đã chốt; bác bỏ các mốc trước đó. | Trích xuất đúng mốc duy nhất `Sunday 23:59 UTC`, gán việc gửi thông báo cho Sophia; các mốc trước được ghi nhận vào timeline đàm phán thay vì sinh nhiều action item trùng lặp. | **ĐẠT** | Khi thời hạn bị thay đổi liên tục, mô hình cần quy tắc "Terminal Value Gate" để tránh tạo rác công việc với các mốc đã bị hủy. |
| **TC-05** | **Tranh luận Bazel Monorepo vs Polyrepo**<br>*(Bế tắc / Dữ liệu khó)* | Cuộc họp bế tắc (*"No decision today"*, *"impasse"*); hệ thống kiên quyết không được bịa ra quyết định, chỉ ghi nhận vấn đề tồn đọng và việc benchmark. | Bảng tổng hợp hiển thị **Decisions: 0**; bất đồng được đưa vào **Key Friction & Blockers** kèm trích dẫn `[15:30]`; tạo đúng 1 việc đo đạc thực nghiệm cho Tom & Priya trong Q3. | **ĐẠT** | Khả năng phát hiện bế tắc (Negative-consensus detection) quan trọng không kém việc trích xuất đồng thuận; hệ thống phải biết khi nào "không có quyết định". |