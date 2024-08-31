@Plugin({
  options: {
    pluginName: 'Accrodion',
    dataItem: '[data-item]',
    dataToggle: '[data-toggle]',
    dataDropdown: '[data-dropdown]',
    clsActive: 'active',
    time4slide: 300,
  }
})
export default class Accrodion {
  init () {
    this.initDOM();
    this.handleEvent();
  }

  initDOM () {
    const {
      dataToggle
    } = this.options;

    this.$toggle = this.$element.find(dataToggle);
  }

  handleEvent () {
    const {
      pluginName
    } = this.options;

    this.$toggle
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.handleToggle(event));
  }

  handleToggle (event) {
    const {
      dataItem,
      dataDropdown,
      clsActive,
      time4slide
    } = this.options;
    const target = $(event.currentTarget);
    const parent = target.parents(dataItem);
    const dropdown = parent.find(dataDropdown);
    const isActive = parent.hasClass(clsActive);

    parent.siblings(dataItem).removeClass(clsActive).find(dataDropdown).stop().slideUp(time4slide);
    if ( !isActive ) {
      parent.addClass(clsActive);
      dropdown.stop().slideDown(time4slide);
    } else {
      parent.removeClass(clsActive);
      dropdown.stop().slideUp(time4slide);
    }
  }
}
