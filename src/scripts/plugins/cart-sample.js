import { $win } from '../utils/doms';
import { callApi } from '../utils/http';

const classDNone = 'd-none';
let _COUNTAPIDONE = 0;
let _PRODUCT_SELECTED = '';

const generateItemSample = (items = []) => items.map(({id, post_title, permalink}) =>
  `<a class="component-form__product__item" href="${permalink}" title="${post_title}" data-item-sample>
    <div class="component-form__product__item--wrapper">
        <div class="component-form__product__item--content"><i class="icon icon-sample"></i>${post_title}</div>
        <i class="icon icon-close" data-remove-sample data-opts-sample='{"id":"${id}"}'></i>
    </div>
  </a>`
).join('');

const checkExistSample = ((idCheck, data) => {
  let isExits = false;

  if (data.length) {
    isExits = data.some((item) => {
      return item.id === idCheck;
    });
  }

  return isExits;
});


@Plugin({
  options: {
    dataLoading: '[data-loading]',
    dataCountSample: '[data-count-sample]',
    dataGroupBtnSample: '[data-group-btn-sample]',
    dataAddSample: '[data-add-sample]',
    dataQuickFind: '[data-quick-find]',
    dataRemoveSample: '[data-remove-sample]',
    dataWrapSample: '[data-wrap-sample]',
    dataItemSample: '[data-item-sample]',
    dataAnchorLink: '[data-anchor-link]',
    dataStatusSample: '[data-status-sample]',
    dataSelectedSample: '[data-selected-sample]',
    dataKeyStore: '[data-key-store]',
    attrOptsSample: 'opts-sample',
    keyStore: 'cart-sample-store'
  }
})
export default class CartSample {
  init () {
    this.initDom();
    this.initEvent();
    this.initSample();
  }

  initDom() {
    const {
      dataLoading,
      dataCountSample,
      dataAddSample,
      dataRemoveSample,
      dataWrapSample,
      dataAnchorLink,
      dataGroupBtnSample,
      dataStatusSample,
      dataQuickFind,
      dataSelectedSample,
      dataKeyStore
    } = this.options;

    this.optsData = this.options.attrOptsSample;
    this.successPage = this.$element.data(this.optsData).successPage;
    this.failPage = this.$element.data(this.optsData).failPage;
    this.addText = this.$element.data(this.optsData).addText;
    this.defaultText = this.$element.data(this.optsData).defaultText;

    this.$loading = $(dataLoading);
    this.$btnGroupSample = this.$element.find(dataGroupBtnSample);
    this.$arrBtnAddedSample = this.$btnGroupSample.find(`${dataAnchorLink}, ${dataRemoveSample}`);
    this.$btnAddSample = this.$element.find(dataAddSample);
    this.$statusSample = this.$element.find(dataStatusSample);
    this.$countSample = this.$element.find(dataCountSample);
    this.$btnAnchorLink = this.$element.find(dataAnchorLink);
    this.$wrapSample = this.$element.find(dataWrapSample);
    this.$quickFind = this.$element.find(dataQuickFind);
    this.$iptSelectedSample = this.$element.find(dataSelectedSample);
    this.$iptKeyStore = this.$element.find(dataKeyStore);
  }

  initEvent() {
    const {
      pluginName,
      dataRemoveSample
    } = this.options;

    this.$btnAddSample
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (e) => this.handleAddSample(e));

    this.$element
      .off(`click.${pluginName}`, dataRemoveSample)
      .on(`click.${pluginName}`, dataRemoveSample, (e) => this.handleRemoveSample(e));

