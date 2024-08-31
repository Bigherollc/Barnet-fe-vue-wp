import { $win } from '../utils/doms';

@Plugin({
  options: {
    pluginName: 'ConfirmPopup',
    dataContent: '[data-content]',
    dataBtnNo: '[data-btn-no]',
    dataBtnYes: '[data-btn-yes]',
    clsActive: 'active'
  }
})
export default class ConfirmPopup {
  init () {
    this.initDOM();
    this.handleEvent();
  }

  initDOM () {
    const { $element } = this;
    const {
      dataContent,
      dataBtnNo,
      dataBtnYes
    } = this.options;

    this.$element = $element;
    this.$content = $element.find(dataContent);
    this.$btnNo = $element.find(dataBtnNo);
    this.$btnYes = $element.find(dataBtnYes);
  }

  handleEvent () {
    const { pluginName } = this.options;

    // TRGGER WIN
    $win.on('open-confirm-popup', (evt, data) => this.openPopup(data));

    this.$btnNo
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.responseEvent(false));

    this.$btnYes
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.responseEvent(true));
  }

  responseEvent (data) {
    $win.trigger('response-confirm-popup', data);
    this.closePopup();
  }

  openPopup = (data) => {
    const { text, type } = data;
    const { clsActive } = this.options;

    type === 'close-popup' ? this.$btnNo.hide() : this.$btnNo.show();
    this.$content.text(text);
    this.$element.addClass(clsActive);
  }

  closePopup () {
    const { clsActive } = this.options;

    this.$element.removeClass(clsActive);
  }
}
