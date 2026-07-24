# Checklist kịch bản test full nghiệm thu TOEIC Quest RPG Hub

Tài liệu này dùng để chuẩn hoá quá trình kiểm thử nghiệm thu trước khi release hoặc sau mỗi lần nâng cấp sản phẩm.

## 1. Lịch sử sửa đổi và nâng cấp tài liệu

| Phiên bản | Ngày cập nhật | Người cập nhật | Nội dung thay đổi | Ghi chú |
| --- | --- | --- | --- | --- |
| 1.0 | ____/____/______ | ________________ | Khởi tạo checklist nghiệm thu full sản phẩm | |
| 1.1 | ____/____/______ | ________________ | Bổ sung/sửa đổi theo phiên bản nâng cấp mới | |

## 2. Mục tiêu của tài liệu

Tài liệu này được dùng để:

- Chuẩn hoá kịch bản kiểm thử nghiệm thu cho TOEIC Quest RPG Hub.
- Giúp đội phát triển, QA và người nghiệm thu kiểm tra đầy đủ các luồng quan trọng trước khi release.
- Làm checklist tái sử dụng sau mỗi lần nâng cấp, sửa lỗi hoặc triển khai production.
- Ghi nhận kết quả kiểm thử, lỗi phát hiện, quyết định release và các điều kiện còn tồn đọng.
- Giảm rủi ro bỏ sót các lỗi nghiêm trọng liên quan đến đăng nhập, dữ liệu người dùng, Skill Tree, Quiz, PvP, bảo mật và deployment.

## 3. Phạm vi áp dụng

Áp dụng cho các hoạt động:

- Kiểm thử trước release MVP hoặc bản nâng cấp.
- Kiểm thử hồi quy sau khi sửa lỗi.
- Kiểm thử production smoke test sau deployment.
- Kiểm thử nghiệm thu nội bộ trước khi bàn giao cho người dùng hoặc khách hàng dùng thử.

Không thay thế hoàn toàn test tự động, kiểm thử tải, kiểm thử bảo mật chuyên sâu hoặc kiểm thử thiết bị thật diện rộng.

## 4. Thuật ngữ và mô tả

| Thuật ngữ | Mô tả |
| --- | --- |
| Acceptance Test | Kiểm thử nghiệm thu để xác nhận sản phẩm đáp ứng yêu cầu sử dụng thực tế. |
| Release Gate | Bộ điều kiện bắt buộc phải đạt trước khi quyết định phát hành. |
| Smoke Test | Kiểm thử nhanh các chức năng sống còn để xác nhận hệ thống chạy được. |
| Regression Test | Kiểm thử hồi quy để đảm bảo sửa đổi mới không làm hỏng chức năng cũ. |
| Production Backend | Backend đang chạy trên môi trường production, ví dụ Render/Supabase. |
| Local Backend | Backend chạy trên máy phát triển để kiểm thử nội bộ. |
| QA Account | Tài khoản kiểm thử riêng, không dùng tài khoản thật của khách hàng. |
| JWT/Token | Mã xác thực dùng để gọi API cần đăng nhập. |
| Migration | Script thay đổi cấu trúc hoặc dữ liệu nền của database. |
| Skill Tree | Lộ trình kỹ năng học TOEIC dạng cây/nút tiến độ. |
| Placement Test | Bài kiểm tra đầu vào để ước lượng trình độ/rank ban đầu. |
| Dungeon/Quiz | Luồng làm bài luyện tập hoặc mock test trong sản phẩm. |
| PvP Ranked | Chế độ đấu xếp hạng giữa người học hoặc với bot. |
| ELO | Điểm xếp hạng dùng trong PvP. |
| Stamina | Năng lượng/lượt chơi giới hạn cho một số hoạt động. |
| Critical Bug | Lỗi nghiêm trọng chặn release, gây crash, mất dữ liệu, lỗi bảo mật hoặc hỏng luồng chính. |
| N/A | Không áp dụng cho phiên test hiện tại. |

## 5. Thông tin phiên test

- [ ] Ngày test: `____/____/______`
- [ ] Người test: `________________`
- [ ] Phiên bản/commit: `________________`
- [ ] Môi trường test:
  - [ ] Local backend
  - [ ] Production backend
  - [ ] Web Expo
  - [ ] Mobile preview build
- [ ] Backend URL: `________________`
- [ ] Database: `________________`
- [ ] Ghi chú dữ liệu test: `________________`

## 6. Bảng tổng kết nếu dùng để kiểm thử

