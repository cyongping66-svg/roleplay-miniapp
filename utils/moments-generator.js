/**
 * moments-generator.js
 * 朋友圈内容生成器
 * 根据人设和新闻数据生成拟真的朋友圈内容
 */

const { getRelevantNews } = require('./news-data');

/**
 * 朋友圈发言风格库 - 按人设风格分类
 */
const COMMENT_STYLES = {
  professional: {
    prefixes: ['深度解读一下', '值得关注', '业内重磅', '技术前瞻'],
    suffixes: ['值得持续关注。', '这对行业意味着什么？', '未来可期。', '推荐阅读原文。'],
    connectors: ['事实上，', '从技术角度看，', '我的判断是，', '从长期来看，']
  },
  casual: {
    prefixes: ['刚看到一个有意思的消息', '今天聊个好玩的', '分享一下', '讲真'],
    suffixes: ['你们怎么看？', '有同感的举手', '细思极恐', '这个必须mark'],
    connectors: ['说实话，', '我觉得吧，', '哈哈其实，', '不得不说，']
  },
  humorous: {
    prefixes: ['好家伙', '我直接好家伙', '笑死', '这波啊'],
    suffixes: ['😂', '（手动狗头）', '有被卷到', '格局打开了'],
    connectors: ['说白了就是，', '翻译成人话就是，', '简单来说，', '用大白话讲就是，']
  },
  inspiring: {
    prefixes: ['今天的思考', '分享一个感悟', '创业路上', '成长记录'],
    suffixes: ['与大家共勉。', '一起加油💪', '路还很长，继续走。', '感恩遇见。'],
    connectors: ['回顾这段历程，', '在不断摸索中，', '经历了这些之后，', '回头看看，']
  }
};

/**
 * 朋友圈内容类型
 */
const CONTENT_TYPES = {
  NEWS_SHARE: 'news_share',      // 新闻分享 + 个人评论
  PERSONAL_THOUGHT: 'personal',  // 个人感悟
  DAILY_LIFE: 'daily',           // 日常生活
  INTERACTION: 'interaction',    // 互动内容（提问、投票等）
  WORK_UPDATE: 'work'            // 工作动态
};

/**
 * 个人感悟模板库
 */
const PERSONAL_THOUGHTS = {
  ai_tech_expert: [
    '今天debug了一整天模型训练的问题，最后发现是learning rate的问题。有时候，最简单的答案就在眼前，只是我们选择性失明了。',
    '和一个做传统NLP的朋友聊天，他说现在大模型让他感觉"十年功力一朝散"。我觉得不是这样的——深厚的NLP功底反而让你更好地理解大模型的边界在哪里。',
    '读了一篇关于AI Safety的论文，越深入了解这个领域，越觉得"能力越大责任越大"不是一句空话。我们这些做AI的人，真的需要认真思考技术的边界。',
    '今天的感悟：技术选型不是选最强的，而是选最合适的。就像选择大模型，GPT-4不一定是最优解，有时候一个小模型+好的prompt engineering就够了。',
    '周末花时间复盘了一下最近的技术路线，发现真正的竞争力不在于你会多少模型，而在于你能不能把AI真正落地到业务场景中。'
  ],
  entrepreneur: [
    '今天和投资人聊了2个小时，有一个很大的收获：不要试图解决所有人的问题，先帮一群人解决好一个问题。简单但深刻的道理。',
    '创业第387天。团队从3个人变成了15个人，发现管理比写代码难多了。今天在学习如何做一对一沟通，推荐《High Output Management》。',
    '融资就像找对象，被拒绝不代表你不好，只是不合适。今天又被一家VC pass了，但得到了很中肯的反馈，值了。',
    '客户的五星好评是最好的营销。今天收到一个客户发来的长消息，说我们的产品帮他们团队效率提升了40%，这种成就感比任何融资都让人兴奋。',
    '创业路上最难的不是找到方向，而是在找到方向后坚持走下去。今天差点又想pivot，还好团队拉住了我。'
  ],
  product_manager: [
    '今天做用户访谈，发现了一个很有意思的洞察：用户说的和用户做的完全是两回事。观察行为，而不是只听他们说什么。',
    '删掉一个功能比加一个功能更需要勇气。今天砍掉了我们迭代了两个月的功能，因为数据告诉我们使用率不到3%。心痛，但正确。',
    '优秀的产品经理不是功能的堆砌者，而是用户问题的解决者。每次写PRD之前，先问自己三个问题：为谁解决什么问题？为什么是现在？为什么是我们？',
    '和工程师开了个需求评审会，又被挑战了。但说实话，每次被挑战后需求都变得更好了。好的团队就是能互相push的团队。',
    '看了竞品最近的更新，说实话有点焦虑。但转念一想，如果你只盯着竞品，你就永远在跟跑。做好自己的节奏最重要。'
  ],
  freelancer: [
    '在巴厘岛的咖啡馆远程工作的第三周，突然理解了为什么大家都说数字游民的生活方式"看起来很美"——空调不够冷，WiFi偶尔断，但窗外的稻田景色真的太治愈了。',
    '今天拒了一个报价不错的项目，因为和我的长期方向不符。做自由职业越久，越明白说"不"的能力比说"是"更重要。',
    '自由职业最大的挑战不是找客户，而是管理自己的状态。今天在家工作了一整天但效率极低，后来出门去了个co-working space，效率瞬间拉满。',
    '月底盘了一下收支，自由职业第二年，收入终于超过了之前上班的水平。更重要的是，我可以自己决定什么时候工作、在哪里工作。这种自由感，无价。',
    '今天在旅途中遇到了一个同是自由职业的朋友，聊了很多关于定价策略和客户管理的经验。有时候最好的学习方式就是和同路人交流。'
  ],
  investor: [
    '看了50个AI项目之后的总结：真正有价值的不是"用了AI"，而是"AI让它变得不可替代"。很多项目只是在产品上贴了个AI标签。',
    '今天参加了一个闭门分享会，听到一个很有意思的观点：未来的独角兽不一定是在AI赛道上，而是那些用AI武装自己的传统行业公司。',
    '投资决策中最难的不是判断技术好不好，而是判断市场窗口在哪里。太早了会成为先烈，太晚了又是红海。',
    '和一个被投企业CEO聊到凌晨，帮他梳理了下战略方向。投资人的价值不只是钱，更重要的是在关键时刻的陪伴和思考。',
    '行业里有句话叫"投人不投事"，今天又有了一层新的理解。同样的赛道，不同的创始人能做出完全不同的结果。人，永远是最大的变量。'
  ]
};

