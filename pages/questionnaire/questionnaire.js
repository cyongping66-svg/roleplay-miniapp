const app = getApp();
const aiDialogue = require('../../utils/ai-dialogue');
const personaEngine = require('../../utils/persona-engine');

Page({
  data: {
    messages: [],
    inputValue: '',
    currentQuestionIndex: 0,
    questions: aiDialogue.SOCRATIC_QUESTIONS,
    answers: [],
    isTyping: false,
    stage: 'explore',
    showHints: false,
    currentHints: [],
    progress: 0,
    isComplete: false,
    scrollToView: '',
    canSend: false
  },

  onLoad() {
    // 开始第一个问题
    this.askNextQuestion();
  },

  /**
   * 提出下一个问题
   */
  askNextQuestion() {
    const { currentQuestionIndex, questions } = this.data;
    if (currentQuestionIndex >= questions.length) {
      this.completeQuestionnaire();
      return;
    }

    const question = questions[currentQuestionIndex];
    const progress = Math.round((currentQuestionIndex / questions.length) * 100);

    this.setData({
      isTyping: true,
      showHints: false,
      currentHints: question.hints || [],
      progress
    });

    // 模拟AI打字延迟
    setTimeout(() => {
      this.addMessage('ai', question.question, true);
      this.setData({
        isTyping: false,
        showHints: question.hints && question.hints.length > 0
      });
    }, 1000);
  },

  /**
   * 添加消息到对话列表
   */
  addMessage(role, content, isQuestion = false) {
    const messages = this.data.messages;
    const msgId = 'msg_' + Date.now();
    messages.push({
      id: msgId,
      role,
      content,
      isQuestion,
      timestamp: new Date().toLocaleTimeString()
    });
    this.setData({
      messages,
      scrollToView: msgId
    });
  },

  /**
   * 用户输入变化
   */
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value,
      canSend: e.detail.value.trim().length > 0
    });
  },

  /**
   * 点击提示标签
   */
  onTapHint(e) {
    const hint = e.currentTarget.dataset.hint;
    this.setData({ inputValue: hint, canSend: true });
    // 自动发送
    this.sendMessage();
  },

  /**
   * 发送消息
   */
  sendMessage() {
    const { inputValue, currentQuestionIndex, questions, answers } = this.data;
    const text = inputValue.trim();
    if (!text) return;

    // 添加用户消息
    this.addMessage('user', text);
    this.setData({ inputValue: '', canSend: false, showHints: false });

    // 保存回答
    const question = questions[currentQuestionIndex];
    const newAnswers = [...answers, {
      questionId: question.id,
      question: question.question,
      answer: text
    }];
    this.setData({ answers: newAnswers });

    // 生成AI回复
    this.setData({ isTyping: true });
    setTimeout(() => {
      const response = aiDialogue.generateResponse(text, {
        currentQuestion: question,
        previousAnswers: newAnswers,
        stage: this.data.stage
      });

      this.addMessage('ai', response, false);

      // 判断是否需要追问还是进入下一个问题
      const shouldFollowUp = Math.random() > 0.5 && newAnswers.length <= questions.length;

      if (shouldFollowUp && question.followUps && question.followUps.length > 0) {
        // 随机选一个追问
        const followUp = question.followUps[Math.floor(Math.random() * question.followUps.length)];
        const processedFollowUp = followUp
          .replace('{field}', this.getFieldFromAnswers(newAnswers))
          .replace('{role}', this.getRoleFromAnswers(newAnswers))
          .replace('{style}', this.getStyleFromAnswers(newAnswers));

        setTimeout(() => {
          this.addMessage('ai', processedFollowUp, true);
          this.setData({ isTyping: false });
        }, 1200);
      } else {
        // 进入下一个问题
        setTimeout(() => {
          this.setData({
            currentQuestionIndex: currentQuestionIndex + 1,
            isTyping: false,
            stage: this.getStage(currentQuestionIndex + 1)
          });
          this.askNextQuestion();
        }, 1500);
      }
    }, 800 + Math.random() * 800);
  },

  /**
   * 发送消息（键盘确认）
   */
  onConfirm(e) {
    this.sendMessage();
  },

  /**
   * 获取当前阶段
   */
  getStage(index) {
    if (index <= 2) return 'explore';
    if (index <= 4) return 'deepen';
    return 'confirm';
  },

  /**
   * 从回答中提取领域信息
   */
  getFieldFromAnswers(answers) {
    if (answers.length > 0) return answers[0].answer.slice(0, 10);
    return '这个领域';
  },

  getRoleFromAnswers(answers) {
    if (answers.length > 1) return answers[1].answer.slice(0, 10);
    return '角色';
  },

  getStyleFromAnswers(answers) {
    if (answers.length > 3) return answers[3].answer.slice(0, 10);
    return '这种风格';
  },

  /**
   * 完成问卷
   */
  completeQuestionnaire() {
    const { answers } = this.data;

    this.setData({ isTyping: true });
    setTimeout(() => {
      const summary = aiDialogue.generatePersonaSummary(answers);
      this.addMessage('ai', summary, false);

      // 生成人设
      const features = personaEngine.extractPersonaFeatures(answers);
      const persona = personaEngine.generatePersona(features);
      persona.dimensions = personaEngine.refineDimensions(persona.dimensions, answers);

      // 保存到全局
      app.savePersona(persona);

      this.setData({
        isTyping: false,
        isComplete: true,
        progress: 100
      });
    }, 1500);
  },

  /**
   * 前往能力表页面
   */
  goToAbilityChart() {
    wx.navigateTo({
      url: '/pages/ability-chart/ability-chart'
    });
  },

  /**
   * 返回首页
   */
  goBack() {
    wx.navigateBack();
  }
});