| Nhóm kiểm thử | Mục tiêu kiểm thử | Người phụ trách | Trạng thái | Số lỗi Critical/High | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Backend API | API sống, response đúng, protected route an toàn | | Not Run / Pass / Fail / N/A | | |
| Auth & Account | Register, login, logout, OAuth, session | | Not Run / Pass / Fail / N/A | | |
| Dashboard | Màn chính hiển thị dữ liệu và điều hướng đúng | | Not Run / Pass / Fail / N/A | | |
| Placement Test | Làm bài đầu vào và cập nhật trình độ | | Not Run / Pass / Fail / N/A | | |
| Quiz/Dungeon | Chọn bài, làm bài, submit, xem kết quả | | Not Run / Pass / Fail / N/A | | |
| Skill Tree | Mở lộ trình kỹ năng, xem node/progress | | Not Run / Pass / Fail / N/A | | |
| PvP Ranked | Rank thấp, lobby, matchmaking, battle, kết quả | | Not Run / Pass / Fail / N/A | | |
| Guild | Placeholder hoặc tính năng Guild không crash | | Not Run / Pass / Fail / N/A | | |
| Profile | Hồ sơ, tiến độ, logout | | Not Run / Pass / Fail / N/A | | |
| Leaderboard | Bảng xếp hạng tải và sắp xếp đúng | | Not Run / Pass / Fail / N/A | | |
| Security | Token, rate limit, quyền truy cập dữ liệu | | Not Run / Pass / Fail / N/A | | |
| UI/UX | Không màn trắng, không loading vô hạn, responsive cơ bản | | Not Run / Pass / Fail / N/A | | |
| Automation | Unit/integration/export/smoke scripts | | Not Run / Pass / Fail / N/A | | |

### Tổng kết quyết định

| Tiêu chí | Kết quả |
| --- | --- |
| Tổng số nhóm kiểm thử | `____` |
| Số nhóm Pass | `____` |
| Số nhóm Fail | `____` |
| Số nhóm N/A | `____` |
| Tổng số lỗi Critical | `____` |
| Tổng số lỗi High | `____` |
| Tổng số lỗi Medium/Low | `____` |
| Quyết định release | Go / No-Go / Go có điều kiện |
| Điều kiện nếu Go có điều kiện | `________________` |
| Người phê duyệt | `________________` |
| Thời điểm phê duyệt | `____/____/______ __:__` |

## 7. Điều kiện trước khi test

- [ ] Backend khởi động thành công.
- [ ] Frontend khởi động thành công.
- [ ] Database đã chạy đủ migrations.
- [ ] Production không còn lỗi route cơ bản như `404 /api/skill-tree`.
- [ ] Có ít nhất 2 tài khoản QA riêng.
- [ ] Có ít nhất 1 tài khoản QA Rank >= 2 để test PvP Ranked.
- [ ] Không dùng tài khoản thật của khách hàng để test phá dữ liệu.

## 8. Smoke test API backend

### Public API

- [ ] `GET /api/leaderboard` trả `200 OK`.
- [ ] `GET /api/placement/questions` trả `200 OK`.
- [ ] Response có format thống nhất: `ok`, `data`, `error`.

### Protected API

- [ ] Gọi endpoint cần token khi chưa đăng nhập trả `401`.
- [ ] Token hết hạn/không hợp lệ bị từ chối.
- [ ] Không lộ stack trace hoặc secret trong response lỗi.

### Skill Tree API

- [ ] `GET /api/skill-tree` trả `200 OK` khi có token hợp lệ.
- [ ] Dữ liệu trả về có node/path/progress đúng format frontend cần.
- [ ] Nếu database chưa có dữ liệu, API vẫn trả lỗi dễ hiểu, không crash.

## 9. Auth và tài khoản

### Đăng ký

- [ ] Đăng ký bằng email mới thành công.
- [ ] Không cho đăng ký email trùng.
- [ ] Mật khẩu yếu bị từ chối.
- [ ] Mật khẩu hợp lệ gồm tối thiểu 8 ký tự, chữ hoa và ký tự đặc biệt.
- [ ] Sau khi đăng ký, user có thể đăng nhập bằng tài khoản vừa tạo.

### Đăng nhập

- [ ] Đăng nhập email/password đúng thành công.
- [ ] Đăng nhập sai mật khẩu bị từ chối.
- [ ] Đăng nhập email không tồn tại bị từ chối an toàn.
- [ ] Sau login, app lưu token/session đúng.
- [ ] Reload app vẫn giữ trạng thái đăng nhập nếu token còn hạn.

### OAuth

- [ ] Google/Facebook trên web không tạo session mock.
- [ ] Nếu OAuth chưa hỗ trợ, app hiển thị thông báo rõ ràng.
- [ ] Backend không chấp nhận `mock-*` OAuth token ngoài môi trường test.

