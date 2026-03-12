Module.register('MMM-JustExperimenting', {
  defaults: {
    exampleContent: '',
  },

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ['justexperimenting.css'];
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.templateContent = this.config.exampleContent;
    this.keepGrowing = [this.config.exampleContent || 'howdy'];

    // set timeout for next random text
    setInterval(() => this.addRandomText(), 3000);
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data`returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'EXAMPLE_NOTIFICATION') {
      // this.templateContent = `${this.config.exampleContent} ${payload.text}<br>${payload.text}`;
      this.keepGrowing.push(payload.text);
      // don't let it grow bigger than 10
      this.keepGrowing = this.keepGrowing.slice(-10);
      this.templateContent = this.keepGrowing.join('<br>');
      this.updateDom();
    }
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<b>Title</b><br />${this.templateContent}`;

    return wrapper;
  },

  addRandomText() {
    this.sendSocketNotification('GET_RANDOM_TEXT', { amountCharacters: 15 });
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(notification, payload) {
    if (notification === 'TEMPLATE_RANDOM_TEXT') {
      this.templateContent = `${this.config.exampleContent} ${payload}`;
      this.updateDom();
    }
  },
});
