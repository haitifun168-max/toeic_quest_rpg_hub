# Tài Liệu Thiết Kế Giao Diện Toàn Trình
# TOEIC RPG Hub — UI/UX Design Specification
> **Mã tài liệu:** UIDOC_TOEIC_RPG_v1.0
> **Phiên bản:** 1.0 | **Ngày:** 23/06/2026
> **Tham chiếu BRD:** BRD_TOEIC_GAM_v1.0 | **Phase:** 1 MVP → Phase 2

***
## 1. TỔNG QUAN THIẾT KẾ (Design Overview)
### 1.1 Triết Lý Thiết Kế
Ứng dụng TOEIC RPG Hub áp dụng triết lý **"Học là Phiêu Lưu"** — mọi màn hình phải truyền tải cảm giác nhân vật đang tiến hóa, không phải học sinh đang làm bài tập. Ngôn ngữ thiết kế lấy cảm hứng từ hệ thống FML (tham chiếu file thiết kế), kết hợp ba trụ cột:[^1]

- **Spatial Design**: Nền cảnh thành phố/RPG với hiệu ứng chiều sâu (Glassmorphism)
- **Gamification-first UI**: Mọi widget đều phản ánh tiến độ, điểm thưởng, thứ hạng
- **Progressive Disclosure**: Không nhồi thông tin — chỉ hiển thị khi người dùng cần[^1]
### 1.2 Hệ Thống Màu Sắc (Color System)
| Token | Màu HEX | Ý Nghĩa Semantic |
|---|---|---|
| `--color-primary` | `#7C3AED` | Tím — màu chủ đạo, tiến độ, level |
| `--color-gold` | `#F59E0B` | Vàng — KP, thành tích, rank cao |
| `--color-success` | `#10B981` | Xanh lá — đúng, hoàn thành |
| `--color-error` | `#EF4444` | Đỏ — sai, cảnh báo |
| `--color-streak` | `#F97316` | Cam — streak, chuỗi ngày |
| `--color-bg-dark` | `#0F0F1A` | Nền tối chủ đạo |
| `--color-glass` | `rgba(255,255,255,0.08)` | Panel kính mờ (Glassmorphism) |
| `--color-glass-border` | `rgba(255,255,255,0.15)` | Viền panel kính |
| `--color-text-primary` | `#F1F5F9` | Chữ chính |
| `--color-text-muted` | `#94A3B8` | Chữ phụ, nhãn |
### 1.3 Typography
| Level | Font | Size | Weight | Dùng cho |
|---|---|---|---|---|
| Display | Inter / Nunito | 28–36px | 700 | Tiêu đề màn hình chính, Rank-up |
| Heading 1 | Inter | 20–24px | 700 | Tiêu đề widget, popup |
| Heading 2 | Inter | 16–18px | 600 | Subheading, tên bài học |
| Body | Inter | 14–15px | 400 | Nội dung câu hỏi, mô tả |
| Caption | Inter | 12px | 400 | Nhãn phụ, thời gian |
| Badge | Inter | 11px | 700 | Badge KP, tag rank |
### 1.4 Spacing & Layout
- **Base Unit:** 4px
- **Padding panel:** 16–20px
- **Corner radius:** 16px (panel lớn), 12px (card), 8px (button nhỏ)
- **Hệ thống lưới:** Mobile 1 cột, max-width 430px; Tablet 2 cột
- **Shadow:** `0 8px 32px rgba(0,0,0,0.4)` cho panel nổi trên nền
### 1.5 Component Library Cốt Lõi
| Component | Mô tả |
|---|---|
| `<GlassPanel>` | Nền `rgba(15,15,26,0.7)`, `backdrop-filter: blur(12px)`, viền gradient |
| `<KPBadge>` | Chip nền tím/vàng, icon ⚡, text "+X KP", animation bounce khi nhận |
| `<StreakCounter>` | Icon 🔥, số ngày, màu cam, animation fire khi hover |
| `<ProgressBar>` | Gradient tím→xanh, fill animation easeOut |
| `<CTAButton>` | Pill-shaped, height 52px, gradient nền, shadow glow |
| `<QuizOption>` | Card chọn đáp án, state: default / hover / correct / incorrect |
| `<StatRadar>` | Biểu đồ lục giác 6 stat, viền phát sáng |
| `<NodeSkillTree>` | Node tròn, màu theo trạng thái, kết nối bằng đường glowing |
| `<RankBadge>` | Badge có icon rank, tên rank, màu theo cấp |
| `<AIOrb>` | Quả cầu 3D phát sáng, animation pulse khi AI đang xử lý |

***
## 2. LUỒNG NGƯỜI DÙNG TOÀN TRÌNH (Complete User Flow)
```
[Splash Screen]
      ↓
[Onboarding — 3 slide giới thiệu]
      ↓
[Đăng ký / Đăng nhập]
      ↓
[Goal Setting — Đặt mục tiêu TOEIC]
      ↓
[Placement Test — 20 câu]
      ↓
[Kết quả Placement + Tạo Nhân Vật]
      ↓
[Home Dashboard] ←──────────────────────┐
      ↓                                  │
  ┌───┴───────────────────┐              │
  ↓   ↓    ↓    ↓    ↓   ↓              │
Daily PvP  Skill Guild Dungeon  Profile   │
Quest      Tree                           │
  ↓         ↓    ↓    ↓    ↓             │
Quiz     Battle Học  Chat  Mock          │
Screen   Screen  Node        Test        │
  ↓         ↓    ↓    ↓    ↓             │
Feedback Result Node Guild Dungeon       │
         Screen Detail Result Result    │
              ↓                          │
         [Session Summary] ─────────────┘
              ↓
         [Rank-up Ceremony] (nếu đủ KP)
```

***
## 3. ĐẶC TẢ TỪNG MÀN HÌNH (Screen Specifications)
---
### 3.1 Màn Hình Splash & Onboarding
#### SCR-01: Splash Screen

**Mục tiêu:** Branding + loading
**Thời gian hiển thị:** 2 giây

| Zone | Nội dung | Style |
|---|---|---|
| Background | Video loop thành phố RPG tối, ánh đèn | Full-screen video, overlay gradient |
| Center | Logo ứng dụng (thanh kiếm + sách) | Animate scale-in 0.5s |
| Logo Text | **TOEIC QUEST** | Font Display, vàng, glow effect |
| Tagline | "Chinh phục TOEIC — Thăng Hạng Sự Nghiệp" | Caption, trắng, fade-in 1s |
| Bottom | Progress bar loading | Tím, 2 giây fill |

***

#### SCR-02: Onboarding (3 slide)

**Navigation:** Swipe hoặc tap nút "Tiếp theo"; skip ở góc phải

**Slide 1 — RPG Journey**

