-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part INTEGER NOT NULL,
    question_content TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL
);

-- Create questions_explanation table
CREATE TABLE IF NOT EXISTS questions_explanation (
    question_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    layer1 TEXT NOT NULL, -- Translation and Quick explanation
    layer2 TEXT NOT NULL, -- Grammar breakdown
    layer3 TEXT NOT NULL  -- Additional notes/Vocabulary
);

-- Seed 10 placement test questions
INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440001', 5, 'The manager asked all employees to submit their reports _______ Friday.', 'until', 'by', 'since', 'for', 'B')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440001', 
 'Dịch: Trưởng phòng yêu cầu tất cả nhân viên nộp báo cáo trước thứ Sáu. Sử dụng "by" để chỉ thời hạn cuối cùng phải hoàn thành hành động.', 
 'Cấu trúc giới từ thời gian: "by + mốc thời gian" dùng để chỉ hành động phải xảy ra TRƯỚC hoặc VÀO mốc thời gian đó. Khác với "until" chỉ hành động kéo dài liên tục cho tới một mốc thời gian.', 
 'Từ vựng: manager (n) - quản lý/trưởng phòng, submit (v) - nộp/đệ trình, report (n) - báo cáo.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440002', 5, 'Employees are reminded to lock all filing cabinets before _______ the office.', 'leave', 'leaving', 'left', 'to leave', 'B')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440002', 
 'Dịch: Nhân viên được nhắc nhở khóa tất cả tủ đựng hồ sơ trước khi rời văn phòng.', 
 'Sau các giới từ thời gian như "before", "after", "while", ta sử dụng dạng V-ing (danh động từ) khi chủ ngữ của hai mệnh đề đồng nhất (ở đây là Employees).', 
 'Từ vựng: remind (v) - nhắc nhở, cabinet (n) - tủ có ngăn kéo, filing cabinet - tủ hồ sơ.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440003', 5, 'Mr. Kim decided to hire _______ assistant to help with the new marketing campaign.', 'an', 'a', 'the', 'these', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440003', 
 'Dịch: Ông Kim quyết định thuê một trợ lý để giúp đỡ chiến dịch tiếp thị mới.', 
 'Mạo từ bất định: Sử dụng "an" trước danh từ đếm được số ít bắt đầu bằng một nguyên âm (u, e, o, a, i). Từ "assistant" bắt đầu bằng âm /ə/ (nguyên âm) nên chọn "an".', 
 'Từ vựng: hire (v) - thuê/tuyển dụng, assistant (n) - trợ lý, campaign (n) - chiến dịch.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440004', 5, 'The company _______ its annual revenue by fifteen percent over the last fiscal year.', 'increase', 'increases', 'increased', 'increasing', 'C')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440004', 
 'Dịch: Công ty đã tăng doanh thu hàng năm lên mười lăm phần trăm trong năm tài chính vừa qua.', 
 'Thì quá khứ đơn: Cụm từ chỉ thời gian "over the last fiscal year" (trong năm tài chính trước) chỉ hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ. Do đó động từ chính phải chia ở thì Quá khứ đơn (increased).', 
 'Từ vựng: annual (adj) - hàng năm, revenue (n) - doanh thu, fiscal year (n) - năm tài chính.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440005', 5, 'We are confident _______ the new software will improve employee productivity.', 'that', 'which', 'what', 'who', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440005', 
 'Dịch: Chúng tôi tự tin rằng phần mềm mới sẽ cải thiện hiệu suất của nhân viên.', 
 'Mệnh đề danh ngữ: Cấu trúc "confident that + clause" (tự tin rằng...). Từ "that" ở đây đóng vai trò liên từ nối mệnh đề bổ nghĩa cho tính từ confident.', 
 'Từ vựng: confident (adj) - tự tin, improve (v) - cải thiện, productivity (n) - năng suất/hiệu suất.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440006', 5, 'Customer service agents must respond to all inquiries as _______ as possible.', 'quickly', 'quick', 'quickness', 'quicker', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440006', 
 'Dịch: Nhân viên chăm sóc khách hàng phải phản hồi tất cả các yêu cầu nhanh nhất có thể.', 
 'Trạng từ bổ nghĩa cho động từ thường: Động từ trong câu là "respond" (phản hồi - động từ thường). Để bổ nghĩa cho động từ thường trong cấu trúc so sánh bằng "as... as possible", ta dùng trạng từ "quickly".', 
 'Từ vựng: inquiry (n) - câu hỏi/yêu cầu giải đáp, respond (v) - phản hồi, agent (n) - đại diện/nhân viên.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440007', 5, 'The presentation was _______ successful because of the team''s thorough preparation.', 'high', 'highly', 'height', 'higher', 'B')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440007', 
 'Dịch: Bài thuyết trình đã cực kỳ thành công nhờ vào sự chuẩn bị kỹ lưỡng của cả đội.', 
 'Trạng từ chỉ mức độ: Chỗ trống đứng trước tính từ "successful". Chỉ có trạng từ (Adverb) mới có thể bổ nghĩa cho tính từ. "highly" là trạng từ mang nghĩa "ở mức độ cao / cực kỳ".', 
 'Từ vựng: thorough (adj) - kỹ lưỡng/thấu đáo, preparation (n) - sự chuẩn bị, presentation (n) - bài thuyết trình.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440008', 5, 'Several team members offered to work overtime to _______ the project deadline.', 'meet', 'get', 'run', 'do', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440008', 
 'Dịch: Một vài thành viên trong đội đã đề nghị làm thêm giờ để kịp thời hạn dự án.', 
 'Cụm từ cố định (Collocation): Cụm từ "meet the deadline" có nghĩa là hoàn thành đúng thời hạn. Các phương án còn lại (get, run, do) không đi với deadline.', 
 'Từ vựng: several (adj) - một vài, offer (v) - đề nghị/tự nguyện làm gì, overtime (adv/n) - giờ làm thêm.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440009', 5, 'Please keep all receipts for travel expenses if you wish to be _______.', 'reimbursed', 'reimbursement', 'reimbursing', 'reimburse', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440009', 
 'Dịch: Vui lòng giữ lại tất cả biên lai chi phí đi lại nếu bạn muốn được hoàn tiền.', 
 'Thể bị động: Cấu trúc "to wish to be + V3/V-ed" diễn đạt mong muốn được thực hiện hành động bị động (được hoàn tiền). Động từ "reimburse" ở dạng phân từ 2 là "reimbursed".', 
 'Từ vựng: receipt (n) - biên lai, expense (n) - chi phí, reimburse (v) - bồi hoàn/hoàn tiền.')
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO questions (id, part, question_content, option_a, option_b, option_c, option_d, correct_option) VALUES
('850e8400-e29b-41d4-a716-446655440010', 5, 'The negotiation was delayed _______ a conflict in the schedules of both directors.', 'because of', 'although', 'because', 'despite', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions_explanation (question_id, layer1, layer2, layer3) VALUES
('850e8400-e29b-41d4-a716-446655440010', 
 'Dịch: Cuộc đàm phán bị trì hoãn do sự xung đột về lịch trình của cả hai giám đốc.', 
 'Liên từ chỉ nguyên nhân: Đằng sau chỗ trống là một cụm danh từ "a conflict in the schedules...". "because of" đứng trước một danh từ/cụm danh từ, trong khi "because" đứng trước một mệnh đề (S + V).', 
 'Từ vựng: negotiation (n) - cuộc đàm phán, delay (v) - trì hoãn, conflict (n) - sự xung đột.')
ON CONFLICT (question_id) DO NOTHING;
