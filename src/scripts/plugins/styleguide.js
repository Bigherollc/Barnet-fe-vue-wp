@Plugin({
  options: {
    slider: '[data-slider]'
  }
})
export default class Styleguide {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const {
      slider
    } = this.options;

    this.$slider = this.$element.find(slider);
  }

  initEvent () {
    this.$slider.slick({
      dots: true,
    });
  }
}