| Zone | Nội dung |
|---|---|
| Illustration | Nhân vật Rank 1 (Thực Tập Sinh) → Rank 6 (Giám Đốc), animation tiến hóa |
| Headline | "Học TOEIC như chơi RPG" |
| Sub-text | "Mỗi câu trả lời đúng = kinh nghiệm. Tích lũy đủ → Thăng cấp nhân vật." |
| Dot Indicator | 3 chấm, chấm 1 active (tím) |

**Slide 2 — Daily Quest**

| Zone | Nội dung |
|---|---|
| Illustration | Mockup Home Dashboard, 3 quest card sáng lên |
| Headline | "30 phút/ngày. Đủ để vượt qua kỳ thi." |
| Sub-text | "Hệ thống gợi ý bài học cá nhân — đúng chỗ yếu, đúng lúc cần." |

**Slide 3 — Community**

| Zone | Nội dung |
|---|---|
| Illustration | 2 nhân vật đang PvP Battle, màn hình versus |
| Headline | "Thách đấu. Lập Guild. Cùng nhau lên đỉnh." |
| Sub-text | "Cạnh tranh lành mạnh với hàng nghìn người học khác." |
| CTA | Nút "Bắt Đầu Hành Trình" — full-width, gradient tím |

***
### 3.2 Luồng Đăng Ký / Đăng Nhập
#### SCR-03: Auth Screen

**Layout:** Nền cảnh RPG tối, GlassPanel 85% chiều cao màn hình

| Zone | Nội dung | Interaction |
|---|---|---|
| Header | Logo nhỏ + "Chào mừng trở lại" / "Tạo tài khoản" | Toggle tab |
| Tab Bar | [Đăng nhập] [Đăng ký] | Slide indicator tím |
| Input: Email | Icon ✉️, placeholder "Email của bạn" | Focus: viền tím glow |
| Input: Password | Icon 🔒, eye toggle ẩn/hiện | |
| Input: Tên (chỉ đăng ký) | Icon 👤, placeholder "Tên hiển thị / Tên nhân vật" | |
| CTA Primary | "Đăng nhập" / "Tạo tài khoản" | Gradient tím, full-width |
| Divider | ──── hoặc ──── | |
| Social Login | [G] Google   [F] Facebook | Outline button, trắng |
| Footer | "Quên mật khẩu?" | Text link, tím nhạt |

**Validation states:**
- Empty submit: viền đỏ + helper text "Vui lòng nhập [field]"
- Email sai format: "Email không hợp lệ"
- Success: redirect → SCR-04 (lần đầu) hoặc SCR-08 Home (đã có tài khoản)

***
### 3.3 Luồng Onboarding Có Tài Khoản Mới
#### SCR-04: Goal Setting

**Mục tiêu:** Thu thập mục tiêu cá nhân để cá nhân hóa lộ trình

**Layout:** Full-screen wizard, 2 bước (step indicator trên cùng)

**Bước 1 — Mục Tiêu Điểm:**

| Zone | Nội dung |
|---|---|
| Header | "Bạn muốn đạt bao nhiêu điểm TOEIC?" |
| Sub | "Chúng tôi sẽ thiết kế lộ trình riêng cho bạn." |
| Options (6 card) | 300 · 450 · 600 · 750 · 850 · 900+ — mỗi card có nhãn CEFR và ví dụ mục tiêu nghề nghiệp |
| Card Selected | Viền tím, nền tím nhạt, icon ✓ |

**Bước 2 — Deadline:**

| Zone | Nội dung |
|---|---|
| Header | "Bạn cần đạt mục tiêu trong bao lâu?" |
| Options (4 card) | 1 tháng · 3 tháng · 6 tháng · 12 tháng |
| Sub | Hiển thị ngày dự kiến thi: "Tương đương ~DD/MM/YYYY" |
| CTA | "Tiếp theo — Làm bài kiểm tra đầu vào" |

***

#### SCR-05: Placement Test

**Mục tiêu:** Xác định trình độ để gán Rank khởi đầu và cá nhân hóa Skill Tree

**Layout:** Full-screen, không có nav bar, không thể back mid-test

**Header Bar (sticky):**

| Zone | Nội dung |
|---|---|
| Tiến độ | "Câu X / 20" + progress bar xanh |
| Timer | ⏱ 15:00 countdown, màu cam khi < 2 phút |
| Loại câu | Badge nhỏ: "Part 5 · Ngữ pháp" / "Part 7 · Đọc" / "Part 1 · Nghe" |

**Body — Quiz Card:**

| Zone | Nội dung |
|---|---|
| Question Text | Font Body 16px, line-height 1.6 |
| Audio Player (Listening) | Waveform animation, nút Play lớn, không tua lại |
| Image (Part 1) | Ảnh full-width trong card |
| Options | 4 option A–D, dạng card stacked |
| Timer Progress | Thanh mỏng trên cùng, fill từ phải sang trái |

**Kết thúc Test:**
- Màn hình loading "Đang phân tích trình độ của bạn..." (1.5 giây)
- Chuyển sang SCR-06

***

#### SCR-06: Kết Quả Placement + Tạo Nhân Vật

**Layout:** 2 phần kéo lên tuần tự (ScrollView với animation)

**Phần 1 — Kết Quả:**

| Zone | Nội dung |
|---|---|
| Headline | "Trình độ hiện tại của bạn" |
| Estimated Score | Số lớn (ví dụ: **~450 TOEIC**), font Display |
| Biểu đồ Radar | 6 stat: Grammar Power, Reading Speed, Listening Reflex, Vocabulary Bank, Error Pattern IQ, Stamina |
| Rank Assigned | Badge lớn: "📋 Rank 2 — Nhân Viên Mới Vào Nghề" |
| Điểm mạnh/yếu | Tag xanh "Điểm mạnh: Ngữ pháp" + Tag đỏ "Cần cải thiện: Nghe" |

**Phần 2 — Tạo Nhân Vật:**

| Zone | Nội dung |
|---|---|
| Avatar Selector | 6 avatar RPG (Chiến binh, Pháp sư, Cung thủ, Thám tử, Học giả, Kỹ sư) — swipe chọn |
| Tên Nhân Vật | Input tên, gợi ý auto từ tên user |
| Preview | Nhân vật hiển thị với trang phục tương ứng Rank 2 |
| CTA | "Bắt Đầu Cuộc Phiêu Lưu!" — full-width vàng/gradient |

**Animation khi tap CTA:** Nhân vật xuất hiện với hiệu ứng sparkle → chuyển sang SCR-08 Home với animation wipe

***
### 3.4 Home Dashboard
#### SCR-08: Home Dashboard (Màn Hình Chính)

**Đây là màn hình trung tâm, người dùng quay lại mỗi ngày.**

**Background:** Ảnh thành phố RPG tối + overlay gradient `rgba(15,15,26,0.65)`

***

**TOP BAR (sticky, height 56px):**

| Left | Center | Right |
|---|---|---|
| [Avatar nhân vật nhỏ] [Tên · Rank Badge] | — | [🔥 X ngày] [⚡ XX,XXX KP] [🔔 N] |

