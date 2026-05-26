App({
  onLaunch() {
    console.log('人设工坊启动');
    this.globalData.persona = this.loadPersona();
    this.globalData.chatHistory = [];
  },

  /**
   * 从本地缓存加载已保存的人设
   */
  loadPersona() {
    try {
      const cached = wx.getStorageSync('persona_data');
      if (cached) return cached;
    } catch (e) {
      console.warn('读取缓存失败', e);
    }
    return null;
  },

  /**
   * 保存人设到本地缓存
   */
  savePersona(persona) {
    this.globalData.persona = persona;
    try {
      wx.setStorageSync('persona_data', persona);
    } catch (e) {
      console.warn('保存缓存失败', e);
    }
  },

  /**
   * 保存对话历史
   */
  saveChatHistory(history) {
    this.globalData.chatHistory = history;
    try {
      wx.setStorageSync('chat_history', history);
    } catch (e) {
      console.warn('保存对话失败', e);
    }
  },

  globalData: {
    persona: null,
    chatHistory: [],
    // 默认多维能力表维度
    defaultDimensions: [
      { key: 'techDepth', name: '技术深度', icon: '🔬', value: 50, description: '对核心技术的掌握与见解' },
      { key: 'techBreadth', name: '技术广度', icon: '🌐', value: 50, description: '跨领域技术视野' },
      { key: 'industryInsight', name: '行业洞察', icon: '📊', value: 50, description: '对行业趋势的判断力' },
      { key: 'socialInfluence', name: '社交影响力', icon: '📣', value: 50, description: '在社交平台的号召力' },
      { key: 'contentCreation', name: '内容创作', icon: '✍️', value: 50, description: '产出优质内容的能力' },
      { key: 'humor', name: '幽默感', icon: '😄', value: 50, description: '让内容有趣味性的能力' },
      { key: 'professionalism', name: '专业度', icon: '🎓', value: 50, description: '职业形象的可信度' },
      { key: 'approachability', name: '亲和力', icon: '🤝', value: 50, description: '拉近与读者距离的能力' },
      { key: 'creativity', name: '创造力', icon: '💡', value: 50, description: '独特的思维方式与表达' },
      { key: 'consistency', name: '一致性', icon: '🎯', value: 50, description: '人设形象的稳定程度' }
    ]
  }
});
