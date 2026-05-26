/**
 * ai-dialogue.js
 * AI对话模块 - 苏格拉底式提问与角色扮演对话
 * 模拟AI助手进行深度对话，引导用户构建人设
 */

/**
 * 苏格拉底式提问流程
 * 通过层层深入的问题帮助用户明确人设
 */
const SOCRATIC_QUESTIONS = [
  {
    id: 'field',
    stage: '探索领域',
    question: '你好呀！我是你的人设助手 ✨ 首先，我想了解一下——你希望打造的人设主要活跃在哪个领域呢？比如 AI技术、产品设计、创业投资，或者别的什么？',
    followUps: [
      '能具体说说是哪个细分方向吗？比如{field}里面的哪个具体方向最吸引你？',
      '哦？{field}是个很有意思的领域！你在这个领域里大概有多久了？'
    ],
    hints: ['AI技术', '产品设计', '创业投资', '自媒体', '金融', '教育', '医疗健康']
  },
  {
    id: 'role',
    stage: '定位角色',
    question: '明白了！那在朋友圈里，你希望扮演一个什么样的角色呢？',
    followUps: [
      '听起来不错！你觉得你和其他做{role}的人最大的不同是什么？',
      '做{role}的话，你更偏向哪种风格——是那种干货满满的专家型，还是轻松有趣的分享型？'
    ],
    hints: ['行业专家', '意见领袖', '知识分享者', '生活达人', '创业者', '投资人']
  },
  {
    id: 'experience',
    stage: '丰富背景',
    question: '一个有说服力的人设需要扎实的背景。可以分享一下你的职业经历或者专业背景吗？',
    followUps: [
      '这段经历很有故事性！你觉得这段经历中，什么对你的{field}认知影响最大？',
      '如果要在朋友圈里提到这段经历，你会怎么自然地分享出来？'
    ],
    hints: []
  },
  {
    id: 'style',
    stage: '塑造风格',
    question: '接下来聊聊风格——你希望你在朋友圈给人什么样的感觉？',
    followUps: [
      '如果用三个词来形容你想要的风格，你会选什么？',
      '在{style}的基础上，你希望偶尔也展现一些轻松的一面吗？'
    ],
    hints: ['专业严谨', '轻松幽默', '温暖亲切', '犀利直接', '文艺清新', '霸气外露']
  },
  {
    id: 'purpose',
    stage: '明确目的',
    question: '我想更深一步了解——你打造这个朋友圈人设的核心目的是什么？',
    followUps: [
      '这个目标很清晰！为了达成这个目的，你认为最重要的是什么？',
      '如果三个月后回头看，你觉得怎样算成功了？'
    ],
    hints: ['建立个人品牌', '吸引同行关注', '寻找合作机会', '打造行业影响力', '记录成长', '拓展人脉']
  },
  {
    id: 'audience',
    stage: '锁定受众',
    question: '最后一个关键问题——你希望吸引什么样的人来看你的朋友圈？',
    followUps: [
      '这些人平时在朋友圈里最关注什么样的内容？',
      '如果他们看到你的朋友圈，你希望他们的第一反应是什么？'
    ],
    hints: ['同行技术人', '投资人', '潜在客户', '行业大佬', '年轻从业者', '跨领域朋友']
  }
];

/**
 * 生成AI回复（基于用户回答的上下文感知回复）
 * @param {string} userAnswer - 用户回答
 * @param {Object} context - 上下文信息（当前问题、之前回答等）
 * @returns {string} AI回复文本
 */
function generateResponse(userAnswer, context) {
  const { currentQuestion, previousAnswers, stage } = context;
  const answer = userAnswer.trim();

  if (!answer || answer.length < 2) {
    return '嗯，能再多说一点吗？我想更好地了解你的想法 😊';
  }

  // 分析回答的情感倾向和关键词
  const sentiment = analyzeSentiment(answer);
  const keywords = extractKeywords(answer);

  // 根据阶段生成不同风格的回复
  switch (stage) {
    case 'explore':
      return generateExploreResponse(answer, keywords, sentiment);
    case 'deepen':
      return generateDeepenResponse(answer, keywords, sentiment, previousAnswers);
    case 'confirm':
      return generateConfirmResponse(answer, keywords, previousAnswers);
    default:
      return generateDefaultResponse(answer, sentiment);
  }
}

/**
 * 生成探索阶段的回复
 */