/**
 * 朋友圈文案风格匹配
 */
function getCommentStyle(persona) {
  const style = persona.style || '';
  if (style.includes('幽默') || style.includes('有趣')) return COMMENT_STYLES.humorous;
  if (style.includes('专业') || style.includes('严谨')) return COMMENT_STYLES.professional;
  if (style.includes('轻松') || style.includes('亲切')) return COMMENT_STYLES.casual;
  return COMMENT_STYLES.inspiring;
}

/**
 * 生成朋友圈动态
 * @param {Object} persona - 人设对象
 * @param {number} count - 生成条数
 * @returns {Array} 朋友圈内容数组
 */
function generateMoments(persona, count = 5) {
  const moments = [];
  const { contentMix, timeSlots } = persona.momentsConfig;
  const commentStyle = getCommentStyle(persona);

  // 获取相关新闻
  const news = getRelevantNews(persona, Math.ceil(count * contentMix.industryNews) + 2);

  // 按比例生成不同类型的内容
  const newsCount = Math.ceil(count * contentMix.industryNews);
  const thoughtCount = Math.ceil(count * contentMix.personalThoughts);
  const dailyCount = Math.ceil(count * contentMix.dailyLife);
  const interactionCount = count - newsCount - thoughtCount - dailyCount;

  // 生成新闻分享类
  for (let i = 0; i < newsCount && i < news.length; i++) {
    moments.push(generateNewsShareMoment(news[i], commentStyle, persona, i));
  }

  // 生成个人感悟类
  const thoughts = getPersonalThoughts(persona);
  for (let i = 0; i < thoughtCount; i++) {
    moments.push(generatePersonalThoughtMoment(thoughts, commentStyle, persona, i));
  }

  // 生成日常类
  for (let i = 0; i < dailyCount; i++) {
    moments.push(generateDailyMoment(persona, i));
  }

  // 生成互动类
  for (let i = 0; i < interactionCount; i++) {
    moments.push(generateInteractionMoment(persona, i));
  }

  // 添加时间戳和随机化
  moments.forEach((moment, index) => {
    const timeSlot = timeSlots[index % timeSlots.length];
    const randomOffset = Math.floor(Math.random() * 60) - 30;
    moment.time = adjustTime(timeSlot, randomOffset);
    moment.likes = Math.floor(Math.random() * 50) + 5;
    moment.comments = Math.floor(Math.random() * 10);
  });

  // 按时间排序
  moments.sort((a, b) => b.time.localeCompare(a.time));

  return moments.slice(0, count);
}

/**
 * 生成新闻分享类朋友圈
 */
function generateNewsShareMoment(news, style, persona, index) {
  const prefix = style.prefixes[index % style.prefixes.length];
  const connector = style.connectors[index % style.connectors.length];
  const suffix = style.suffixes[index % style.suffixes.length];

  const personalComment = `${connector}${news.summary.slice(0, 40)}，这个趋势确实值得关注。${suffix}`;

  return {
    type: CONTENT_TYPES.NEWS_SHARE,
    title: `${prefix}：${news.title}`,
    content: personalComment,
    newsSource: news.source,
    newsTags: news.tags,
    isPersonalOpinion: true
  };
}

