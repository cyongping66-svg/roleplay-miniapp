const app = getApp();
const momentsGenerator = require('../../utils/moments-generator');

Page({
  data: {
    persona: null,
    moments: [],
    loading: false,
    isEmpty: true,
    generationCount: 5,
    countOptions: [3, 5, 8, 10],
    showCopied: false,
    copiedIndex: -1
  },

  onLoad() {
    this.checkPersona();
  },

  onShow() {
    this.checkPersona();
  },

  /**
   * 检查是否有人设
   */
  checkPersona() {
    const persona = app.globalData.persona;
    if (persona) {
      this.setData({ persona, isEmpty: !this.data.moments.length });
    }
  },

  /**
   * 生成朋友圈内容
   */
  onGenerate() {
    const { persona, generationCount } = this.data;
    if (!persona) {
      wx.showModal({
        title: '提示',
        content: '请先创建人设，才能生成朋友圈内容',
        confirmText: '去创建',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/questionnaire/questionnaire' });
          }
        }
      });
      return;
    }

    this.setData({ loading: true });

    // 模拟生成延迟
    setTimeout(() => {
      const moments = momentsGenerator.generateMoments(persona, generationCount);

      this.setData({
        moments,
        loading: false,
        isEmpty: false
      });

      wx.showToast({ title: `已生成${moments.length}条内容`, icon: 'success' });
    }, 1500);
  },

  /**
   * 修改生成数量
   */
  onCountChange(e) {
    this.setData({ generationCount: this.data.countOptions[e.detail.value] });
  },

  /**
   * 复制内容
   */
  onCopyContent(e) {
    const { index } = e.currentTarget.dataset;
    const moment = this.data.moments[index];
    const text = moment.title
      ? `${moment.title}\n\n${moment.content}`
      : moment.content;

    wx.setClipboardData({
      data: text,
      success: () => {
        this.setData({ showCopied: true, copiedIndex: index });
        setTimeout(() => {
          this.setData({ showCopied: false, copiedIndex: -1 });
        }, 2000);
      }
    });
  },

  /**
   * 刷新单条内容
   */
  onRefreshItem(e) {
    const { index } = e.currentTarget.dataset;
    const { persona, moments } = this.data;

    const newMoments = momentsGenerator.generateMoments(persona, 1);
    const updatedMoments = [...moments];
    updatedMoments[index] = { ...newMoments[0], time: moments[index].time };

    this.setData({ moments: updatedMoments });
    wx.showToast({ title: '已刷新', icon: 'success', duration: 800 });
  },

  /**
   * 全部刷新
   */
  onRefreshAll() {
    this.onGenerate();
  },

  /**
   * 长按复制
   */
  onLongPress(e) {
    const { index } = e.currentTarget.dataset;
    this.onCopyContent({ currentTarget: { dataset: { index } } });
  },

  onShareAppMessage() {
    return {
      title: `来看看「${this.data.persona?.name || '我的'}」的朋友圈内容`,
      path: '/pages/index/index'
    };
  }
});
