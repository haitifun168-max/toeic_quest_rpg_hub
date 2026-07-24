const getFetch = () => {
  if (typeof fetch !== 'undefined') return fetch;
  try {
    return require('node-fetch');
  } catch (e) {
    return globalThis.fetch;
  }
};

const API_KEY = process.env.ANTHROPIC_API_KEY;
const BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.leeh.dev';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4.8';

/**
 * Call Anthropic Messages API
 */
async function callClaude(messages, maxTokens = 256) {
  if (!API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is missing in environment variables');
  }

  const _fetch = getFetch();
  const response = await _fetch(`${BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`AI Service Error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  const textContent = data.content?.map(c => c.text).join('\n') || '';
  return textContent;
}

/**
 * Generate RPG Diagnostic Report for TOEIC Learners
 */
async function generateDiagnosticReport({ score, targetScore, partStats, incorrectSummary }) {
  const prompt = `Bạn là AI RPG Mentor trong game "TOEIC Quest RPG". 
Tạo báo cáo chẩn đoán trình độ học viên bằng phong cách Game RPG độc đáo.

Thông tin:
- Điểm hiện tại: ${score} / 990
- Mục tiêu: ${targetScore || 750} / 990
- Thống kê Part: ${JSON.stringify(partStats || {})}
- Lỗi sai: ${incorrectSummary || 'Part 5 ngữ pháp'}

Trả về Markdown ngắn gọn:
1. 🗡️ **Đánh giá Đẳng cấp RPG**
2. 🎯 **Điểm yếu Cần Khắc Phục (Boss Weakness)**
3. ⚔️ **Chiến thuật Luyện tập (Quest Recommendations)**`;

  const messages = [{ role: 'user', content: prompt }];
  return await callClaude(messages, 256);
}

/**
 * Explain a specific TOEIC Question like an AI NPC Tutor
 */
async function explainQuestion({ questionText, options, correctAnswer, userSelection, part }) {
  const prompt = `Bạn là Pháp Sư Giảng Bài (AI NPC Tutor) trong TOEIC Quest RPG.
Giải thích chi tiết câu hỏi TOEIC ${part ? `Part ${part}` : ''}:

Câu hỏi: "${questionText}"
Các phương án: ${JSON.stringify(options || [])}
Đáp án đúng: ${correctAnswer}
Người học chọn: ${userSelection}

Trả về ngắn gọn tiếng Việt:
1. 💡 **Tại sao đáp án ${correctAnswer} đúng**
2. ⚠️ **Phân tích sai khi chọn ${userSelection}**
3. 📚 **Mẹo/Từ vựng đắt giá**`;

  const messages = [{ role: 'user', content: prompt }];
  return await callClaude(messages, 256);
}

/**
 * Phân tích các câu trả lời sai và trả về tối đa 3 chủ điểm yếu (tiếng Việt)
 * để AI Mentor gợi ý ôn tập ở màn Session Summary.
 *
 * wrongItems: [{ questionText, correctAnswer, userAnswer, part }]
 * Trả về mảng string. Ném lỗi nếu thiếu key/parse fail để caller fallback.
 */
async function analyzeWeaknesses(wrongItems) {
  if (!Array.isArray(wrongItems) || wrongItems.length === 0) {
    return [];
  }

  // Trong test: không gọi network, để caller dùng fallback heuristic (deterministic).
  if (process.env.NODE_ENV === 'test') {
    throw new Error('AI disabled in test environment');
  }

  const itemsText = wrongItems
    .map(
      (it, i) =>
        `${i + 1}. [Part ${it.part || '?'}] "${it.questionText}" | Đáp án đúng: ${it.correctAnswer} | Người học chọn: ${it.userAnswer}`
    )
    .join('\n');

  const prompt = `Bạn là AI Mentor trong game TOEIC Quest RPG. Dưới đây là các câu người học trả lời SAI:
${itemsText}

Phân tích và rút ra tối đa 3 chủ điểm ngữ pháp/kỹ năng người học cần ôn tập.
Chỉ trả về JSON array các chuỗi tiếng Việt ngắn gọn (mỗi chuỗi <= 90 ký tự), không thêm giải thích.
Ví dụ: ["Thì hiện tại hoàn thành", "Giới từ chỉ thời gian", "Từ vựng thương mại"]`;

  const raw = await callClaude([{ role: 'user', content: prompt }], 256);

  // Trích JSON array từ output (phòng khi model bọc thêm text).
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error('AI weakness analysis: no JSON array in response');
  }
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) {
    throw new Error('AI weakness analysis: parsed value is not an array');
  }
  return parsed
    .filter((s) => typeof s === 'string' && s.trim().length > 0)
    .slice(0, 3);
}

module.exports = {
  callClaude,
  generateDiagnosticReport,
  explainQuestion,
  analyzeWeaknesses
};
