/* eslint-disable class-methods-use-this */
import { $win, $body, $html } from '../utils/doms';
import store from '../vue/store';
import { getParamValue } from '../utils/http';
@Plugin({
  options: {
    dataFilter: '[data-filter]',
    dataFilterToggle: '[data-filter-toggle]',
    dataFilterCollapse: '[data-filter-collapse]',
    dataFilterList: '[data-filter-list]',
    clsActiveFilter: 'active',

    dataBoxCollapse: '[data-boxcollapse]',
    dataBoxCollapseToggle: '[data-boxcollapse-toggle]',
    clsActiveBoxCollapse: 'active',

    optionsJScrollPane: {
      autoReinitialise: true,
    },

    clsFilter: '.filter',
    dataListingPage: '[data-listing-page]',

    dataSeeMore: '[data-see-more]',
    dataSliderMain: '[data-slider-main]',
  }
})
export default class Product {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const {
      dataFilter,
      dataFilterToggle,
      dataFilterCollapse,
      dataFilterList,
      clsFilter,
      dataBoxCollapse,
      dataBoxCollapseToggle,
      dataListingPage,
      dataSeeMore,
      dataSliderMain
    } = this.options;

    this.$filter = this.$element.find(dataFilter);
    this.$filterToggle = this.$element.find(dataFilterToggle);
    this.$filterCollapse = this.$element.find(dataFilterCollapse);
    this.$filterList = this.$element.find(dataFilterList);
    this.$itemFilter = this.$element.find(clsFilter);

    this.$listingPage = $(dataListingPage);
    this.$appListingPage = this.$listingPage.find('.container');

    this.$boxCollapse = this.$element.find(dataBoxCollapse);
    this.$boxCollapseToggle = this.$element.find(dataBoxCollapseToggle);

    this.$seeMore = this.$element.find(dataSeeMore);
    this.$sliderMain = this.$element.find(dataSliderMain);
  }

  initEvent () {
    const {
      pluginName,
      // optionsJScrollPane,
    } = this.options;

    // JSSCROLLPAGE
    // this.$filterList.nicescroll(optionsJScrollPane);

    // TOGGLE FILTER
    this.$filterToggle
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.toggleFilter());

    // BOX COLLAPSE
    this.$boxCollapseToggle
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.toggleBoxCollapse(event));

    // CLICK FILTER
    this.$itemFilter
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.onClickPushState(event));

    // CLICK SEE MORE
    this.$seeMore
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.onClickPushState(event));

    // WINDOW POP STATE
    $win
      .on('popstate load', () => this.onPopState());
  }

  toggleFilter () {
    const { clsActiveFilter } = this.options;
    const isActive = this.$filter.hasClass(clsActiveFilter);

    !isActive ?
      this.$filter.addClass(clsActiveFilter) :
      this.$filter.removeClass(clsActiveFilter);
  }

  toggleBoxCollapse (event) {
    const {
      dataBoxCollapse,
      clsActiveBoxCollapse,
    } = this.options;
    const target = $(event.target).parents(dataBoxCollapse);
    const isActive = target.hasClass(clsActiveBoxCollapse);

    !isActive ?
      target.addClass(clsActiveBoxCollapse) :
      target.removeClass(clsActiveBoxCollapse);
  }

  onClickPushState (event) {
    const href = $(event.currentTarget).attr('href');
    const currentType = store.getters.getCurrentType;
    const scrollTop = 0;

    event.preventDefault();
    window.history.pushState({}, '', href);
    this.$element.hide();
    this.$listingPage.show();
    $body.stop().animate({ scrollTop }, 0);
    $html.stop().animate({ scrollTop }, 0);

    const param = window.location.search;
    const { filter } = getParamValue(param);
    const selectedFilter = filter ? filter.split(',') : [];
    const { listFilter } = store.state;
    const listFilterupdated = listFilter.map(item => Object.assign({}, item, {active: selectedFilter.some(slug => slug === item.slug)}));

    store.dispatch('setData', currentType);
    store.dispatch('updateListFilter', listFilterupdated);
    store.dispatch('updateSelectedFilter', selectedFilter);
    store.dispatch('actionFilter');
  }

  onPopState () {
    const param = window.location.search;
    const { filter, action } = getParamValue(param);

    if ( filter || action ) {
      this.$element.hide();
      this.$listingPage.show();
      return;
    }

    this.$element.show();
    this.$listingPage.hide();

    this.$sliderMain
      .slick('resize')
      .slick('slickGoTo', 0);
  }
}
