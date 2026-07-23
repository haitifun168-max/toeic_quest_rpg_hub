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

module.exports = {
  callClaude,
  generateDiagnosticReport,
  explainQuestion
};