- Avatar tap → mở SCR-14 Character Profile
- Rank Badge tap → mở Popup Tiến Độ Rank
- 🔔 tap → mở Drawer Thông Báo

***

**HERO AREA (center focus):**

Khu vực trung tâm, 40% chiều cao màn hình — tương tự "Sổ tay giữa bàn" trong FML

Widget chính thay đổi theo context:
- Default: **Daily Quest Card** (xem chi tiết bên dưới)
- Khi có PvP pending: **PvP Challenge Banner**
- Khi có Rank-up available: **Rank-up Ready Banner**

**Daily Quest Card (Hero):**

```
┌─────────────────────────────────────────────┐
│  ⚡ NHIỆM VỤ HÔM NAY          3 đang chờ    │
│─────────────────────────────────────────────│
│  [●] DQ-01 Từ Vựng         15p  +80 KP  →  │
│  [○] DQ-02 Nghe Part 1–2   10p  +60 KP  →  │
│  [○] DQ-03 Flash Quiz Ngữ Pháp 5p +40 KP → │
│─────────────────────────────────────────────│
│  Tiến độ hôm nay  ████░░░░░  1/3  +80 KP   │
│  [    Bắt Đầu DQ-01 Ngay    ]               │
└─────────────────────────────────────────────┘
```

***

**GRID WIDGETS (2 cột, scroll vertical):**

**Widget 1 — Streak & Mục Tiêu Tuần (full-width):**

```
┌─────────────────────────────────────────────┐
│  🔥 Streak: 18 ngày    ████████░░  72%      │
│  Mục tiêu tuần: 18/25 · còn 2 ngày          │
│  [Xem chi tiết lộ trình]                    │
└─────────────────────────────────────────────┘
```

**Widget 2 — Năng Lực (half-width trái):**

```
┌────────────────────┐
│  📊 NĂNG LỰC       │
│  [Radar Chart nhỏ] │
│  CP ~450 TOEIC     │
│  Rank 2 · Đang Học │
│  [chi tiết →]      │
└────────────────────┘
```

**Widget 3 — Lộ Trình (half-width phải):**

```
┌────────────────────┐
│  🗺️ LỘ TRÌNH       │
│  Bậc 2/6 · 35%     │
│  [Mini node path]  │
│  6% → Rank 3       │
│  [chi tiết →]      │
└────────────────────┘
```

**Widget 4 — Học Nhanh Flash Card (full-width):**

```
┌─────────────────────────────────────────────┐
│  📖 HỌC NHANH             +20 KP  [flip]   │
│─────────────────────────────────────────────│
│  "ALBEIT"                                   │
│  /ɔːlˈbiːt/ · Conjunction                  │
│  "Mặc dù, dù cho"                           │
│  Ex: "He came, albeit reluctantly."         │
│  [Đã nhớ ✓]  [Ôn lại 🔄]  [Tiếp theo →]   │
└─────────────────────────────────────────────┘
```

**Widget 5 — AI Mentor (full-width):**

```
┌─────────────────────────────────────────────┐
│  🤖 AI MENTOR                               │
│─────────────────────────────────────────────│
│  Chào [Tên]! Gợi ý của tôi hôm nay:        │
│  • 3 câu sai hôm qua đang chờ ôn lại        │
│  • Part 2 là điểm yếu nhất — học ngay       │
│  • Còn 7 nhiệm vụ để hoàn thành tuần        │
│  [Ôn câu sai ngay →]                        │
└─────────────────────────────────────────────┘
```

***

**BOTTOM NAV BAR (sticky, height 64px):**

| Tab | Icon | Label |
|---|---|---|
| 1 | 🏠 | Trang Chủ |
| 2 | ⚔️ | PvP Battle |
| 3 | 🗺️ | Skill Tree |
| 4 | 🏰 | Guild |
| 5 | 👤 | Hồ Sơ |

Active tab: icon tím, label tím, dot indicator

***
### 3.5 Luồng Học — Quiz Screen
#### SCR-09: Daily Quest Selection

**Layout:** Bottom Sheet từ dưới trượt lên (không full-screen)

| Zone | Nội dung |
|---|---|
| Header | "Chọn Nhiệm Vụ Hôm Nay" + X close |
| Quest Cards (3) | Tên quest, loại kỹ năng, thời gian ước tính, KP thưởng, trạng thái |
| Challenge Quest | Section riêng "🏆 Thử Thách Đặc Biệt" — điều kiện: hoàn thành 3 core |
| CTA | Tap card → start quest |

Quest Card structure:
```
[Icon skill] [Tên Quest]                [badge kỹ năng]
            Thời gian: 15 phút · +80 KP
[Progress bar nếu đã làm 1 phần]
[Bắt Đầu / Tiếp Tục]
```

***

#### SCR-10: Quiz Screen (Core)

**Đây là màn hình người dùng tương tác nhiều nhất.**

**Header (sticky):**

| Left | Center | Right |
|---|---|---|
| [← Back] | Câu X/Y · Part [N] | ⏱ MM:SS |

Timer màu: Trắng → Vàng (< 50%) → Cam (< 25%) → Đỏ (< 10%)
Tự động submit khi hết giờ = sai.

**Body — Grammar/Vocabulary (Part 5, 6):**

```
┌─────────────────────────────────────────────┐
│  Part 5 · Incomplete Sentences              │
│─────────────────────────────────────────────│
│  The manager asked all employees to         │
│  submit their reports _______ Friday.       │
│                                             │
│  (A) until   (B) by   (C) since  (D) for   │
│─────────────────────────────────────────────│
│  [A] until     [B] by                      │
│  [C] since     [D] for                     │
└─────────────────────────────────────────────┘
```

Option Card states:
- **Default:** Nền glass, viền `rgba(255,255,255,0.1)`, chữ trắng
- **Hover/Touch:** Nền tím nhạt `rgba(124,58,237,0.15)`, viền tím
- **Selected:** Nền tím `rgba(124,58,237,0.3)`, viền tím đậm
- **Correct:** Nền xanh `rgba(16,185,129,0.2)`, viền xanh, icon ✓ phải
- **Incorrect:** Nền đỏ `rgba(239,68,68,0.15)`, viền đỏ, icon ✗ phải

**Body — Listening (Part 1, 2, 3, 4):**

```
┌─────────────────────────────────────────────┐
│  Part 2 · Question-Response                 │
│─────────────────────────────────────────────│
│  ┌─────────────────────────────────────┐   │
│  │  🎵  ──────────●──────────  0:12   │   │
│  │       [◄◄]  [▶/⏸]  [Replay]       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Tap ▶ để nghe câu hỏi                     │
│─────────────────────────────────────────────│
│  [A] Ở phòng họp tầng 3                    │
│  [B] Vào lúc 2 giờ chiều                   │
│  [C] Đồng nghiệp của cô ấy                 │
└─────────────────────────────────────────────┘
```