function generateExploreResponse(answer, keywords, sentiment) {
  const responses = [
    `有意思！"${answer}"这个方向确实很有潜力。我注意到你对${keywords[0] || '这个领域'}很感兴趣，让我再深入了解一些...`,
    `好的，${answer}——这个定位很清晰呢！能告诉我，是什么契机让你想到要打造这样一个人设的？`,
    `我理解了。${answer}听起来你已经有了比较明确的方向。接下来我想了解一些更具体的...`,
    `"${answer}"——好的，我记下了。你提到的${keywords[0] || '这个点'}很重要，它会成为你人设的一个核心要素。`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * 生成深化阶段的回复
 */
function generateDeepenResponse(answer, keywords, sentiment, previousAnswers) {
  const lastTopic = previousAnswers.length > 0
    ? previousAnswers[previousAnswers.length - 1].answer
    : '';

  const responses = [
    `这和你之前提到的"${lastTopic.slice(0, 10)}..."很有呼应呢！看来你在这方面有很深的思考。关于"${keywords[0] || answer.slice(0, 8)}"，你觉得你的受众会怎么看？`,
    `非常有深度的回答！我感觉你的人设轮廓越来越清晰了。你对${keywords[0] || '这个方面'}的见解很独特，这会让你的朋友圈内容很有辨识度。`,
    `明白了。你想要的不是一个简单的标签，而是一个有血有肉的形象。"关键词"${keywords[0] || answer.slice(0, 6)}"这一点特别好，能让人记住你。`,
    `我越来越期待你的人设了！你提到的${answer.slice(0, 12)}让我觉得，你希望呈现的是一个真实的、有温度的形象，而不是一个冷冰冰的"专家"。`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * 生成确认阶段的回复
 */
function generateConfirmResponse(answer, keywords, previousAnswers) {
  return `太好了！结合你之前说的所有内容，我对你想要的人设已经有了比较完整的理解。让我来帮你整理一下，看看是不是你想要的样子。`;
}

/**
 * 默认回复
 */
function generateDefaultResponse(answer, sentiment) {
  const responses = [
    `好的，我理解了。你提到的"${answer.slice(0, 10)}"这一点很有价值，我先记下来。`,
    `收到！这让我对你的人设有了更多了解。让我继续问下一个问题...`,
    `嗯嗯，${answer}——很好的思路。这会影响你朋友圈内容的整体调性。`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * 生成人设总结
 * @param {Array} answers - 所有问答对
 * @returns {string} 格式化的人设总结文本
 */
function generatePersonaSummary(answers) {
  const fields = answers.map(a => a.answer);
  const summary = `
根据我们的深入对话，我为你描绘了这样一个人设画像：

🎭 身份定位
一个在${fields[0] || '科技'}领域深耕的${fields[1] || '行业专家'}

📚 背景故事
${fields[2] || '拥有丰富的行业经验，对领域内的技术和趋势有深入的理解'}

🎨 风格调性
${fields[3] || '专业而不失亲和，善于用深入浅出的方式分享见解'}

🎯 核心目标
${fields[4] || '建立个人品牌，扩大行业影响力'}

👥 目标受众
${fields[5] || '同行业的从业者和对这个领域感兴趣的人'}
  `.trim();

  return summary;
}

/**
 * 简单的情感分析
 */
function analyzeSentiment(text) {
  const positiveWords = ['好', '棒', '喜欢', '想', '希望', '期待', '热情', '爱'];
  const negativeWords = ['不', '难', '烦', '讨厌', '累', '迷茫'];

  let score = 0;
  positiveWords.forEach(w => { if (text.includes(w)) score++; });
  negativeWords.forEach(w => { if (text.includes(w)) score--; });

  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
}

/**
 * 提取关键词
 */
function extractKeywords(text) {
  // 简单的关键词提取：取较长的词组
  const segments = text.split(/[，。！？、\s]+/).filter(s => s.length >= 2);
  return segments.slice(0, 3);
}

/**
 * 生成角色扮演对话回复（根据人设进行对话）
 * @param {string} userMessage - 用户消息
 * @param {Object} persona - 人设对象
 * @returns {string} 角色回复
 */
function generateRoleplayResponse(userMessage, persona) {
  const { style, background, tags } = persona;
  const tagStr = tags.join('、');

  // 根据人设风格生成不同语气的回复
  if (style.includes('幽默') || style.includes('轻松')) {
    return `[${persona.name}风格回复] 哈哈，说到${tagStr}，我突然想起之前的一个经历... ${userMessage}这个话题我可以聊一天！`;
  }
  if (style.includes('专业') || style.includes('严谨')) {
    return `[${persona.name}风格回复] 关于"${userMessage}"，从${tagStr}的角度来看，这个问题值得深入探讨。我的观点是...`;
  }
  return `[${persona.name}风格回复] ${userMessage}——嗯，这让我想到了${tagStr}领域的一些趋势。分享一下我的看法...`;
}

module.exports = {
  SOCRATIC_QUESTIONS,
  generateResponse,
  generatePersonaSummary,
  generateRoleplayResponse,
  analyzeSentiment,
  extractKeywords
};
