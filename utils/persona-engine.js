/**
 * persona-engine.js
 * 人设引擎 - 核心逻辑模块
 * 负责人设的创建、分析、能力表生成与管理
 */

/**
 * 人设模板库 - 预置常见人设类型
 */
const PERSONA_TEMPLATES = {
  ai_tech_expert: {
    name: 'AI技术专家',
    description: '深耕人工智能领域的技术大牛，每天分享AI最新动态与深度思考',
    background: '计算机科学硕士/博士，在大厂AI Lab工作多年，对大模型、CV、NLP有深入理解',
    style: '专业严谨但不失亲和，偶尔幽默点评行业新闻',
    tags: ['AI', '大模型', '深度学习', '技术分享'],
    dimensions: {
      techDepth: 90, techBreadth: 75, industryInsight: 85,
      socialInfluence: 70, contentCreation: 80, humor: 55,
      professionalism: 90, approachability: 60, creativity: 70, consistency: 85
    }
  },
  entrepreneur: {
    name: '创业者',
    description: '正在创业路上的连续创业者，分享创业心得与商业洞察',
    background: '有过2-3次创业经历，目前在做AI方向的创业，融资到A轮',
    style: '充满激情和正能量，偶尔自嘲创业的艰辛，善于讲故事',
    tags: ['创业', '商业', 'AI', '融资', '产品'],
    dimensions: {
      techDepth: 65, techBreadth: 80, industryInsight: 85,
      socialInfluence: 80, contentCreation: 75, humor: 65,
      professionalism: 75, approachability: 80, creativity: 85, consistency: 70
    }
  },
  product_manager: {
    name: '产品经理',
    description: '互联网大厂产品经理，擅长拆解产品逻辑与用户体验',
    background: '5年+产品经验，做过从0到1的产品，对用户增长有独到见解',
    style: '理性分析为主，喜欢用数据说话，偶尔吐槽需求变更',
    tags: ['产品', '用户体验', '增长', '互联网'],
    dimensions: {
      techDepth: 55, techBreadth: 70, industryInsight: 80,
      socialInfluence: 65, contentCreation: 85, humor: 60,
      professionalism: 80, approachability: 70, creativity: 80, consistency: 75
    }
  },
  freelancer: {
    name: '自由职业者',
    description: '数字游民/自由职业者，分享自由工作与生活方式',
    background: '从大厂辞职成为自由职业者，接项目+做自媒体，环游世界',
    style: '轻松自在，经常分享旅途见闻和工作感悟，有种洒脱的气质',
    tags: ['自由职业', '数字游民', '生活方式', '远程办公'],
    dimensions: {
      techDepth: 60, techBreadth: 75, industryInsight: 65,
      socialInfluence: 75, contentCreation: 90, humor: 75,
      professionalism: 55, approachability: 90, creativity: 90, consistency: 60
    }
  },
  investor: {
    name: '投资人',
    description: '科技领域投资人，分享投资视角下的行业分析',
    background: '在一线VC工作，专注AI/硬科技赛道，看过上千个项目',
    style: '冷静理性，善于从宏观角度看问题，偶尔透露一些圈内故事',
    tags: ['投资', 'VC', '科技', '商业分析'],
    dimensions: {
      techDepth: 60, techBreadth: 85, industryInsight: 95,
      socialInfluence: 80, contentCreation: 70, humor: 45,
      professionalism: 90, approachability: 50, creativity: 65, consistency: 85
    }
  }
};

/**
 * 从用户回答中提取关键信息
 * @param {Array} answers - 用户的问答对数组 [{question, answer}]
 * @returns {Object} 提取的人设特征
 */
function extractPersonaFeatures(answers) {
  const features = {
    field: '',
    role: '',
    experience: '',
    style: '',
    purpose: '',
    audience: '',
    frequency: '',
    uniquePoint: ''
  };

  answers.forEach((qa, index) => {
    const answer = qa.answer.toLowerCase();
    switch (index) {
      case 0: // 领域
        features.field = qa.answer;
        break;
      case 1: // 角色/身份
        features.role = qa.answer;
        break;
      case 2: // 经验
        features.experience = qa.answer;
        break;
      case 3: // 风格
        features.style = qa.answer;
        break;
      case 4: // 目的
        features.purpose = qa.answer;
        break;
      case 5: // 受众
        features.audience = qa.answer;
        break;
    }
  });

  return features;
}

