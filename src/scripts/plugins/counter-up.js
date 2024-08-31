@Plugin({
  options: {}
})
export default class CounterUp {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom() {
    const { $element } = this;

    this.$counter = $element;
  }

  initEvent() {
    this.$counter.each(function () {
      $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
        duration: 4000,
        easing: 'swing',
        step: now => {
          $(this).text(Math.ceil(now));
        }
      });
    });
  }
}