Chú ý:
- Part 1, 3, 4: hiển thị ảnh / script câu hỏi
- Tự động play audio lần đầu; cho phép replay tối đa 1 lần (Free) / không giới hạn (Premium)

**Body — Reading (Part 7):**

```
┌─────────────────────────────────────────────┐
│  Part 7 · Reading Comprehension   [Mở rộng]│
│─────────────────────────────────────────────│
│  ┌──────────────────────────────────────┐  │
│  │ [Email/Memo/Article text]            │  │
│  │ Scroll trong panel này               │  │
│  │ ...                                  │  │
│  └──────────────────────────────────────┘  │
│─────────────────────────────────────────────│
│  Câu 1/3: Mục đích của email này là gì?    │
│  [A] ...  [B] ...  [C] ...  [D] ...        │
└─────────────────────────────────────────────┘
```

Split-screen layout (tablet): Passage trái, câu hỏi phải

***

#### SCR-11: Micro Feedback Overlay

**Kích hoạt:** Ngay sau khi user tap đáp án. Delay ≤ 2 giây từ BE.[^2]

**Trường hợp ĐÚNG:**

```
┌─────────────────────────────────────────────┐
│                                             │
│     ✅ CHÍNH XÁC!              +50 KP ⚡   │
│                                             │
│  [Option B] "by" — Highlighted xanh        │
│─────────────────────────────────────────────│
│  📌 TẦng 1: Dùng "by + deadline" = trước   │
│     thời hạn; "until" = liên tục đến lúc.  │
│                                             │
│  [Xem phân tích sâu]    [Tiếp theo →]      │
└─────────────────────────────────────────────┘
```

Animation: Confetti burst, KP badge fly-up, âm thanh "ding"

**Trường hợp SAI:**

```
┌─────────────────────────────────────────────┐
│                                             │
│     ❌ CHƯA ĐÚNG         +1 Insight Point  │
│                                             │
│  [Option A] "until" — Red background ✗     │
│  [Option B] "by"    — Green background ✓   │
│─────────────────────────────────────────────│
│  📌 TẦng 1: "by Friday" = hoàn thành TRƯỚC │
│     hoặc VÀO ngày thứ 6.                   │
│     "until" ám chỉ hành động kéo dài.      │
│                                             │
│  [Xem phân tích sâu]    [Tiếp theo →]      │
└─────────────────────────────────────────────┘
```

**Explanation Card mở rộng (3 tầng — Progressive Disclosure):**[^2]

| Tầng | Kích hoạt | Nội dung |
|---|---|---|
| Tầng 1 | Luôn hiển thị | Quy tắc 1 dòng + highlight từ khóa |
| Tầng 2 | Tap "Xem phân tích" | Phân tích cấu trúc câu, bảng so sánh |
| Tầng 3 | Tap "Học sâu" | Mnemonics, ví dụ thực tế, link bài học |

***

#### SCR-12: Session Summary

**Kích hoạt:** Hoàn thành một quest/session

**Layout:** Full-screen với scroll

**Phần 1 — Tổng kết:**

```
┌─────────────────────────────────────────────┐
│     🎉 Hoàn Thành DQ-01 Từ Vựng!           │
│                                             │
│     +80 KP          Streak 18 ngày 🔥      │
│     Tỷ lệ đúng: 78%    Thời gian: 13:24    │
│─────────────────────────────────────────────│
│  Kỹ năng hôm nay:                          │
│  Vocabulary    ████████░░  80%              │
│  Grammar       ██████░░░░  60%              │
│  Reading       ███████░░░  70%              │
└─────────────────────────────────────────────┘
```

**Phần 2 — AI Nhận Xét:**

```
┌─────────────────────────────────────────────┐
│  🤖 Nhận xét từ AI Mentor                  │
│─────────────────────────────────────────────│
│  Top 3 điểm yếu phiên này:                 │
│  • Prepositions of time (3 sai)            │
│  • Articles (a/an/the) — 2 sai             │
│  • Verb tenses — 1 sai                     │
│  Gợi ý: Ôn lại bài "Giới từ thời gian"    │
│  [Ôn ngay →]                               │
└─────────────────────────────────────────────┘
```

**Phần 3 — Tiến độ Level-up:**

```
┌─────────────────────────────────────────────┐
│  📈 Tiến độ lên Rank                        │
│  Rank 2 → Rank 3 (Chuyên Viên)             │
│  ██████████░░░░░░░░  4,250 / 8,000 KP      │
│  Còn 3,750 KP nữa ≈ 47 ngày học đều       │
└─────────────────────────────────────────────┘
```

**CTA:**
- "Tiếp tục DQ-02 Nghe" (primary)
- "Về Trang Chủ" (secondary)

***
### 3.6 Màn Hình Rank-up Ceremony
#### SCR-13: Rank-up Ceremony (Full-screen)

**Kích hoạt:** Tự động khi KP đạt ngưỡng rank mới. Không thể skip (5 giây), sau đó có nút tắt.[^2]

**Sequence animation (5 giây):**

```
0.0–1.0s  : Screen flash trắng → reveal nền particle vàng
1.0–2.0s  : Nhân vật animation thay trang phục (morphing)
2.0–3.0s  : Rank badge xuất hiện từ trung tâm, scale-up + glow
3.0–4.0s  : Text "THĂNG HẠNG!" drop-in từ trên
4.0–5.0s  : Confetti + KP reward burst
```

**Content:**

| Zone | Nội dung |
|---|---|
| Rank Badge mới | Icon lớn 120px, tên rank, màu theo cấp |
| Headline | "🎉 THĂNG HẠNG!" |
| Rank Name | "💼 Rank 3 — Chuyên Viên" |
| TOEIC Milestone | "Tương đương ~600 TOEIC" |
| Career Message | "Bạn đủ điều kiện ứng tuyển vị trí Junior ở các công ty quốc tế!" |
| Unlocked Items | "🔓 Mở khóa: Dungeon Mode · Chế độ PvP Ranked" |
| CTA | "Tiếp tục Hành Trình" / "Chia sẻ lên mạng xã hội" |

**Share card (auto-generated):**
Ảnh 1080×1080: Nhân vật + Rank mới + "Tôi vừa lên Rank 3 — Chuyên Viên TOEIC ~600 điểm 🏆 #TOEICQuest"

***
### 3.7 Skill Tree
#### SCR-15: Skill Tree Map

**Layout:** Full-screen scrollable map, zoom in/out bằng pinch

**Header:**

| Left | Center | Right |
|---|---|---|
| ← Back | Skill Tree | [Filter: Tất cả / Listening / Reading] |

**Map Layout:**

```
LISTENING PATH              READING PATH
    L-★ TOEIC Master (🔒)       R-★
      |                           |
    L-05 Part 4 (🔒)           R-05 Part 7 Double Passage
      |                           |
    L-04 Part 3 (🔒)           R-04 Part 6 (🔒)
      |                           |
    L-03 Part 2 (🟡 current)  R-03 Part 5 Adv (đang học)
      |                           |
    L-02 Part 1 (✅)           R-02 Vocab Power (✅)
      |                           |
    L-01 Foundation (✅)       R-01 Grammar Base (✅)
      |                           |
         [ĐIỂM XUẤT PHÁT]
              |
         FULL-★ (🔒 Boss — FULL Mock Test)
```

