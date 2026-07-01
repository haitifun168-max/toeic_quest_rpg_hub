-- Create career_jobs table for Story 5-2
CREATE TABLE IF NOT EXISTS career_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    required_toeic INTEGER NOT NULL,
    salary_range VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

-- Insert mockup jobs matching TOEIC score requirements
INSERT INTO career_jobs (job_title, company_name, required_toeic, salary_range, description) 
VALUES
('Thực tập sinh Marketing', 'VNG Group', 450, '5,000,000 - 8,000,000 VND', 'Yêu cầu TOEIC 450+. Hỗ trợ xây dựng chiến dịch truyền thông thương hiệu và viết bài PR.'),
('Trợ lý Giám đốc Vận hành', 'Shopee Vietnam', 650, '12,000,000 - 18,000,000 VND', 'Yêu cầu TOEIC 650+. Hỗ trợ điều phối các hoạt động kinh doanh, chuẩn bị báo cáo vận hành quốc tế.'),
('Quản lý Dự án Công nghệ', 'FPT Software', 800, '25,000,000 - 35,000,000 VND', 'Yêu cầu TOEIC 800+. Giao tiếp trực tiếp với khách hàng quốc tế US/Europe và quản lý nhóm phát triển.'),
('Quản trị viên Tập sự (Management Trainee)', 'Unilever Vietnam', 850, '30,000,000 - 45,000,000 VND', 'Yêu cầu TOEIC 850+. Chương trình đào tạo luân chuyển qua các phòng ban cốt lõi để phát triển thành Leader tương lai.')
ON CONFLICT DO NOTHING;
