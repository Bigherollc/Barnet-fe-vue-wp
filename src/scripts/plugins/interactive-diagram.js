import { $body, $html } from '../utils/doms';

/* eslint-disable class-methods-use-this */
@Plugin({
  options: {
    pluginName: 'InteractiveDiagram',
    dataDiagram: '[data-diagram]',
    dataDotDiagram: '[data-dot-diagram]',
    dataAnchorLink: '[data-anchor-link-diagram]',
    clsActive: 'active',
  }
})
export default class InteractiveDiagram {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom() {
    const {
      dataDiagram,
      dataDotDiagram,
      dataAnchorLink
    } = this.options;

    this.$diagram = this.$element.find(dataDiagram);
    this.$dotDiagram = this.$element.find(dataDotDiagram);
    this.$anchorLink = this.$element.find(dataAnchorLink);
  }

  initEvent() {
    const { pluginName } = this.options;

    this.$diagram
      .on('beforeChange', (slick, nextSlide) => this.onChangeDiagram(nextSlide));

    this.$dotDiagram
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.onClickDotDiagram(event));

    this.$anchorLink
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.onClickAnchor(event));
  }

  onClickDotDiagram (event) {
    const { clsActive } = this.options;
    const $target = $(event.target);
    const index = $target.data('index');

    this.$dotDiagram.removeClass(clsActive);
    $target.addClass(clsActive);
    this.$diagram.slick('slickGoTo', index);
  }

  onChangeDiagram (slide) {
    const that = this;

    setTimeout(function() {
      const { clsActive } = that.options;
      const indexNextStr = $(slide.$slides).filter('.slick-current').attr('data-slick-index');

      const _indexNextNum = parseInt(indexNextStr);
      const _indexNextFinal = _indexNextNum < that.$dotDiagram.length ? _indexNextNum : 0;
      const $activeDot = that.$dotDiagram.filter(`[data-index="${_indexNextFinal}"]`);

      $activeDot
        .addClass(clsActive)
        .siblings(that.$dotDiagram)
        .removeClass(clsActive);
    }, 0);
  }

  onClickAnchor (event) {
    const href = $(event.target).attr('href');

    if ( !href.search(/(#)/) ) {
      const slug = href.replace(/(#)/, '');
      const headerHeight = $('[data-sticky]').outerHeight();
      const adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').outerHeight() : 0;
      const headerStickyHeight = headerHeight + adminBarHeight;
      const domScrollTo = $body.find(`[data-slug="${slug}"]`);
      const domScrollToOffsetTop = domScrollTo.offset().top;
      const scrollTop = domScrollToOffsetTop - headerStickyHeight;

      $body.stop().animate({ scrollTop }, 300);
      $html.stop().animate({ scrollTop }, 300);
      event.preventDefault();
    }
  }
}