**Node Visual States:**

| Trạng thái | Màu | Border | Icon |
|---|---|---|---|
| Hoàn thành | Vàng `#F59E0B` | Glow vàng | ✅ |
| Đang học/Mở | Xanh `#10B981` | Pulse xanh | ▶ |
| Locked | Xám `#374151` | Mờ | 🔒 |
| Dungeon/Boss | Đỏ tím `#7C3AED` | Glow tím | ⚔️ |

**Kết nối giữa nodes:** Đường gradient glowing, màu theo trạng thái

***

#### SCR-16: Node Detail Popup

**Kích hoạt:** Tap vào node bất kỳ

**Layout:** Bottom Sheet 60% chiều cao

| Zone | Nội dung |
|---|---|
| Icon + Tên | L-03 · "Short Conversations — Part 2" |
| Mô tả | "Luyện kỹ năng nhận diện câu trả lời đúng từ cặp hội thoại ngắn 3–4 giây." |
| KP Reward | +350 KP khi hoàn thành |
| Điều kiện mở | ✓ Hoàn thành L-02 + Grammar Power ≥ 30 |
| Nội dung bao gồm | 12 bài học · 8 quiz · 2 mini test |
| Tiến độ (nếu đang học) | 4/12 bài · ██░░░░░░░░ 33% |
| CTA | "Tiếp Tục Học" / "Bắt Đầu" / "🔒 Chưa mở khóa" |

***
### 3.8 PvP Battle
#### SCR-17: PvP Lobby

**Layout:** Full-screen, nền arena RPG tối

**Header:** "⚔️ PvP Battle" + ELO hiện tại: [1,150 ELO]

**Mode Selection (3 card):**

| Mode | Mô tả | Điều kiện |
|---|---|---|
| 🏆 Ranked | ELO +/- | Rank ≥ 2 |
| 🎮 Casual | Không ảnh hưởng ELO | Tất cả |
| 📨 Challenge Friend | Mời bạn bè | Nhập username |

**Leaderboard Preview (mini):** Top 3 người cùng Rank tuần này

**Recent Matches:**

```
vs NguyenVanA   |  82-74  |  ✅ Thắng   | 07/06
vs TranThiB     |  65-65  |  ⚖ Hòa     | 06/06
vs LeVanC       |  45-79  |  ❌ Thua    | 05/06
```

***

#### SCR-18: Matchmaking Screen

**Layout:** Center-focused, nhân vật user bên trái VS [?] bên phải

**Sequence:**

```
[0–3s]   Searching animation — ripple circles
[3–8s]   Opponent found — slide in từ phải
         [Avatar] TranThiB · Rank 3 · ELO 1,175
         "Trận đấu bắt đầu sau... 3... 2... 1..."
[8s+]    Transition → Battle Screen
```

**Pre-match info:**
- Số câu: 10 câu
- Thời gian/câu: 20 giây
- Loại câu: Grammar + Vocabulary (dựa theo Rank)

***

#### SCR-19: Battle Screen (Real-time)

**Layout:** Chia 2 nửa rõ ràng

**Top Half — Đối thủ:**

```
┌─────────────────────────────────────────────┐
│  TranThiB · Rank 3         [Score: 35]      │
│  ████████░░ 4/10 đúng                       │
│  Status: "Đang suy nghĩ..." (3 chấm chạy)  │
│  "Đối thủ đã trả lời! ⚡"                  │
└─────────────────────────────────────────────┘
```

**Divider:** VS badge + progress bar "Câu 5/10"

**Bottom Half — Bạn:**

```
┌─────────────────────────────────────────────┐
│  [Tên của bạn] · Rank 2    [Score: 28]      │
│  ██████░░░░ 3/10 đúng                       │
│─────────────────────────────────────────────│
│  [Câu hỏi + 4 options như SCR-10]           │
│                                             │
│  ⏱ 00:15                                   │
└─────────────────────────────────────────────┘
```

**Real-time events (WebSocket):**[^2]
- "Đối thủ đã trả lời đúng! +15 điểm" — notification nhỏ flash
- "Bạn dẫn trước 5 điểm!" — banner xanh
- "Đối thủ vượt lên!" — banner đỏ

***

#### SCR-20: Battle Result

**Layout:** Full-screen với animation

**WIN:**

```
┌─────────────────────────────────────────────┐
│        🏆 CHIẾN THẮNG!                      │
│                                             │
│   [Bạn]  85  VS  72  [TranThiB]            │
│                                             │
│   ELO: 1,150 → 1,180  (+30) ⬆              │
│   KP: +300 ⚡                               │
│   🎁 Item drop: Streak Freeze x1            │
│─────────────────────────────────────────────│
│  [Tái đấu]    [Tìm trận mới]    [Về nhà]   │
└─────────────────────────────────────────────┘
```

**LOSE:**

```
│        💪 TRẬN NÀY CHƯA THẮNG             │
│   ELO: 1,150 → 1,140  (-10) ⬇             │
│   KP: +50 ⚡ (khuyến khích tiếp tục)       │
│  [Tái đấu]    [Về nhà]                     │
```

***
### 3.9 Guild System
#### SCR-21: Guild Hub

**Layout:** Full-screen scroll

**Header:** Banner guild + Tên Guild + Level + "X/20 thành viên"

**Sections:**

| Section | Nội dung |
|---|---|
| Guild Progress | Quest Guild hiện tại + progress bar + thời gian còn lại |
| Leaderboard | Top 5 thành viên đóng góp KP tuần này |
| Activity Feed | "NguyenA hoàn thành DQ-02" · "TranB lên Rank 3" |
| Chat | Tab chat nhóm — text + emoji reaction |
| Guild Chest | Tiến độ mở Rương Guild (tổng KP đóng góp) |

**CTA:**
- Thành viên: "Đóng góp KP" / "Xem Quest"
- Guild Master: "Quản lý" / "Gửi thông báo"

***

#### SCR-22: Dungeon Entry Warning

**Kích hoạt:** Tap vào node Dungeon (L-★, R-★, FULL-★)[^2]

**Layout:** Modal cảnh báo full-screen overlay

```
┌─────────────────────────────────────────────┐
│                                             │
│         ⚔️ DUNGEON MODE                    │
│                                             │
│  L-★ Listening Challenge · 50 câu · 45 phút│
│─────────────────────────────────────────────│
│  ⚠️ CẢNH BÁO:                              │
│  • Không thể thoát giữa chừng               │
│  • Không có giải thích trong khi thi        │
│  • Mô phỏng điều kiện thi thật TOEIC        │
│─────────────────────────────────────────────│
│  🏆 Phần thưởng:  +8,000 KP + Badge        │
│  🎁 Lần đầu hoàn thành: Rương Bạc          │
│─────────────────────────────────────────────│
│  [Hủy]              [Vào Dungeon ⚔️]        │
└─────────────────────────────────────────────┘
```

