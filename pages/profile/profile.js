const app = getApp();

Page({
  data: {
    persona: null,
    hasPersona: false,
    personaStats: {
      dimensions: 0,
      avgScore: 0,
      topDimension: ''
    },
    menuItems: [
      { id: 'ability', icon: '📊', title: '能力图谱', desc: '查看多维能力分析', url: '/pages/ability-chart/ability-chart' },
      { id: 'adjust', icon: '⚙️', title: '调整参数', desc: '微调人设各项指数', url: '/pages/adjust/adjust' },
      { id: 'moments', icon: '📱', title: '朋友圈管理', desc: '生成和管理朋友圈内容', url: '' },
      { id: 'recreate', icon: '🔄', title: '重新创建', desc: '从头打造一个新人设', url: '/pages/questionnaire/questionnaire' },
    ],
    aboutItems: [
      { id: 'help', icon: '❓', title: '使用帮助', desc: '了解如何使用人设工坊' },
      { id: 'feedback', icon: '💌', title: '意见反馈', desc: '帮助我们做得更好' },
      { id: 'share', icon: '🔗', title: '分享给朋友', desc: '让更多人体验人设工坊' },
      { id: 'version', icon: '📌', title: '当前版本', desc: 'v1.0.0' }
    ]
  },

  onLoad() {
    this.loadPersonaData();
  },

  onShow() {
    this.loadPersonaData();
  },

  /**
   * 加载人设数据
   */
  loadPersonaData() {
    const persona = app.globalData.persona;
    if (persona) {
      const dims = persona.dimensions || {};
      const dimValues = Object.values(dims);
      const avgScore = dimValues.length > 0
        ? Math.round(dimValues.reduce((a, b) => a + b, 0) / dimValues.length)
        : 0;

      // 找到最强维度
      const dimKeys = Object.keys(dims);
      const defaultDims = app.globalData.defaultDimensions;
      let topDimension = '';
      let topValue = 0;
      dimKeys.forEach(key => {
        if (dims[key] > topValue) {
          topValue = dims[key];
          const dim = defaultDims.find(d => d.key === key);
          topDimension = dim ? `${dim.icon} ${dim.name}` : key;
        }
      });

      this.setData({
        persona,
        hasPersona: true,
        personaStats: {
          dimensions: dimValues.length,
          avgScore,
          topDimension
        }
      });
    } else {
      this.setData({ persona: null, hasPersona: false });
    }
  },

  /**
   * 菜单项点击
   */
  onMenuTap(e) {
    const { id, url } = e.currentTarget.dataset;

    if (id === 'moments') {
      wx.switchTab({ url: '/pages/moments/moments' });
      return;
    }

    if (id === 'recreate') {
      wx.showModal({
        title: '重新创建',
        content: '这将覆盖当前的人设，确定要重新创建吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url });
          }
        }
      });
      return;
    }

    if (!this.data.hasPersona && (id === 'ability' || id === 'adjust')) {
      wx.showToast({ title: '请先创建人设', icon: 'none' });
      return;
    }

    if (url) {
      wx.navigateTo({ url });
    }
  },

  /**
   * 关于菜单点击
   */
  onAboutTap(e) {
    const { id } = e.currentTarget.dataset;

    switch (id) {
      case 'help':
        wx.showModal({
          title: '使用帮助',
          content: '1. 首页点击"开始打造"创建人设\n2. 通过AI对话完善人设细节\n3. 查看并调整能力图谱\n4. 一键生成朋友圈内容\n5. 复制内容到微信发布',
          showCancel: false
        });
        break;
      case 'feedback':
        wx.showModal({
          title: '意见反馈',
          content: '感谢你的反馈！请在微信公众号「人设工坊」留言，我们会认真阅读每一条建议。',
          showCancel: false
        });
        break;
      case 'share':
        // 触发转发
        break;
      case 'version':
        wx.showToast({ title: '已是最新版本', icon: 'success' });
        break;
    }
  },

  /**
   * 清除人设数据
   */
  onClearData() {
    wx.showModal({
      title: '清除数据',
      content: '将清除所有人设数据和生成的内容，此操作不可恢复。',
      confirmColor: '#FF7675',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('persona_data');
            wx.removeStorageSync('chat_history');
            app.globalData.persona = null;
            app.globalData.chatHistory = [];
            this.setData({
              persona: null,
              hasPersona: false,
              personaStats: { dimensions: 0, avgScore: 0, topDimension: '' }
            });
            wx.showToast({ title: '已清除', icon: 'success' });
          } catch (e) {
            wx.showToast({ title: '清除失败', icon: 'error' });
          }
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '人设工坊 - 打造你的专属社交人设',
      path: '/pages/index/index'
    };
  }
});
