/* eslint-disable class-methods-use-this */
import autocomplete from 'autocompleter';
import { $body, $win } from '../utils/doms';
import store from '../vue/store';
import { callApi, updateParamValue } from '../utils/http';

let _ITEMSEARCH = null;

@Plugin({
  options: {
    dataHeader: '[data-header]',
    dataSticky: '[data-sticky]',
    clsActiveAccount: 'active',
    dataAccount: '[data-account]',
    dataAccountToggle: '[data-account-toggle]',
    dataAccountDropdown: '[data-account-dropdown]',

    clsActiveSearch: 'active',
    dataSearchToggle: '[data-search-toggle]',
    dataSearchDropdown: '[data-search-dropdown]',
    dataSearchForm: '[data-search-form]',
    dataSearchInput: '[data-search-input]',
    dataSearchButton: '[data-search-btn]',
    dataSearchClearButton: '[data-search-clear-btn]',
    clsSearchPage: 'search-page',
  }
})
export default class Header {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const {
      dataSticky,
      dataSearchToggle,
      dataSearchDropdown,
      dataAccountToggle,
      dataAccountDropdown,
      dataSearchForm,
      dataSearchInput,
      dataSearchButton,
      dataSearchClearButton
    } = this.options;

    this.$sticky = this.$element.find(dataSticky);

    this.$accountToggle = this.$element.find(dataAccountToggle);
    this.$accountDropdown = this.$element.find(dataAccountDropdown);

    this.$searchToggle = this.$element.find(dataSearchToggle);
    this.$searchDropdown = this.$element.find(dataSearchDropdown);
    this.$searchForm = this.$element.find(dataSearchForm);
    this.$searchInput = this.$element.find(dataSearchInput);
    this.$searchButton = this.$element.find(dataSearchButton);
    this.$searchClearButton = this.$element.find(dataSearchClearButton);
  }

  initEvent () {
    const {
      pluginName
    } = this.options;

    // STICKY
    $win.on('load resized', () => this.setHeightHeader());

    // ACCOUNT
    // this.$accountToggle
    //   .off(`click.${pluginName}`)
    //   .on(`click.${pluginName}`, () => this.toggleAccount());

    // SEARCH
    this.$searchToggle
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.toggleSearch());

    $win.on('keyup', (event) => event.shiftKey && event.ctrlKey && event.keyCode === 83 && this.toggleSearch());

    // CLICK OUTSIDE
    $win.on('click', (e) => {
      const target = e.target;
      const {
        clsActiveAccount,
        clsActiveSearch,
        dataAccount,
        dataAccountDropdown,
      } = this.options;
      const isActiveAccount = $(target).parents(dataAccount).find(dataAccountDropdown).hasClass(clsActiveAccount);
      const isActiveSearch = !$(target).parent('.header__search-toggle').length && !$(target).closest($('.header__search-dropdown')).length;

      !isActiveAccount && this.$accountDropdown.removeClass(clsActiveAccount);
      isActiveSearch && this.$searchDropdown.removeClass(clsActiveSearch);
    });

    // EVENT SEARCH
    this.$searchInput
      .off(`keyup.${pluginName}`)
      .on(`keyup.${pluginName}`, (event) => event.key === 'Enter' && this.handleEventSearch());

    this.$searchButton
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => this.handleEventSearch());

    this.$searchClearButton
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => {
        this.$searchInput.val('').focus();
      });

    // AUTOCOMPLETE
    $win.on('load', () => this.initAutocomplete());
  }

  async initAutocomplete () {
    const url = this.$searchInput.data('api');
    const param = { url };
    const data = await callApi(param);
    const _data = data.map(item => {
      return {
        label: item.data.post_title || '',
        value: item.data.post_title || '',
        link: item.data.permalink,
        type: item.data.web_type,
      };
    });
    const arrObjReplace = [
      { textFind: '-', textReplace: ' ' },
    ];

    autocomplete({
      input: this.$searchInput[0],
      minLength: 2,
      fetch: (text, update) => {
        const _text = text.toLowerCase();
        const textConvert = arrObjReplace.reduce((acc, curr) => acc.replace(curr.textFind, curr.textReplace), _text);
        const suggestions = _data.filter(item => {
          const label = item.label.toLowerCase();
          const labelConvert = arrObjReplace.reduce((acc, curr) => acc.replace(curr.textFind, curr.textReplace), label);
          const regex = new RegExp(`(${textConvert})`);

          return regex.test(labelConvert);
        });
        const finalSuggestions = suggestions.slice(0, 10);
        update(finalSuggestions);
      },
      render: (item) => {
        const productType = ['active', 'system'];
        const conceptType = ['concept_active_system'];
        const isProduct = productType.some(value => value === item.type);
        const isConcept = conceptType.some(value => value === item.type);
        let type;

        if ( isProduct ) {
          type = 'Product';
        } else if ( isConcept ) {
          type = 'Concept';
        } else {
          type = item.type.toCapitalize();
        }

        return $(`<div>${item.label} <span>in ${type}</span></div>`)[0];
      },
      onSelect: (item) => {
        _ITEMSEARCH = item;
        window.location.href = item.link;
      },
      disableAutoSelect: true,
    });
  }

  toggleAccount () {
    const { clsActiveAccount } = this.options;
    const isActive = this.$accountDropdown.hasClass(clsActiveAccount);

    !isActive ?
      this.$accountDropdown.addClass(clsActiveAccount) :
      this.$accountDropdown.removeClass(clsActiveAccount);
  }

  toggleSearch () {
    const { clsActiveSearch } = this.options;
    const isActive = this.$searchDropdown.hasClass(clsActiveSearch);

    !isActive ?
      this.$searchDropdown.addClass(clsActiveSearch) :
      this.$searchDropdown.removeClass(clsActiveSearch);

    this.$searchDropdown.on('webkitTransitionEnd transitionend', () => {
      !isActive && this.$searchInput.focus();
    });
  }

  async handleEventSearch () {
    const { clsSearchPage } = this.options;
    const value = this.$searchInput.val().trim();
    const isSearchPage = $body.hasClass(clsSearchPage);
    const linkSearchPage = this.$searchForm.data('action');
    const isValue = value.length !== 0;
    const api = store.getters['search/getUrlApi'];
    const { dataApi, filterApi } = api;

    if ( _ITEMSEARCH ) {
      return;
    }

    if ( isValue ) {
      const $tab = $('.product__tabList ul li:first');
      const type = $tab.find('a').data('tab-name');

      $tab.siblings().find('a').removeClass('active');
      $tab.find('a').addClass('active');

      // push event gtm
      window.dataLayer.push({
        'event': 'search_submitted',
        'action': 'Search Submitted',
        'label': value
      });
      // end push event gtm

      if ( isSearchPage ) {
        this.$searchInput.blur();
        updateParamValue('q', value);
        updateParamValue('tab', type);
        updateParamValue('filter');
        store.dispatch('setCurrentType', type);
        store.dispatch('search/setSearchKeyword', value);

        await store.dispatch('search/getSource', {dataApi, filterApi});
      } else {
        window.location.href = `${linkSearchPage}?q=${value}`;
      }
    }
  }

  setHeightHeader () {
    const headerHeight = this.$sticky.outerHeight();
    const adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').outerHeight() : 0;
    const height = headerHeight + adminBarHeight;

    this.$element.css({'padding-top': height});
    this.$sticky.css({'top': `${adminBarHeight}px`});
  }
}