***
### 3.10 Character Profile & Stats
#### SCR-14: Character Profile

**Layout:** Full-screen scroll

**Phần 1 — Character Card:**

```
┌─────────────────────────────────────────────┐
│  [Avatar nhân vật full, có trang phục Rank] │
│                                             │
│  [Tên nhân vật]                            │
│  💼 Rank 3 — Chuyên Viên                  │
│  TOEIC Estimated: ~600 điểm               │
│  Tổng KP: 8,250    Streak: 18 ngày 🔥     │
│  ELO PvP: 1,180                            │
│  Top 23% trong cộng đồng                  │
└─────────────────────────────────────────────┘
```

**Phần 2 — 6 Stat Chart:**

```
┌─────────────────────────────────────────────┐
│  📊 CHỈ SỐ NHÂN VẬT                        │
│─────────────────────────────────────────────│
│  [Biểu đồ lục giác 6 cạnh, nền tối]        │
│  🛡 Grammar Power     75/100               │
│  📖 Reading Speed     60/100               │
│  👂 Listening Reflex  45/100               │
│  📝 Vocabulary Bank   70/100               │
│  🧩 Error Pattern IQ  55/100               │
│  ⚡ Stamina           80/100               │
└─────────────────────────────────────────────┘
```

**Phần 3 — Achievements:**

```
┌─────────────────────────────────────────────┐
│  🏆 THÀNH TÍCH                              │
│─────────────────────────────────────────────│
│  🔥 Streak 14 ngày ✅   🔥 Streak 30 ngày 🔒│
│  ⚔️ PvP Win x10 ✅     ⚔️ PvP Win x50 🔒  │
│  📚 Skill Tree 50% ✅   📚 100% 🔒          │
└─────────────────────────────────────────────┘
```

**Phần 4 — Premium Status:**

Free users: Banner "⭐ Nâng Cấp Premium — Mở Full Content + AI Tutor"
Premium: Badge xanh "✨ Premium Active" + ngày hết hạn

***
### 3.11 Streak Management
#### SCR-23: Streak Milestone Celebration

**Kích hoạt:** Đạt mốc streak 3/7/14/30/60/100 ngày

**Layout:** Modal celebration xuất hiện sau khi hoàn thành daily quest

```
┌─────────────────────────────────────────────┐
│     🔥 STREAK 7 NGÀY! 🔥                   │
│─────────────────────────────────────────────│
│  [Animation lửa + confetti]                 │
│                                             │
│  Phần thưởng nhận được:                    │
│  🧊 Streak Freeze x1                       │
│  ⚡ +500 KP                                │
│  🏅 Badge "Week Warrior"                   │
│─────────────────────────────────────────────│
│       [Nhận Phần Thưởng!]                  │
└─────────────────────────────────────────────┘
```

***

#### SCR-24: Streak Recovery Screen

**Kích hoạt:** User mở app sau khi đã mất streak (trong vòng 24h)[^2]

```
┌─────────────────────────────────────────────┐
│  💔 Streak 18 ngày của bạn đã mất...        │
│─────────────────────────────────────────────│
│  Nhưng bạn còn 18 giờ để khôi phục!        │
│─────────────────────────────────────────────│
│  CÁCH KHÔI PHỤC:                           │
│  Hoàn thành 2× Daily Quest hôm nay         │
│  ██░░░░░░░░░░  0/2 hoàn thành              │
│─────────────────────────────────────────────│
│  HOẶC: Dùng Streak Freeze (bạn có 1 cái)  │
│  [Dùng Streak Freeze 🧊]                   │
│─────────────────────────────────────────────│
│  [Bắt Đầu Nhiệm Vụ Ngay]                  │
└─────────────────────────────────────────────┘
```

***
### 3.12 Notifications & Premium
#### SCR-25: Notification Center

**Layout:** Drawer từ phải trượt vào

**Header:** "Thông Báo" + "Đánh dấu tất cả đã đọc"

**Item types:**

| Type | Icon | Nội dung mẫu |
|---|---|---|
| Daily Quest Ready | ⚡ | "Nhiệm vụ hôm nay đã sẵn sàng! +180 KP đang chờ bạn." |
| Streak Warning | ⚠️ | "Streak 18 ngày của bạn sẽ mất sau 4 giờ!" |
| PvP Challenge | ⚔️ | "NguyenA vừa thách đấu bạn! Chấp nhận để giữ ELO." |
| Guild Activity | 🏰 | "Guild Quest gần hết hạn — còn 3 giờ!" |
| Rank-up Ready | 🏆 | "Bạn gần đạt Rank 4! Chỉ còn 350 KP nữa." |
| System | ℹ️ | "Double XP Weekend bắt đầu từ tối nay!" |

**Swipe actions trên item:** Xóa (swipe phải) / Đánh dấu đã đọc (swipe trái)

***

#### SCR-26: Premium Upgrade

**Kích hoạt:** Tap "Nâng cấp Premium" hoặc auto-trigger sau 14-day streak[^2]

**Layout:** Bottom sheet 90% màn hình

**Header:** "⭐ Mở Khóa Toàn Bộ TOEIC Quest"

**Tier Cards:**

```
┌──────────────────┐  ┌──────────────────┐
│  PREMIUM         │  │  PREMIUM+  ⭐    │
│  99,000 VNĐ/tháng│  │ 249,000 VNĐ/tháng│
│ ─────────────── │  │ ─────────────── │
│ ✓ Full Skill Tree│  │ ✓ Tất cả Premium │
│ ✓ Unlimited PvP  │  │ ✓ AI Tutor 1:1   │
│ ✓ Full Mock Tests│  │ ✓ Phân tích sâu  │
│ ✓ No Ads        │  │ ✓ Exam Voucher -20%│
│ ✓ AI Suggestions │  │                  │
│  [Dùng thử 7 ngày]│  │  [Chọn Gói]     │
└──────────────────┘  └──────────────────┘
```

**Social Proof:** "🔥 12,450 người dùng Premium đang học cùng bạn"

**Trust signals:** Hoàn tiền trong 7 ngày · Hủy bất cứ lúc nào · Thanh toán qua App Store / Google Play / MoMo / ZaloPay