    this.$btnAnchorLink
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (e) => this.handleRedirectUrl(e));
  }

  async initQuickFind ($elem) {
    let dataSelectBox = [];

    const
      that = this,
      { pluginName } = this.options,
      defaultPlaceholder = $elem.find(':selected').text(),
      dataAjax = await this.sendData($elem),
      addSampleFind = function ({id, text, permalink}) {
        const
          objItem = {id, post_title: text, permalink},
          dataSend = JSON.parse(that.getLocalStorage()) || []
        ;

        if (checkExistSample(objItem.id, dataSend)) {
          return;
        }

        that.$wrapSample.append(generateItemSample([objItem]));
        that.handleUpdateSample([...dataSend, objItem]);

        if ( window.location.pathname !== that.successPage ) {
          window.location.href = that.successPage;
        }
      }
    ;

    _COUNTAPIDONE++; // check load all api then remove loading

    if ( _COUNTAPIDONE === this.$quickFind.length ) {
      this.$loading.addClass(classDNone);
    }

    // end check loadin

    if (!dataAjax.length) {
      return;
    }


    dataSelectBox = dataAjax && dataAjax.reduce((newData, item) => {
      const dataItem = item.data;

      if (!dataItem.post_title) {
        return newData;
      }

      return [...newData, {
        id: dataItem.id,
        text: dataItem.post_title,
        permalink: dataItem.permalink
      }];
    }, []);

    $elem
      .select2({
        data: dataSelectBox,
        templateSelection () {
          return defaultPlaceholder;
        }
      })
      .off(`select2:select.${pluginName}`)
      .on(`select2:select.${pluginName}`, (e) => {
        _PRODUCT_SELECTED = e.params.data;
        $win.trigger('open-confirm-popup', {
          text: `${e.params.data.text} added to cart`,
          type: 'confirm-popup'
        });
      });

    $win.on('response-confirm-popup', (event, response) => {
      response && addSampleFind(_PRODUCT_SELECTED);
    });
  }

  initSample () {
    const
      storeData = JSON.parse(this.getLocalStorage()) || [],
      currentPage = window.location.pathname
    ;

    this.$iptKeyStore.val(this.options.keyStore);

    if (storeData.length) {
      switch (currentPage) {
        case this.failPage:
          window.location.href = this.successPage;
          break;
        case this.successPage:
          this.$wrapSample.html(generateItemSample(storeData));
          break;
        default:
          this.$btnAddSample[0] && this.handleStatusItemSample();
          break;
      }
    }

    this.$quickFind[0] && this.$quickFind.each((idx, item) => this.initQuickFind($(item)));
    this.handleUpdateSample(storeData);
  }

  handleStatusItemSample () {
    const
      storeData = JSON.parse(this.getLocalStorage()) || [],
      dataSample = this.$btnAddSample.data(this.optsData)
    ;

    this.handleButtonItemSample(false);

    storeData.forEach(item => {
      if (item.id === dataSample.id) {
        this.handleButtonItemSample(true);
      }
    });
  }

  handleRedirectUrl (e) {
    e.preventDefault();

    const
      storeData = JSON.parse(this.getLocalStorage()) || []
    ;

    window.location.href = storeData.length ? this.successPage : this.failPage;
  }

  handleAddSample (e) {
    e.preventDefault();

    const
      $elementTarget = $(e.currentTarget),
      dataTarget = $elementTarget.data(this.optsData),
      dataSend = JSON.parse(this.getLocalStorage()) || []
    ;

    $win.trigger('open-confirm-popup', {
      text: `${dataTarget.post_title} added to cart`,
      type: 'confirm-popup'
    });
    $win.on('response-confirm-popup', (event, response) => {
      response && this.handleButtonItemSample(true);
      response && this.handleUpdateSample([...dataSend, dataTarget]);
    });
  }

  handleRemoveSample (e) {
    e.preventDefault();

    const
      { dataItemSample } = this.options,
      $elementTarget = $(e.currentTarget),
      dataTarget = $elementTarget.data(this.optsData),
      dataSend = JSON.parse(this.getLocalStorage()) || []
    ;

    $elementTarget.closest(dataItemSample).remove();
    this.$quickFind.val(null).trigger('change'); //remove option selected
    this.handleButtonItemSample(false);
    this.handleUpdateSample(...[], dataSend.filter(item => item.id !== dataTarget.id));
  }

  handleButtonItemSample (isAdded) {
    this.$btnAddSample.toggleClass(classDNone, isAdded);
    this.$arrBtnAddedSample.toggleClass(classDNone, !isAdded);
    this.$statusSample.html(isAdded ? this.addText : this.defaultText);
  }

  handleCountSample (dataCurrent) {
    this.$countSample.not('.count-number').toggleClass(classDNone, !dataCurrent.length);
    this.$countSample.html(dataCurrent.length);
  }

  handleUpdateSample (dataSend) {
    this.setLocalStorage(dataSend);
    this.handleCountSample(dataSend);
    this.$iptSelectedSample.val(dataSend.map(item => item.id));
  }

  sendData($elem) {
    const
      { method } = this.options,
      type = $elem.data('quick-find'),
      url = this.options.url[type],
      data = {},
      headers = {}
    ;

    this.$loading.removeClass(classDNone);

    return callApi({url, headers, data, method});
  }

  getLocalStorage () {
    return window.localStorage.getItem(this.options.keyStore);
  }

  setLocalStorage (data) {
    window.localStorage.setItem(this.options.keyStore, JSON.stringify(data));
  }
}