/**
 * 生成个人感悟类朋友圈
 */
function generatePersonalThoughtMoment(thoughts, style, persona, index) {
  const thought = thoughts[index % thoughts.length];

  return {
    type: CONTENT_TYPES.PERSONAL_THOUGHT,
    title: '',
    content: thought,
    isPersonalOpinion: true
  };
}

/**
 * 生成日常类朋友圈
 */
function generateDailyMoment(persona, index) {
  const dailyTemplates = [
    { content: '今天在公司楼下咖啡馆偶遇了一位老朋友，聊了很多行业近况。有时候最不经意的交流，反而能带来最多的灵感。☕', emoji: '☕' },
    { content: '周末在家整理了书架，发现买了好多还没拆封的书。新目标：一个月至少读完两本，第一本就从《思考，快与慢》开始。📚', emoji: '📚' },
    { content: '早起跑步5公里，晨跑真的是一天中最好的"充电"时间。边跑边听podcast，今天的推荐是《硅谷101》最新一期，干货满满。🏃‍♂️', emoji: '🏃‍♂️' },
    { content: '今天团队聚餐，大家都放松聊了很多工作之外的事情。好的团队氛围真的太重要了，感谢遇到这群可爱的同事。🎉', emoji: '🎉' },
    { content: '晚上和朋友去了家新开的日料店，意外地好吃！推荐他们家的炙烤三文鱼寿司，入口即化。生活嘛，除了工作也要有美食。🍣', emoji: '🍣' },
    { content: '在机场候机，突然发现旁边坐着一个在看同一本技术书的陌生人，对视一笑。这个圈子说大不大，说小不小。✈️', emoji: '✈️' }
  ];

  const template = dailyTemplates[index % dailyTemplates.length];

  return {
    type: CONTENT_TYPES.DAILY_LIFE,
    title: '',
    content: template.content,
    isPersonalOpinion: false
  };
}

/**
 * 生成互动类朋友圈
 */
function generateInteractionMoment(persona, index) {
  const interactions = [
    { content: '最近在思考一个问题：做技术到底要不要"all in"一个方向？还是应该保持一定的广度？想听听大家的看法🤔', type: 'question' },
    { content: '做个小调查：你们每天花多少时间在学习新知识上？投票：A. 30分钟 B. 1小时 C. 2小时 D. 佛系学习', type: 'poll' },
    { content: '推荐一本书！最近读完了《纳瓦尔宝典》，里面关于"杠杆"的概念对我的启发很大。每个人的时间都是一样的，但杠杆可以让产出不同。强烈推荐给做技术的朋友们！📖', type: 'recommendation' },
    { content: '有人用过Cursor吗？最近在体验，感觉AI辅助编程的体验又上了一个台阶。想听听其他人的使用感受。', type: 'question' }
  ];

  const interaction = interactions[index % interactions.length];

  return {
    type: CONTENT_TYPES.INTERACTION,
    title: '',
    content: interaction.content,
    interactionType: interaction.type,
    isPersonalOpinion: true
  };
}

/**
 * 获取个人感悟
 */
function getPersonalThoughts(persona) {
  const tags = persona.tags || [];
  const allThoughts = [];

  // 根据人设标签匹配感悟模板
  if (tags.some(t => ['AI', '人工智能', '大模型', '深度学习'].includes(t))) {
    allThoughts.push(...PERSONAL_THOUGHTS.ai_tech_expert);
  }
  if (tags.some(t => ['创业', '创始人', 'CEO'].includes(t))) {
    allThoughts.push(...PERSONAL_THOUGHTS.entrepreneur);
  }
  if (tags.some(t => ['产品', 'PM', '用户体验'].includes(t))) {
    allThoughts.push(...PERSONAL_THOUGHTS.product_manager);
  }
  if (tags.some(t => ['自由职业', '远程', '数字游民'].includes(t))) {
    allThoughts.push(...PERSONAL_THOUGHTS.freelancer);
  }
  if (tags.some(t => ['投资', 'VC', '基金'].includes(t))) {
    allThoughts.push(...PERSONAL_THOUGHTS.investor);
  }

  // 如果没有匹配，使用AI专家模板作为默认
  if (allThoughts.length === 0) {
    allThoughts.push(...PERSONAL_THOUGHTS.ai_tech_expert);
  }

  // 随机打乱
  return shuffleArray(allThoughts);
}

/**
 * 时间调整工具
 */
function adjustTime(timeStr, offsetMinutes) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(Math.abs(newMinutes)).padStart(2, '0')}`;
}

/**
 * 数组随机打乱
 */
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = {
  CONTENT_TYPES,
  generateMoments,
  getPersonalThoughts,
  COMMENT_STYLES
};