***
## 4. TRẠNG THÁI ĐẶC BIỆT (Edge Cases & States)
### 4.1 Empty States
| Màn hình | Empty State |
|---|---|
| PvP History (chưa chơi) | Ảnh minh họa arena trống + "Hãy thách đấu trận đầu tiên!" + CTA |
| Guild (chưa có) | "Bạn chưa thuộc Guild nào. Tạo hoặc tham gia Guild ngay!" |
| Notifications | "Không có thông báo mới. Tiếp tục học để nhận milestone!" |
| Leaderboard (tuần đầu) | "Chưa có dữ liệu. Hoàn thành Daily Quest để lên bảng xếp hạng!" |
### 4.2 Loading States
- **Skeleton Screen:** Dùng cho Home Dashboard, Skill Tree — hiển thị placeholder có animation shimmer thay vì spinner
- **Inline Spinner:** Dùng khi submit quiz answer — disable button + hiện spinner nhỏ trong nút
- **Full-screen Loading:** Chỉ dùng cho Matchmaking và Dungeon start
### 4.3 Error States
| Lỗi | Hiển thị |
|---|---|
| Mất kết nối Internet | Toast banner đỏ "Mất kết nối. Dữ liệu sẽ sync khi có mạng." |
| Server error (5xx) | Modal "Có lỗi xảy ra. Vui lòng thử lại." + Retry button |
| Audio không tải (Listening) | "Không thể tải audio. Tap để thử lại." + icon tải lại |
| PvP connection drop | "Kết nối bị gián đoạn. Trận đấu sẽ tính hòa." |
### 4.4 Offline Mode
Daily Quest core content (câu hỏi đã tải sẵn) hoạt động offline. Hiển thị banner "🔌 Đang offline — Sẽ sync KP khi có mạng" ở top. PvP và Guild không hoạt động offline.[^2]

***
## 5. ANIMATION & MICRO-INTERACTIONS
### 5.1 Bảng Animation
| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Mở app → Home | Fade + scale-up | 400ms | easeOut |
| Tap đáp án → Feedback | Color fill + bounce | 200ms | spring |
| KP award | Badge fly-up + bounce | 600ms | spring |
| Streak update | Fire burst + counter roll | 500ms | easeOut |
| Rank-up | Full sequence (5s) | 5,000ms | custom |
| Modal open | Slide up | 300ms | easeOut |
| Modal close | Slide down + fade | 250ms | easeIn |
| Node unlock | Glow pulse + scale | 800ms | spring |
| Level bar fill | Width transition | 1,000ms | easeInOut |
| Correct answer | Confetti burst | 800ms | physics |
| Wrong answer | Shake + red flash | 400ms | elastic |
### 5.2 Haptic Feedback (Mobile)
| Sự kiện | Haptic pattern |
|---|---|
| Đáp án đúng | Medium impact |
| Đáp án sai | Error notification |
| KP nhận được | Light + medium sequence |
| Rank-up | Heavy impact series |
| Tap button | Light tap |

***
## 6. ACCESSIBILITY (Khả Năng Tiếp Cận)
| Tiêu chí | Yêu cầu |
|---|---|
| Contrast ratio | Tối thiểu 4.5:1 cho chữ thường; 3:1 cho chữ lớn (WCAG AA)[^2] |
| Font size | Hỗ trợ Dynamic Type (iOS) / Font Scale (Android) × 1.5 |
| High contrast mode | Toggle trong Settings — tăng contrast panel |
| Screen reader | VoiceOver (iOS) / TalkBack (Android) với aria-labels đầy đủ |
| Audio descriptions | Listening questions có transcript toggle (Premium) |
| Touch targets | Tối thiểu 44×44pt (iOS HIG standard) |
| Color-blind mode | Không phân biệt trạng thái chỉ bằng màu — luôn kết hợp icon |

***
## 7. DESIGN HANDOFF CHECKLIST
### Phase 1 — MVP Screens (ưu tiên thiết kế trước)
| # | Màn hình | Component key |
|---|---|---|
| 1 | SCR-01 Splash | — |
| 2 | SCR-02 Onboarding (3 slides) | Illustration set |
| 3 | SCR-03 Auth | Form inputs, social buttons |
| 4 | SCR-04 Goal Setting | Selection cards |
| 5 | SCR-05 Placement Test | Quiz core, audio player, timer |
| 6 | SCR-06 Result + Character | Radar chart, avatar selector |
| 7 | SCR-08 Home Dashboard | All widgets, top bar, bottom nav |
| 8 | SCR-09 Quest Selection | Quest cards |
| 9 | SCR-10 Quiz Screen | Options, audio player, reading panel |
| 10 | SCR-11 Micro Feedback | Feedback overlay, explanation card |
| 11 | SCR-12 Session Summary | Stats, AI review, progress |
| 12 | SCR-13 Rank-up Ceremony | Animation specs |
| 13 | SCR-14 Character Profile | Stat chart, achievement grid |
| 14 | SCR-26 Premium Upgrade | Tier cards |
### Phase 2 — Social Screens
| # | Màn hình |
|---|---|
| 15 | SCR-15 Skill Tree Map |
| 16 | SCR-16 Node Detail |
| 17 | SCR-17 PvP Lobby |
| 18 | SCR-18 Matchmaking |
| 19 | SCR-19 Battle Screen |
| 20 | SCR-20 Battle Result |
| 21 | SCR-21 Guild Hub |
| 22 | SCR-22 Dungeon Warning |
| 23 | SCR-23 Streak Milestone |
| 24 | SCR-24 Streak Recovery |
| 25 | SCR-25 Notification Center |

***
## 8. TƯƠNG ĐỒNG & ĐIỂM PHÂN BIỆT VỚI FML REFERENCE
| Yếu tố thiết kế | FML (Tham chiếu) | TOEIC RPG Hub |
|---|---|---|
| Nền cảnh | Thành phố hiện đại, góc nhìn cao | Thành phố RPG tối, ánh đèn neon |
| Widget layout | Desktop-first, multi-panel | Mobile-first, vertical scroll |
| Hệ điểm | KP (Marketing skills) | KP (TOEIC skills) + ELO PvP |
| Thanh tiến trình cấp | 5 bậc Marketing | 6 Rank nghề nghiệp TOEIC |
| AI Mentor | Quả cầu 3D, rule-based[^1] | AI Orb, IRT-backed suggestions |
| Skill radar | 6 kỹ năng Marketing | 6 stat RPG (Grammar, Listening, etc.) |
| Lộ trình học | Node path nhánh nghề | Skill Tree 2 nhánh L+R |
| PvP | Chưa có | Ranked + Casual + ELO |
| Community | Hỏi đáp, thảo luận | Guild + PvP + Leaderboard |
| Sticky Notes | Ghi chú góc bàn | Không có (thay bằng Notification Drawer) |

***

*Tài liệu này là bản đặc tả thiết kế giao diện (UI Design Spec) toàn trình cho ứng dụng TOEIC RPG Hub, phục vụ handoff cho Designer và Developer. Mọi quyết định thiết kế đều căn cứ BRD_TOEIC_GAM_v1.0 và tham chiếu hệ thống FML.*

---

## References