## 10. Dashboard/Home

- [ ] Dashboard tải thành công sau login.
- [ ] Hiển thị đúng tên người dùng.
- [ ] Hiển thị Rank/XP/Stamina hiện tại.
- [ ] Daily quest hiển thị được.
- [ ] Các nút điều hướng chính hoạt động.
- [ ] Không có màn trắng, crash, hoặc loading vô hạn.

## 11. Placement test

- [ ] User mới thấy luồng làm placement test.
- [ ] Tải câu hỏi placement thành công.
- [ ] Có thể chọn đáp án và chuyển câu.
- [ ] Không cho submit rỗng ngoài quy định thiết kế.
- [ ] Submit placement thành công.
- [ ] Kết quả placement cập nhật estimated score/rank/path phù hợp.
- [ ] Refresh/relogin vẫn giữ kết quả placement.

## 12. Quiz/Dungeon

### Chọn bài

- [ ] Màn Dungeon tải thành công.
- [ ] Hiển thị lựa chọn Mini Test.
- [ ] Hiển thị lựa chọn Full Mock Test nếu đã hỗ trợ.
- [ ] Chọn bài dẫn sang màn Quiz đúng.

### Làm bài

- [ ] Câu hỏi hiển thị đầy đủ prompt và đáp án.
- [ ] Có thể chọn đáp án.
- [ ] Nút Next/Submit hoạt động đúng.
- [ ] Không bị double-submit khi bấm nhanh nhiều lần.
- [ ] Timer hoặc trạng thái làm bài hoạt động đúng nếu có.
- [ ] Mất token giữa bài được xử lý rõ ràng.

### Kết quả

- [ ] Submit bài thành công.
- [ ] Hiển thị điểm/số câu đúng.
- [ ] XP/stamina/progress cập nhật đúng.
- [ ] Giải thích đáp án hiển thị được khi có dữ liệu.
- [ ] Nếu thiếu explanation, app không crash.

## 13. Skill Tree

- [ ] Màn Skill Tree mở được từ Dashboard.
- [ ] Không còn lỗi `Resource not found` trên production.
- [ ] Node kỹ năng hiển thị đúng trạng thái: locked/unlocked/completed.
- [ ] Progress skill phản ánh đúng lịch sử làm bài.
- [ ] Bấm node hiển thị thông tin kỹ năng hoặc bài học liên quan.
- [ ] Màn có nút quay lại hoạt động.
- [ ] Trường hợp API lỗi hiển thị thông báo dễ hiểu và có nút thử lại.

## 14. PvP Ranked

### Điều kiện Rank thấp

- [ ] User Rank 1 vào PvP thấy thông báo chưa đủ điều kiện.
- [ ] App không hiển thị dữ liệu PvP mock.
- [ ] App không tự chuyển màn gây hiểu nhầm.
- [ ] Nút quay về Dashboard hoạt động.

### User đủ điều kiện

- [ ] User Rank >= 2 vào được PvP Lobby.
- [ ] Lobby hiển thị ELO, stamina, win/loss, lịch sử đấu.
- [ ] Hết stamina thì không cho tìm trận.
- [ ] Còn stamina thì bấm tìm trận được.

### Matchmaking/Battle

- [ ] Tìm trận thành công với bot hoặc người chơi khác.
- [ ] Sau `matchFound`, socket không bị disconnect sai thời điểm.
- [ ] Battle screen nhận đúng `roomId`, players và socket.
- [ ] Câu hỏi PvP hiển thị đúng từng round.
- [ ] Submit đáp án hợp lệ `A/B/C/D` được ghi nhận.
- [ ] Submit payload sai bị bỏ qua an toàn.
- [ ] User không thuộc phòng không submit được.
- [ ] Không bị duplicate finish round khi timeout và cả hai người cùng trả lời.
- [ ] Kết quả round và kết quả trận hiển thị đúng.
- [ ] ELO/stamina/history cập nhật sau trận.

## 15. Guild

- [ ] Màn Guild mở được.
- [ ] Nếu chưa triển khai đầy đủ, hiển thị placeholder “Sắp ra mắt” rõ ràng.
- [ ] Không có nút chết hoặc route crash.
- [ ] Nút quay lại hoạt động.

## 16. Profile/Hồ sơ

- [ ] Màn Hồ sơ mở được.
- [ ] Hiển thị đúng tên, rank, estimated score.
- [ ] Hiển thị lịch sử/progress nếu có.
- [ ] Logout hoạt động.
- [ ] Sau logout, protected screens không truy cập được nếu không login lại.

## 17. Leaderboard

