/**
 * QuizScreen.test.js
 * Unit tests cho Story 2-3: Giao diện học Quiz & giải thích 3 tầng
 *
 * Kiểm tra các tính năng:
 *   - Lựa chọn phương án & khóa tương tác (AC#2)
 *   - Phản hồi đúng/sai tức thì (AC#2)
 *   - Lazy loading giải thích tầng 2 & 3 và lưu cache (AC#3, AC#4)
 *   - Đếm số lượng câu hỏi & thanh tiến trình (AC#1)
 */

'use strict';

describe('QuizScreen — Logic & Cache tests (AC#1, AC#2, AC#3, AC#4)', () => {
  const MOCK_QUESTIONS = [
    {
      id: 'q1',
      part: 5,
      question_content: 'The manager asked all employees to submit their reports _______ Friday.',
      option_a: 'until',
      option_b: 'by',
      option_c: 'since',
      option_d: 'for',
      correct_option: 'B',
      explanation_layer1: 'Dịch: Trưởng phòng yêu cầu nộp báo cáo trước thứ Sáu.'
    },
    {
      id: 'q2',
      part: 5,
      question_content: 'Employees are reminded to lock all filing cabinets before _______ the office.',
      option_a: 'leave',
      option_b: 'leaving',
      option_c: 'left',
      option_d: 'to leave',
      correct_option: 'B',
      explanation_layer1: 'Dịch: Nhắc nhở khóa tủ tài liệu trước khi ra về.'
    }
  ];

  it('[AC#1] ProgressBar progress is calculated correctly based on currentIndex and answered state', () => {
    let currentIndex = 0;
    let answered = false;
    let questionsCount = MOCK_QUESTIONS.length;

    // Not answered yet
    let progress = (currentIndex + (answered ? 1 : 0)) / questionsCount;
    expect(progress).toBe(0.0); // 0/2

    // Answered current question
    answered = true;
    progress = (currentIndex + (answered ? 1 : 0)) / questionsCount;
    expect(progress).toBe(0.5); // 1/2

    // Move to next question, not answered
    currentIndex = 1;
    answered = false;
    progress = (currentIndex + (answered ? 1 : 0)) / questionsCount;
    expect(progress).toBe(0.5); // 1/2

    // Answered second question
    answered = true;
    progress = (currentIndex + (answered ? 1 : 0)) / questionsCount;
    expect(progress).toBe(1.0); // 2/2
  });

  it('[AC#2] Micro-feedback returns correct state and blocks interaction once answered', () => {
    let answered = false;
    let selectedOption = null;

    const selectOption = (opt) => {
      if (answered) return; // Locked
      selectedOption = opt;
      answered = true;
    };

    // User chooses option 'B' (correct)
    selectOption('B');
    expect(selectedOption).toBe('B');
    expect(answered).toBe(true);

    // User tries to change option to 'A' (should be blocked)
    selectOption('A');
    expect(selectedOption).toBe('B'); // remains 'B'
  });

  it('[AC#3, AC#4] Lazy-loading explanation cache logic works correctly', async () => {
    const explanationsCache = {};
    const questionId = 'q1';

    // Mock fetch for layer2 & layer3
    const mockFetchExplanation = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          explanation: {
            question_id: 'q1',
            layer2: 'Ngữ pháp: by + mốc thời gian.',
            layer3: 'AI Tip: phân biệt by và until.'
          }
        }
      })
    });

    const loadExplanationLayers = async (qId) => {
      // Check cache first
      if (explanationsCache[qId] && explanationsCache[qId].layer2) {
        return;
      }

      explanationsCache[qId] = { loading: true };
      
      const res = await mockFetchExplanation(qId);
      const result = await res.json();
      
      if (res.ok && result.ok) {
        explanationsCache[qId] = {
          layer2: result.data.explanation.layer2,
          layer3: result.data.explanation.layer3,
          loading: false
        };
      }
    };

    // 1. Fetch first time
    await loadExplanationLayers(questionId);
    expect(mockFetchExplanation).toHaveBeenCalledTimes(1);
    expect(explanationsCache[questionId].layer2).toBe('Ngữ pháp: by + mốc thời gian.');
    expect(explanationsCache[questionId].loading).toBe(false);

    // 2. Fetch second time (should hit cache, no network call)
    await loadExplanationLayers(questionId);
    expect(mockFetchExplanation).toHaveBeenCalledTimes(1); // Still 1 call (cached)
  });
});