1. [Thiet-ke-giao-dien-tham-khao-3887f17991418077a568e793ca4bafee.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/159685550/1382212f-62b0-4c85-a8ac-cd924a09a0ff/Thiet-ke-giao-dien-tham-khao-3887f17991418077a568e793ca4bafee.md?AWSAccessKeyId=ASIA2F3EMEYEZRU3COFD&Signature=u4v3SBeuISOEPkmyv6Umh3jD0WA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEEoaCXVzLWVhc3QtMSJHMEUCIQDt5n03Gw7NwLTCBoeywnBQJpLK9wn5CEfun1rMdMuUOQIgF49cvOkHZjTmjmvHsKiC%2FIcZtSl1UZ%2F3BorZEy6LEsEq8wQIExABGgw2OTk3NTMzMDk3MDUiDKh0%2BZsnFdQNgp2L8irQBCFD%2BBtV%2FJAobzZpY3MbFtSR5maV8mhv68Gg6jlP5UkEgKPNA%2BuxgLH9BxE0QB5BEgpkhhr7lRQ6nbnORyITJfAlfMyJInPCGwqlTuUlXtD0g7xUc%2FCRIQZfvCVEGdXcp%2F7jSMZIZxuiDgYq0Em%2BhnifAZxRWVSApzTXg5el2OnmawXaMe7RediYxONTNNMU0njVl%2FG0cFTfNvyFCGo%2F61uxX3CL3OhfOVj2R%2Be0XEoteZMWCiLwaVGc9CkcWp1igN6GKSas75PbRk2hLMKKsuQG1pfzqV85vmMaqUdNZqo5qkh0LGdj6Cq7Yw7dBMUSyx5hfdJdWnud%2FMu1zMyid0pCbd5WaQV%2BSVqrQUR9K3en65MCeoPmhYkPyW2A83ZSBdalV%2FvL0o8ZyJJV1rhMb%2Bgf368LlEorThjfTXhHVXFZT9Mua4sJdrtES5%2BC%2FTHFqXsfI2RdRl8jXU20ZnMC71oOqbbC8CXfDVCxAafd3gB03hk8cgJ7LmzClwGtGrFRnQ2DG8oj8jTYh0c%2BrZB6VYWGBXNf0lgZoQv%2FEf9HJXJ3wcpnVO0Hs1eSFZvtl9MBzD0RkKzLgNMEA9Hg%2BLkEc%2BOujy83yLmkUuYvNKXeIz0B8gHjQgw4VdCaVNnAW06oOkEQKEM%2BuANsHTpGtmevXwWm%2BI1anX7juW6KCoQzOZ6qI9naVX0s4tWjMr3Qo9rGzxhugEMUsIzz0d5xu312HugfwgzPJDE6TRNdVXLJkMooIzHrVbjoNId2AheKOU9je9QqFc1oqISu9G%2BxML3gblgws8rn0QY6mAE2fhMMRJPPzJJ5Z%2FTzMLSl7BjvMROkbQZ%2FGfmI%2F84s1ovkuN%2FZ6fGACfS3oKbF0Kb%2FxKOtCTHIzWNuE1s9AkWpP2EhN1CSw13pyglO6lVlFhko3ybD3CeQ5vvHLtG%2FCzeixQW1BayTXPb3MU9uB5rnhaPY%2Btqr6HADhRjMxLjRLzd9krbPcbLyR5hEBlYl0TIElQD18ydxIg%3D%3D&Expires=1782182662) - # Thiết kế giao diện tham khảo

Tiến độ: 0%
Trạng thái: Chưa bắt đầu

### Chào bạn, với tư cách là C...

2. [BRD-Ung-Dung-Hoc-TOEIC-Gamification-All-in-One-RPG-Hub.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/159685550/dc1da03b-9732-443c-a710-955645b04060/BRD-Ung-Dung-Hoc-TOEIC-Gamification-All-in-One-RPG-Hub.md?AWSAccessKeyId=ASIA2F3EMEYEZRU3COFD&Signature=PGK2wAd3oZ3vOl2BI5EPmSMMqV0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEEoaCXVzLWVhc3QtMSJHMEUCIQDt5n03Gw7NwLTCBoeywnBQJpLK9wn5CEfun1rMdMuUOQIgF49cvOkHZjTmjmvHsKiC%2FIcZtSl1UZ%2F3BorZEy6LEsEq8wQIExABGgw2OTk3NTMzMDk3MDUiDKh0%2BZsnFdQNgp2L8irQBCFD%2BBtV%2FJAobzZpY3MbFtSR5maV8mhv68Gg6jlP5UkEgKPNA%2BuxgLH9BxE0QB5BEgpkhhr7lRQ6nbnORyITJfAlfMyJInPCGwqlTuUlXtD0g7xUc%2FCRIQZfvCVEGdXcp%2F7jSMZIZxuiDgYq0Em%2BhnifAZxRWVSApzTXg5el2OnmawXaMe7RediYxONTNNMU0njVl%2FG0cFTfNvyFCGo%2F61uxX3CL3OhfOVj2R%2Be0XEoteZMWCiLwaVGc9CkcWp1igN6GKSas75PbRk2hLMKKsuQG1pfzqV85vmMaqUdNZqo5qkh0LGdj6Cq7Yw7dBMUSyx5hfdJdWnud%2FMu1zMyid0pCbd5WaQV%2BSVqrQUR9K3en65MCeoPmhYkPyW2A83ZSBdalV%2FvL0o8ZyJJV1rhMb%2Bgf368LlEorThjfTXhHVXFZT9Mua4sJdrtES5%2BC%2FTHFqXsfI2RdRl8jXU20ZnMC71oOqbbC8CXfDVCxAafd3gB03hk8cgJ7LmzClwGtGrFRnQ2DG8oj8jTYh0c%2BrZB6VYWGBXNf0lgZoQv%2FEf9HJXJ3wcpnVO0Hs1eSFZvtl9MBzD0RkKzLgNMEA9Hg%2BLkEc%2BOujy83yLmkUuYvNKXeIz0B8gHjQgw4VdCaVNnAW06oOkEQKEM%2BuANsHTpGtmevXwWm%2BI1anX7juW6KCoQzOZ6qI9naVX0s4tWjMr3Qo9rGzxhugEMUsIzz0d5xu312HugfwgzPJDE6TRNdVXLJkMooIzHrVbjoNId2AheKOU9je9QqFc1oqISu9G%2BxML3gblgws8rn0QY6mAE2fhMMRJPPzJJ5Z%2FTzMLSl7BjvMROkbQZ%2FGfmI%2F84s1ovkuN%2FZ6fGACfS3oKbF0Kb%2FxKOtCTHIzWNuE1s9AkWpP2EhN1CSw13pyglO6lVlFhko3ybD3CeQ5vvHLtG%2FCzeixQW1BayTXPb3MU9uB5rnhaPY%2Btqr6HADhRjMxLjRLzd9krbPcbLyR5hEBlYl0TIElQD18ydxIg%3D%3D&Expires=1782182662) - # BRD — Ứng Dụng Học TOEIC Gamification (All-in-One RPG Hub)

> **Mã tài liệu:** BRD_TOEIC_GAM_v1.0 ...

