const app = getApp();

Page({
  data: {
    persona: null,
    dimensions: [],
    personaName: '',
    personaStyle: '',
    personaBackground: '',
    postFrequencyIndex: 1,
    frequencyOptions: ['每天1条', '每天1-2条', '每天2-3条', '每2天1条'],
    contentMix: {
      industryNews: 40,
      personalThoughts: 30,
      dailyLife: 15,
      interaction: 15
    },
    hasChanges: false
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

    const frequencyIndex = this.data.frequencyOptions.indexOf(
      persona.momentsConfig?.postFrequency || '每天1-2条'
    );

    this.setData({
      persona,
      dimensions,
      personaName: persona.name || '',
      personaStyle: persona.style || '',
      personaBackground: persona.background || '',
      postFrequencyIndex: frequencyIndex >= 0 ? frequencyIndex : 1,
      contentMix: {
        industryNews: (persona.momentsConfig?.contentMix?.industryNews || 0.4) * 100,
        personalThoughts: (persona.momentsConfig?.contentMix?.personalThoughts || 0.3) * 100,
        dailyLife: (persona.momentsConfig?.contentMix?.dailyLife || 0.15) * 100,
        interaction: (persona.momentsConfig?.contentMix?.interaction || 0.15) * 100
      }
    });
  },

  formatDimensions(dimensionsObj) {
    const defaultDims = app.globalData.defaultDimensions;
    return defaultDims.map(dim => ({
      ...dim,
      value: dimensionsObj[dim.key] || 50
    }));
  },

  /**
   * 滑块变化
   */
  onSliderChange(e) {
    const { key } = e.currentTarget.dataset;
    const value = e.detail.value;
    const dimensions = this.data.dimensions.map(d =>
      d.key === key ? { ...d, value } : d
    );
    this.setData({ dimensions, hasChanges: true });
  },

  /**
   * 人设名称变化
   */
  onNameChange(e) {
    this.setData({ personaName: e.detail.value, hasChanges: true });
  },

  /**
   * 风格变化
   */
  onStyleChange(e) {
    this.setData({ personaStyle: e.detail.value, hasChanges: true });
  },

  /**
   * 背景变化
   */
  onBackgroundChange(e) {
    this.setData({ personaBackground: e.detail.value, hasChanges: true });
  },

  /**
   * 发布频率变化
   */
  onFrequencyChange(e) {
    this.setData({ postFrequencyIndex: e.detail.value, hasChanges: true });
  },

  /**
   * 内容配比滑块变化
   */
  onMixChange(e) {
    const { type } = e.currentTarget.dataset;
    const value = e.detail.value;
    const contentMix = { ...this.data.contentMix, [type]: value };
    this.setData({ contentMix, hasChanges: true });
  },

  /**
   * 重置为默认值
   */
  onReset() {
    wx.showModal({
      title: '确认重置',
      content: '将所有参数恢复到默认值？',
      success: (res) => {
        if (res.confirm) {
          const dimensions = app.globalData.defaultDimensions.map(d => ({ ...d }));
          this.setData({
            dimensions,
            personaName: '',
            personaStyle: '',
            personaBackground: '',
            postFrequencyIndex: 1,
            contentMix: {
              industryNews: 40,
              personalThoughts: 30,
              dailyLife: 15,
              interaction: 15
            },
            hasChanges: true
          });
        }
      }
    });
  },

  /**
   * 保存所有修改
   */
  onSave() {
    const { persona, dimensions, personaName, personaStyle, personaBackground,
            frequencyOptions, postFrequencyIndex, contentMix } = this.data;

    // 将维度数组转为对象
    const dimensionsObj = {};
    dimensions.forEach(d => {
      dimensionsObj[d.key] = d.value;
    });

    // 更新人设
    const updatedPersona = {
      ...persona,
      name: personaName || persona.name,
      style: personaStyle || persona.style,
      background: personaBackground || persona.background,
      dimensions: dimensionsObj,
      momentsConfig: {
        ...persona.momentsConfig,
        postFrequency: frequencyOptions[postFrequencyIndex],
        contentMix: {
          industryNews: contentMix.industryNews / 100,
          personalThoughts: contentMix.personalThoughts / 100,
          dailyLife: contentMix.dailyLife / 100,
          interaction: contentMix.interaction / 100
        }
      }
    };

    app.savePersona(updatedPersona);

    wx.showToast({
      title: '保存成功！',
      icon: 'success',
      duration: 1500
    });

    this.setData({ hasChanges: false });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
