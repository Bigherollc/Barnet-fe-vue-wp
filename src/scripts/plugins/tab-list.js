/* eslint-disable class-methods-use-this */
import { $win } from '../utils/doms';

@Plugin({
  options: {
    dataTabList: '[data-tab-list]',
    dataToggle: '[data-toggle-tab]',
    clsActive: 'active',
  }
})
export default class TabList {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const {
      dataToggle
    } = this.options;

    this.$toggle = this.$element.find(dataToggle);
    this.$tabItem = this.$element.find('ul').find('a');
  }

  initEvent () {
    const {
      pluginName
    } = this.options;

    // TOGGLE
    this.$toggle
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.toggleTabList());

    // CLICK TAB ITEM
    this.$tabItem
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.clickTabItem(event));

    // CLICK OUTSIDE
    $win.on('click', (e) => {
      const target = e.target;
      const {
        clsActive,
        dataTabList
      } = this.options;
      const isActive = $(target).parents(dataTabList).hasClass(clsActive);

      !isActive && this.$element.removeClass(clsActive);
    });
  }

  toggleTabList () {
    const { clsActive } = this.options;
    const isActive = this.$element.hasClass(clsActive);
    const isHasToggle = this.$element.hasClass('--hasToggle');

    isHasToggle && !isActive ?
      this.$element.addClass(clsActive) :
      this.$element.removeClass(clsActive);
  }

  clickTabItem (e) {
    const target = e.target;
    const textActive = $(target).text();

    this.$toggle.text(textActive);
  }
}