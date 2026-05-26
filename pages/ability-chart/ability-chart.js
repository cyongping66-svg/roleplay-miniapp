const app = getApp();

Page({
  data: {
    persona: null,
    dimensions: [],
    radarPoints: '',
    radarLabels: [],
    selectedDimension: null,
    showDetail: false,
    overallScore: 0,
    strengths: [],
    suggestions: []
  },

  onLoad() {
    const persona = app.globalData.persona;
    if (!persona) {
      wx.showToast({ title: '请先创建人设', icon: 'none' });
      wx.navigateBack();
      return;
    }

    const dimensions = persona.dimensions
      ? this.formatDimensions(persona.dimensions)
      : app.globalData.defaultDimensions;

    const { radarPoints, radarLabels } = this.calculateRadarPoints(dimensions);
    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length
    );

    const strengths = this.findStrengths(dimensions);
    const suggestions = this.generateSuggestions(dimensions);

    this.setData({
      persona,
      dimensions,
      radarPoints,
      radarLabels,
      overallScore,
      strengths,
      suggestions
    });
  },

  /**
   * 格式化维度数据
   */
  formatDimensions(dimensionsObj) {
    const defaultDims = app.globalData.defaultDimensions;
    return defaultDims.map(dim => ({
      ...dim,
      value: dimensionsObj[dim.key] || 50
    }));
  },

  /**
   * 计算雷达图顶点坐标
   */
  calculateRadarPoints(dimensions) {
    const center = 250;
    const maxRadius = 180;
    const count = dimensions.length;
    const points = [];
    const labels = [];

    dimensions.forEach((dim, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const radius = (dim.value / 100) * maxRadius;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push(`${x},${y}`);

      // 标签位置
      const labelRadius = maxRadius + 35;
      const lx = center + labelRadius * Math.cos(angle);
      const ly = center + labelRadius * Math.sin(angle);
      labels.push({
        name: dim.name,
        icon: dim.icon,
        x: lx,
        y: ly,
        anchor: lx > center ? 'start' : lx < center ? 'end' : 'middle'
      });
    });

    return {
      radarPoints: points.join(' '),
      radarLabels: labels
    };
  },

  /**
   * 找到最强维度
   */
  findStrengths(dimensions) {
    return [...dimensions]
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(d => ({ ...d }));
  },

  /**
   * 生成建议
   */
  generateSuggestions(dimensions) {
    const suggestions = [];
    const weakDims = [...dimensions].sort((a, b) => a.value - b.value).slice(0, 3);

    weakDims.forEach(dim => {
      if (dim.value < 60) {
        suggestions.push({
          dimension: dim.name,
          icon: dim.icon,
          current: dim.value,
          tip: this.getTip(dim.key)
        });
      }
    });

    return suggestions;
  },

  /**
   * 获取提升建议
   */
  getTip(key) {
    const tips = {
      techDepth: '建议多写技术深度分析文章，分享源码解读、架构设计等硬核内容',
      techBreadth: '可以适当跨界分享，比如AI+金融、AI+教育等跨领域视角',
      industryInsight: '多关注行业报告、参加线上峰会，培养趋势判断力',
      socialInfluence: '尝试发起话题讨论、参与行业热点评论，提升曝光度',
      contentCreation: '练习写作技巧，学习标题党、故事化叙述等方法提升内容吸引力',
      humor: '适当加入生活化的幽默元素，让专业内容更接地气',
      professionalism: '多引用数据和案例，减少主观臆断，建立权威感',
      approachability: '多分享个人经历和感悟，拉近与读者的心理距离',
      creativity: '尝试新的内容形式，如漫画、短视频脚本、信息图等',
      consistency: '制定固定发布计划，保持人设调性的稳定性'
    };
    return tips[key] || '持续关注该维度，保持平衡发展';
  },

  /**
   * 点击维度查看详情
   */
  onDimensionTap(e) {
    const index = e.currentTarget.dataset.index;
    const dim = this.data.dimensions[index];
    this.setData({
      selectedDimension: dim,
      showDetail: true
    });
  },

  /**
   * 关闭详情弹窗
   */
  closeDetail() {
    this.setData({ showDetail: false });
  },

  /**
   * 前往调整页面
   */
  goToAdjust() {
    wx.navigateTo({
      url: '/pages/adjust/adjust'
    });
  },

  /**
   * 前往朋友圈页面
   */
  goToMoments() {
    wx.switchTab({
      url: '/pages/moments/moments'
    });
  },

  /**
   * 分享能力表
   */
  onShareAppMessage() {
    return {
      title: `看看我的人设能力表 - ${this.data.persona.name}`,
      path: '/pages/index/index'
    };
  }
});