/**
 * 基于用户特征生成人设
 * @param {Object} features - 用户特征
 * @returns {Object} 完整人设对象
 */
function generatePersona(features) {
  // 寻找最匹配的模板
  const bestTemplate = findBestTemplate(features);

  // 基于模板和用户特征融合生成人设
  const persona = {
    id: 'persona_' + Date.now(),
    createdAt: new Date().toISOString(),
    name: bestTemplate.name,
    description: features.field ? `专注于${features.field}领域的${features.role || bestTemplate.name}` : bestTemplate.description,
    background: features.experience
      ? `${features.experience}，在${features.field || '科技'}领域深耕多年`
      : bestTemplate.background,
    style: features.style || bestTemplate.style,
    tags: generateTags(features, bestTemplate),
    dimensions: { ...bestTemplate.dimensions },
    features: features,
    momentsConfig: {
      postFrequency: features.frequency || '每天1-2条',
      contentMix: {
        industryNews: 0.4,
        personalThoughts: 0.3,
        dailyLife: 0.15,
        interaction: 0.15
      },
      timeSlots: ['08:30', '12:00', '18:30', '21:30']
    }
  };

  return persona;
}

/**
 * 寻找最匹配的模板
 */
function findBestTemplate(features) {
  const fieldKeywords = {
    ai_tech_expert: ['ai', '人工智能', '机器学习', '深度学习', '技术', '算法', '大模型', 'llm', 'gpt'],
    entrepreneur: ['创业', '创始人', '合伙人', '融资', '商业', 'ceo'],
    product_manager: ['产品', 'pm', '用户体验', 'ux', '增长'],
    freelancer: ['自由', '远程', '数字游民', '自媒体', '独立'],
    investor: ['投资', 'vc', '风投', '基金', '资本']
  };

  let bestMatch = 'ai_tech_expert'; // 默认
  let bestScore = 0;

  const allText = `${features.field} ${features.role} ${features.purpose}`.toLowerCase();

  Object.entries(fieldKeywords).forEach(([template, keywords]) => {
    const score = keywords.filter(k => allText.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  });

  return PERSONA_TEMPLATES[bestMatch];
}

/**
 * 生成标签
 */
function generateTags(features, template) {
  const tags = [...template.tags];
  if (features.field && !tags.includes(features.field)) {
    tags.unshift(features.field);
  }
  return tags.slice(0, 6);
}

/**
 * 基于苏格拉底式回答微调能力维度
 * @param {Object} dimensions - 基础维度
 * @param {Array} answers - 用户回答
 * @returns {Object} 调整后的维度
 */
function refineDimensions(dimensions, answers) {
  const refined = { ...dimensions };

  answers.forEach((qa, index) => {
    const answer = qa.answer.toLowerCase();

    // 根据回答内容调整相关维度
    if (answer.includes('专业') || answer.includes('深度') || answer.includes('技术')) {
      refined.techDepth = Math.min(100, refined.techDepth + 10);
      refined.professionalism = Math.min(100, refined.professionalism + 8);
    }
    if (answer.includes('有趣') || answer.includes('幽默') || answer.includes('轻松')) {
      refined.humor = Math.min(100, refined.humor + 12);
      refined.approachability = Math.min(100, refined.approachability + 8);
    }
    if (answer.includes('影响') || answer.includes('粉丝') || answer.includes('流量')) {
      refined.socialInfluence = Math.min(100, refined.socialInfluence + 10);
      refined.contentCreation = Math.min(100, refined.contentCreation + 8);
    }
    if (answer.includes('创新') || answer.includes('独特') || answer.includes('创意')) {
      refined.creativity = Math.min(100, refined.creativity + 12);
    }
    if (answer.includes('权威') || answer.includes('可信') || answer.includes('信任')) {
      refined.professionalism = Math.min(100, refined.professionalism + 12);
      refined.consistency = Math.min(100, refined.consistency + 8);
    }
    if (answer.includes('亲切') || answer.includes('亲近') || answer.includes('接地气')) {
      refined.approachability = Math.min(100, refined.approachability + 15);
      refined.humor = Math.min(100, refined.humor + 5);
    }
  });

  return refined;
}

module.exports = {
  PERSONA_TEMPLATES,
  extractPersonaFeatures,
  generatePersona,
  refineDimensions,
  findBestTemplate
};