- [ ] Màn/bảng xếp hạng tải được.
- [ ] Dữ liệu sắp xếp đúng theo tiêu chí hiện tại.
- [ ] User hiện tại được hiển thị đúng nếu nằm trong bảng.
- [ ] Không crash khi leaderboard rỗng.

## 18. Bảo mật và abuse checks

- [ ] Rate limiter chặn request vượt ngưỡng.
- [ ] Không thể né rate limit bằng cách tự set `X-Forwarded-For`.
- [ ] API protected bắt buộc có JWT hợp lệ.
- [ ] User không đọc/sửa dữ liệu của user khác.
- [ ] Input lỗi không làm backend crash.
- [ ] Không log token, password, secret ra console/server logs.

## 19. UI/UX cơ bản

- [ ] Không có màn trắng.
- [ ] Không có loading vô hạn.
- [ ] Thông báo lỗi dễ hiểu bằng tiếng Việt.
- [ ] Các nút chính có trạng thái loading/disabled khi cần.
- [ ] Layout dùng được trên desktop web.
- [ ] Layout dùng được trên mobile width.
- [ ] Text không bị cắt ở màn hình nhỏ.
- [ ] Điều hướng Back/Dashboard hoạt động nhất quán.

## 20. Logging và cảnh báo console

- [ ] Không có error đỏ trong browser console.
- [ ] Không có unhandled promise rejection.
- [ ] Không có backend uncaught exception.
- [ ] Warning đã biết được ghi nhận:
  - [ ] PostHog storage warning nếu chạy web/local.
  - [ ] React Native Web deprecated shadow/textShadow/resizeMode warnings.
- [ ] Warning không ảnh hưởng luồng nghiệm thu chính.

## 21. Regression automation

Chạy trước khi nghiệm thu thủ công:

- [ ] `npm test` hoặc `npx jest --runInBand --silent` pass.
- [ ] `npx expo export --platform web --output-dir dist-web-smoke` pass.
- [ ] Xoá thư mục export tạm sau khi test nếu không cần commit.
- [ ] Nếu có Playwright smoke script, chạy lại các luồng:
  - [ ] Register/Login email/password.
  - [ ] Dashboard.
  - [ ] Skill Tree.
  - [ ] Dungeon/Quiz.
  - [ ] PvP Rank thấp.
  - [ ] PvP Rank >= 2.
  - [ ] Guild.
  - [ ] Profile/Logout.

## 22. Release Gate quyết định

### Có thể release khi

- [ ] Tất cả test critical pass.
- [ ] Auth email/password pass.
- [ ] Dashboard pass.
- [ ] Placement hoặc Quiz core pass.
- [ ] Skill Tree production không 404.
- [ ] PvP hiển thị đúng cho Rank thấp và chạy được với Rank >= 2 nếu PvP nằm trong scope release.
- [ ] Không có lỗi bảo mật blocker.
- [ ] Không có crash/màn trắng/loading vô hạn ở luồng chính.

### Không release nếu có một trong các lỗi sau

- [ ] Không đăng ký/đăng nhập được.
- [ ] Backend production thiếu route cần thiết.
- [ ] Migration production chưa chạy làm API lỗi.
- [ ] Protected API truy cập được khi không có token.
- [ ] OAuth mock tạo được session thật ngoài test.
- [ ] PvP cho phép user không thuộc phòng submit answer.
- [ ] App crash ở Dashboard, Quiz, Skill Tree hoặc Profile.
- [ ] Dữ liệu user bị lẫn giữa các tài khoản.

## 23. Biên bản kết quả nghiệm thu

| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Backend API | Pass / Fail / N/A | |
| Auth | Pass / Fail / N/A | |
| Dashboard | Pass / Fail / N/A | |
| Placement | Pass / Fail / N/A | |
| Quiz/Dungeon | Pass / Fail / N/A | |
| Skill Tree | Pass / Fail / N/A | |
| PvP | Pass / Fail / N/A | |
| Guild | Pass / Fail / N/A | |
| Profile | Pass / Fail / N/A | |
| Security | Pass / Fail / N/A | |
| Regression tests | Pass / Fail / N/A | |

## 24. Danh sách lỗi cần xử lý

| Mức độ | Mô tả lỗi | Màn/API | Cách tái hiện | Người xử lý | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| Critical / High / Medium / Low | | | | | Open / Fixed / Retest / Closed |

## 25. Kết luận

- [ ] Đạt nghiệm thu, có thể release.
- [ ] Chưa đạt, cần sửa lỗi trước khi release.
- [ ] Chỉ đạt một phần, release có điều kiện.

Ghi chú kết luận:

```text

```
