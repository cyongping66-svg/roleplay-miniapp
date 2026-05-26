/**
 * news-data.js
 * 新闻数据模块 - 提供国内外科技/AI领域最新资讯
 * 后续可接入真实API，当前使用模拟数据
 */

/**
 * 模拟新闻数据库 - 按领域分类
 * 实际部署时替换为API调用
 */
const NEWS_DATABASE = {
  ai: [
    {
      title: 'GPT-5 发布在即，OpenAI预告"推理能力的重大飞跃"',
      source: 'TechCrunch',
      summary: '据知情人士透露，OpenAI正在对GPT-5进行最后阶段的安全测试，预计将在推理能力、多模态理解和代码生成方面实现显著提升。新模型将支持更长的上下文窗口，并在数学推理基准测试中取得突破性成绩。',
      date: '2025-05-20',
      tags: ['OpenAI', 'GPT-5', '大模型']
    },
    {
      title: '谷歌DeepMind发布Gemini 2.5，刷新多项AI基准测试纪录',
      source: 'Google AI Blog',
      summary: '谷歌DeepMind团队正式发布Gemini 2.5系列模型。该模型在MMLU、HumanEval等多个基准测试中均刷新纪录，特别是在科学推理和多语言处理方面展现出显著优势。',
      date: '2025-05-19',
      tags: ['Google', 'Gemini', '多模态']
    },
    {
      title: 'Anthropic推出Claude 4：AI安全与能力的新标杆',
      source: 'Anthropic',
      summary: 'Anthropic发布Claude 4系列模型，在保持业界领先的安全性同时，大幅提升了代码生成、长文本理解和复杂推理能力。新模型采用"Constitutional AI 2.0"框架训练。',
      date: '2025-05-18',
      tags: ['Anthropic', 'Claude', 'AI安全']
    },
    {
      title: 'Meta开源Llama 4，推动开源大模型生态发展',
      source: 'Meta AI',
      summary: 'Meta宣布全面开源Llama 4模型系列，包含7B、13B、70B和405B四个版本。这是目前最强大的开源大模型，在多项基准测试中接近甚至超越闭源模型。',
      date: '2025-05-17',
      tags: ['Meta', 'Llama', '开源']
    },
    {
      title: '百度文心一言4.5发布：中文理解能力全面领先',
      source: '百度AI',
      summary: '百度正式发布文心一言4.5版本，在中文理解、文学创作、古文翻译等方面表现突出。新模型还增强了对企业级应用场景的支持。',
      date: '2025-05-16',
      tags: ['百度', '文心一言', '中文AI']
    },
    {
      title: 'DeepSeek V3开源引发全球关注，中国AI力量崛起',
      source: '机器之心',
      summary: 'DeepSeek V3以其卓越的推理能力和开源策略，在全球AI社区引发广泛关注。该模型在数学推理和代码生成方面达到了闭源模型的水平，展示了中国AI研究的强劲实力。',
      date: '2025-05-15',
      tags: ['DeepSeek', '开源', '中国AI']
    },
    {
      title: 'AI Agent热潮持续：从概念走向企业落地',
      source: 'The Information',
      summary: '越来越多的企业开始部署AI Agent来自动化复杂工作流程。从客服到代码审查，AI Agent正在改变企业的工作方式。分析师预测，到2026年，超过60%的企业将采用某种形式的AI Agent。',
      date: '2025-05-14',
      tags: ['AI Agent', '企业应用', '自动化']
    },
    {
      title: '全球AI人才争夺战白热化：年薪突破百万美元成常态',
      source: 'Bloomberg',
      summary: '随着AI行业的快速发展，顶级AI研究人员和工程师的薪酬持续攀升。据最新报告显示，硅谷资深AI工程师的年薪已普遍超过100万美元，顶尖研究员更是高达数百万。',
      date: '2025-05-13',
      tags: ['AI人才', '薪酬', '行业趋势']
    }
  ],
  tech: [
    {
      title: '苹果WWDC2025前瞻：AI将成为最大主角',
      source: 'MacRumors',
      summary: '苹果WWDC2025将于下月举行，多方消息显示，AI将成为本次大会的核心主题。Siri将迎来"脱胎换骨"的升级，iOS 19将深度集成AI功能。',
      date: '2025-05-20',
      tags: ['Apple', 'WWDC', 'Siri']
    },
    {
      title: '英伟达发布新一代AI芯片Blackwell Ultra，性能提升3倍',
      source: 'NVIDIA Blog',
      summary: '英伟达在Computex上发布Blackwell Ultra架构GPU，相比上一代在AI训练和推理性能上提升约3倍。数据中心业务持续引领公司增长。',
      date: '2025-05-19',
      tags: ['NVIDIA', 'GPU', '芯片']
    }
  ],
  startup: [
    {
      title: 'AI初创公司融资热潮：2025年Q1融资额创历史新高',
      source: 'Crunchbase',
      summary: '2025年第一季度，全球AI初创公司融资总额达到创纪录的350亿美元，同比增长80%。其中，AI基础设施和垂直应用是最受资本青睐的赛道。',
      date: '2025-05-18',
      tags: ['融资', '创投', 'AI创业']
    },
    {
      title: '中国AI创业生态报告：大模型应用层机会涌现',
      source: '36氪',
      summary: '随着大模型能力的持续提升和成本下降，基于大模型的应用层创业迎来爆发期。从AI教育到AI医疗，垂直领域的机会正在被快速挖掘。',
      date: '2025-05-17',
      tags: ['中国创业', 'AI应用', '垂直领域']
    }
  ]
};

/**
 * 根据人设标签获取相关新闻
 * @param {Object} persona - 人设对象
 * @param {number} count - 返回数量
 * @returns {Array} 新闻数组
 */
function getRelevantNews(persona, count = 5) {
  const { tags, features } = persona;
  const allNews = [];

  // 根据标签匹配新闻分类
  const aiKeywords = ['AI', '人工智能', '大模型', '深度学习', '机器学习', '算法'];
  const techKeywords = ['技术', '芯片', '苹果', '编程', '架构'];
  const startupKeywords = ['创业', '融资', '商业', '投资'];

  const hasAI = tags.some(t => aiKeywords.some(k => t.includes(k)));
  const hasTech = tags.some(t => techKeywords.some(k => t.includes(k)));
  const hasStartup = tags.some(t => startupKeywords.some(k => t.includes(k)));

  if (hasAI || !hasTech && !hasStartup) {
    allNews.push(...NEWS_DATABASE.ai);
  }
  if (hasTech) {
    allNews.push(...NEWS_DATABASE.tech);
  }
  if (hasStartup) {
    allNews.push(...NEWS_DATABASE.startup);
  }

  // 按日期排序取前N条
  allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  return allNews.slice(0, count);
}

/**
 * 获取所有新闻分类
 */
function getNewsCategories() {
  return Object.keys(NEWS_DATABASE);
}

module.exports = {
  NEWS_DATABASE,
  getRelevantNews,
  getNewsCategories
};
