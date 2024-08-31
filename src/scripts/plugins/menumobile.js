/* eslint-disable class-methods-use-this */
import { $body, $win } from '../utils/doms';

@Plugin({
  options: {
    dataMenumobile: '[data-menumobile]',
    dataToggle: '[data-toggle]',
    dataMenu: '[data-menu]',
    clsActive: 'active',
    clsFreeze: 'freeze',
  }
})
export default class Menumobile {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const {
      dataToggle,
      dataMenu,
    } = this.options;

    this.$toggle = this.$element.find(dataToggle);
    this.$menu = this.$element.find(dataMenu);
  }

  initEvent () {
    const {
      pluginName
    } = this.options;

    // TOGGLE
    this.$toggle
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.toggleMenu());

    // CLICK OUTSIDE
    $win.on('click', (e) => {
      const target = e.target;
      const {
        clsActive,
        dataMenumobile
      } = this.options;
      const isActive = $(target).parents(dataMenumobile).hasClass(clsActive);

      !isActive && this.toggleMenu(true);
    });

    // BREAKPOINT
    $win.on('resized', () => this.toggleMenu(true));
  }

  toggleMenu (isActive) {
    const { clsActive, clsFreeze } = this.options;
    const _isActive = isActive || this.$element.hasClass(clsActive);

    $body.toggleClass(clsFreeze, !_isActive);
    this.$element.toggleClass(clsActive, !_isActive);
  }
}
