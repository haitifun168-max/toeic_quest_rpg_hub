---
stepsCompleted: [1, 2]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Tạo các Agent xử lý song song cho dự án TOEIC Quest RPG Hub'
research_goals: 'Nghiên cứu kiến trúc chạy song song các agent phân tích câu trả lời, chấm điểm thi thử qua mô hình IRT, phân tích lỗi sai và đề xuất lộ trình học tập'
user_name: 'kevin pham'
date: '2026-06-23'
web_research_enabled: true
source_verification: true
---

# Research Report: technical

**Date:** 2026-06-23
**Author:** kevin pham
**Research Type:** technical

---

## Research Overview

[Research overview and methodology will be appended here]

---

## Technical Research Scope Confirmation

**Research Topic:** Tạo các Agent xử lý song song cho dự án TOEIC Quest RPG Hub
**Research Goals:** Nghiên cứu kiến trúc chạy song song các agent phân tích câu trả lời, chấm điểm thi thử qua mô hình IRT, phân tích lỗi sai và đề xuất lộ trình học tập

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-06-23

---

## Technology Stack Analysis

### Programming Languages

Hệ thống TOEIC Quest RPG Hub được phát triển trên nền tảng **Node.js/JavaScript (Express framework)** ở backend. Do đó, việc xây dựng các agent xử lý song song cần ưu tiên sự tương thích cao nhất với hệ sinh thái này để tránh tăng chi phí vận hành và quản lý hạ tầng.
- _Popular Languages:_ **JavaScript/TypeScript** là lựa chọn hàng đầu cho hệ thống chính để tối ưu hóa thời gian phát triển và tận dụng cơ chế non-blocking I/O của Node.js.
- _Emerging Languages:_ **Python** là một lựa chọn bổ sung mạnh mẽ, thường được dùng để đóng gói các tác vụ tính toán học máy nặng (như chạy mô hình Item Response Theory - IRT với các thư viện như `py-irt` hoặc các phân tích học sâu của AI Mentor). Python và Node.js có thể giao tiếp qua microservices hoặc gRPC.
- _Language Evolution:_ Sự phát triển mạnh mẽ của TypeScript trong phát triển AI (như Mastra, LangChain.js) đang biến TypeScript thành ngôn ngữ chuẩn mực để xây dựng các agent có kiểm soát kiểu (type-safe).
- _Performance Characteristics:_ Node.js rất mạnh trong việc xử lý các tác vụ I/O song song (gọi API LLM, đọc ghi DB) nhờ Event Loop, nhưng sẽ bị nghẽn nếu xử lý tính toán CPU nặng (như tính ma trận trong IRT). Do đó, các tác vụ tính toán nặng cần được đẩy ra Worker Threads hoặc Service Python riêng biệt.
- _Source:_ [NPM Registry: @geekie/irt](https://www.npmjs.com/package/@geekie/irt), [PyPI: py-irt](https://pypi.org/project/py-irt/)

### Development Frameworks and Libraries

Để xây dựng hệ thống agent và phân phối công việc song song, các framework sau được đánh giá cao:
- _Major Frameworks:_ 
  - **LangGraph.js**: Hỗ trợ xuất sắc việc xây dựng các luồng agent dạng đồ thị có trạng thái (stateful graph), cho phép định nghĩa các vòng lặp (cycles) và phối hợp nhiều agent phức tạp (Multi-Agent).
  - **Mastra**: Framework TypeScript-native mới nổi, cung cấp giải pháp toàn diện (all-in-one) gồm Memory, RAG, Agent Orchestration và khả năng tích hợp sẵn mà không cần ghép nối nhiều thư viện lẻ tẻ.
- _Micro-frameworks & Specialized Libraries:_
  - **BullMQ**: Thư viện quản lý hàng đợi (Job Queue) mạnh mẽ nhất cho Node.js dựa trên Redis, cho phép phân phối công việc song song đến các worker độc lập một cách đáng tin cậy.
  - **@geekie/irt**: Thư viện JavaScript hỗ trợ tính toán các hàm xác suất phản hồi câu hỏi và ước lượng năng lực học viên bằng phương pháp EAP (Expected A Posteriori).
- _Evolution Trends:_ Xu hướng dịch chuyển từ việc tự viết code điều hướng sang sử dụng các Agentic Frameworks chuyên dụng có tích hợp cơ chế quản lý trạng thái (state management) và khả năng tự sửa lỗi (self-correction).
- _Ecosystem Maturity:_ Hệ sinh thái JavaScript dành cho AI Agent đã trưởng thành vượt bậc nhờ sự hỗ trợ song song của LangChain và các framework TypeScript-native như Mastra.
- _Source:_ [LangGraph.js Documentation](https://langchain-ai.github.io/langgraphjs/), [Mastra AI Framework](https://mastra.ai/), [BullMQ Guide](https://bullmq.io/)

### Database and Storage Technologies

Hệ thống lưu trữ đóng vai trò trung tâm trong việc lưu trữ trạng thái của Agent và phân phối job song song.
- _Relational Databases:_ **PostgreSQL** là cơ sở dữ liệu chính được sử dụng trong dự án để lưu trữ thông tin người dùng, lịch sử trả lời câu hỏi, và các tham số của câu hỏi (độ phân hóa $a$, độ khó $b$, độ đoán mò $c$ của IRT).
- _NoSQL Databases:_ **Redis** đóng vai trò cực kỳ quan trọng trong việc làm backend cho BullMQ để quản lý hàng đợi, đồng thời cache Sorted Sets cho bảng xếp hạng PvP Leaderboard và quản lý phòng chờ matchmaking.
- _In-Memory Databases:_ Sử dụng **Redis** làm database lưu trữ trạng thái tạm thời của các agent trong các phiên làm việc dài (session state) để tối ưu tốc độ đọc ghi.
- _Data Warehousing:_ Chưa cần thiết ở giai đoạn MVP, nhưng có thể sử dụng PostgreSQL partitioning hoặc ClickHouse ở các giai đoạn sau khi dữ liệu log câu trả lời của hàng triệu người dùng tăng cao.
- _Source:_ [BullMQ Redis Integration](https://docs.bullmq.io/what-is-bullmq/redis-integration)

### Development Tools and Platforms

Các công cụ hỗ trợ phát triển và kiểm thử hệ thống agent song song:
- _IDE and Editors:_ **VS Code** kết hợp các công cụ hỗ trợ AI (như Antigravity) để gia tăng tốc độ viết code và thiết kế đồ thị agent.
- _Version Control:_ **Git** được sử dụng để quản lý các nhánh phát triển song song cho backend Express và frontend React Native.
- _Build Systems:_ **npm** hoặc **yarn** để quản lý các gói phụ thuộc.
- _Testing Frameworks:_ **Jest** và **Supertest** (đang có sẵn trong `package.json` của dự án) được dùng để viết unit test và integration test, đảm bảo các agent xử lý song song trả về kết quả chính xác và không bị race condition.
- _Source:_ [Jest Framework](https://jestjs.io/), [Supertest Package](https://www.npmjs.com/package/supertest)

### Agent Observability and Monitoring

Giám sát các agent chạy song song đang thực hiện các nhiệm vụ là yếu tố sống còn để đảm bảo hệ thống không bị tắc nghẽn, kiểm soát chi phí API, và phát hiện kịp thời các lỗi logic (như agent bị lặp vô hạn).
- _AI-Native Observability:_ 
  - **Langfuse**: Nền tảng mã nguồn mở phổ biến nhất giúp trace chi tiết luồng suy nghĩ (reasoning traces), prompt, và các cuộc gọi API LLM của agent trong TypeScript.
  - **LangSmith**: Tích hợp hoàn hảo nhất nếu hệ thống agent được phát triển bằng **LangGraph.js**, cung cấp giao diện trực quan hóa sơ đồ cây thực thi của các agent song song.
- _Job Queue Observability:_
  - **Bull Board**: Giao diện dashboard trực quan dành cho BullMQ, giúp giám sát thời gian thực số lượng job đang chạy song song (Active), đang chờ (Waiting), bị lỗi (Failed), hoặc đã hoàn thành (Completed).
- _Telemetry & Export Standards:_
  - **OpenTelemetry (OTel)**: Sử dụng các exporter OpenTelemetry (như thư viện tích hợp sẵn của **Mastra** hoặc **Arize Phoenix**) để đẩy log/metrics/traces của agent sang các công cụ APM truyền thống (Datadog, SigNoz, New Relic).
- _Source:_ [Langfuse Observability](https://langfuse.com/), [Bull Board GitHub](https://github.com/felixgenschow/bull-board)


### Cloud Infrastructure and Deployment

Hạ tầng triển khai quyết định khả năng mở rộng của hệ thống worker xử lý song song:
- _Major Cloud Providers:_ Các dịch vụ cloud như AWS (EC2/ECS), GCP hoặc các nền tảng PaaS như Render/Railway để host backend Node.js và Redis.
- _Container Technologies:_ **Docker** để container hóa backend Express và các worker BullMQ độc lập, giúp dễ dàng co giãn (scale) số lượng worker chạy song song.
- _Serverless Platforms:_ **AWS Lambda** hoặc **Google Cloud Functions** có thể được sử dụng để chạy các agent tính điểm IRT theo dạng event-driven (chạy khi có sự kiện nộp bài thi Dungeon mà không cần duy trì server 24/7).
- _CDN and Edge Computing:_ CDN như Cloudflare để cache tài nguyên tĩnh và phân tải cho API.
- _Source:_ [Dockerizing Node.js Applications](https://nodejs.org/en/docs/guides/log-in-with-docker/)

### Technology Adoption Trends

- _Migration Patterns:_ Dịch chuyển từ mô hình monolith xử lý đồng bộ sang kiến trúc hướng sự kiện (Event-Driven Architecture) sử dụng Job Queue để xử lý bất đồng bộ các tác vụ nặng.
- _Emerging Technologies:_ Tích hợp Model Context Protocol (MCP) giúp các Agent có thể dễ dàng sử dụng chung các công cụ (tools) truy vấn cơ sở dữ liệu và gọi API.
- _Legacy Technology:_ Các mô hình gọi API LLM tuần tự (sequential chains) đơn giản đang được thay thế bằng các kiến trúc Multi-Agent có thể tương tác song song và tự hội thoại với nhau (Party Mode).
- _Community Trends:_ Cộng đồng lập trình viên Node.js đang tập trung xây dựng các agent nhẹ, có tính module hóa cao bằng TypeScript để dễ dàng nhúng trực tiếp vào các microservices hiện có.
- _Source:_ [Model Context Protocol Specification](https://modelcontextprotocol.io/)

---

<!-- Content will be appended sequentially through research workflow steps -->
