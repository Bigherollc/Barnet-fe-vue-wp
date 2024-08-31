@Plugin({
  options: {
    minimumResultsForSearch: -1
  }
})

export default class SelectBox {
  init () {
    this.initDom();
  }

  initDom() {
    this.$element
      .css({'width': '100%'}) // calc width 100% when element display none
      .select2({
        ...this.options,
        ...this.options.optSelect
      });
  }
}