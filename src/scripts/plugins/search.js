@Plugin({
  options: {
    dataSearchDropdown: '[data-search-dropdown]',
  }
})
export default class Search {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom() {
    const { dataSearchDropdown } = this.options;

    this.$searchDropdown = $(dataSearchDropdown);
  }

  initEvent() {
    this.$searchDropdown.addClass('dropdown');
  }
}
