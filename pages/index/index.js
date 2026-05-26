const app = getApp();

Page({
  data: {
    avatarReady: false,
    showGuide: false,
    bubbleText: '',
    fullText: '',
    typingIndex: 0,
    hasExistingPersona: false,
    personaName: '',
    greetingMessages: [
      '你好呀！我是小智，你的人设工坊助手 ✨',
      '我可以帮你打造一个独特的社交人设，让朋友圈更有辨识度！',
      '不管是AI技术专家、创业者，还是任何你想成为的角色——',
      '告诉我你的想法，我们一起创造属于你的人设吧！'
    ],
    currentGreetingIndex: 0,
    avatarMood: 'happy', // happy | thinking | excited | wink
    floatingEmojis: ['✨', '💡', '🚀', '🎭', '💫'],
    showFloating: false
  },

  onLoad() {
    const persona = app.globalData.persona;
    if (persona) {
      this.setData({
        hasExistingPersona: true,
        personaName: persona.name
      });
    }

    // 启动动画序列
    setTimeout(() => {
      this.setData({ avatarReady: true, showFloating: true });
      setTimeout(() => {
        this.startGreeting();
      }, 600);
    }, 300);
  },

  /**
   * 开始打招呼动画
   */
  startGreeting() {
    this.typeNextMessage();
  },

  /**
   * 逐字打字效果
   */
  typeNextMessage() {
    const { currentGreetingIndex, greetingMessages } = this.data;
    if (currentGreetingIndex >= greetingMessages.length) {
      this.setData({ showGuide: true, avatarMood: 'excited' });
      return;
    }

    const message = greetingMessages[currentGreetingIndex];
    this.setData({
      fullText: message,
      bubbleText: '',
      typingIndex: 0
    });

    this.typingTimer = setInterval(() => {
      const { typingIndex, fullText } = this.data;
      if (typingIndex >= fullText.length) {
        clearInterval(this.typingTimer);
        // 当前消息打完，延迟后打下一条
        setTimeout(() => {
          this.setData({
            currentGreetingIndex: currentGreetingIndex + 1
          });
          this.typeNextMessage();
        }, 800);
        return;
      }
      this.setData({
        bubbleText: fullText.slice(0, typingIndex + 1),
        typingIndex: typingIndex + 1
      });
    }, 60);
  },

  /**
   * 点击"开始打造"按钮
   */
  onStartCreate() {
    this.setData({ avatarMood: 'excited' });
    wx.navigateTo({
      url: '/pages/questionnaire/questionnaire'
    });
  },

  /**
   * 点击"继续上次的人设"
   */
  onContinuePersona() {
    wx.navigateTo({
      url: '/pages/ability-chart/ability-chart'
    });
  },

  /**
   * 点击"查看朋友圈"
   */
  onViewMoments() {
    wx.switchTab({
      url: '/pages/moments/moments'
    });
  },

  onUnload() {
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
    }
  },

  onShareAppMessage() {
    return {
      title: '人设工坊 - 打造你的专属社交人设',
      path: '/pages/index/index'
    };
  }
});
