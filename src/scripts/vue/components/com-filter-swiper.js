Vue.component('com-filter-swiper', {
  template: `
    <div
      data-filter-swiper
      class="product__filter-swiper --mg-bottom-xs"
      v-on:click="onSwiperFilter"
      title="Filters"
    >
      <i class="icon icon-filter-results-button"></i>
      <span class="close">Filters</span>
    </div>
  `,

  methods: {
    onSwiperFilter () {
      const $pageListing = $('[data-page-listing]');
      const clsSwiper = 'swiper';
      const isSwiper = $pageListing.hasClass(clsSwiper);

      if ( !isSwiper ) {
        $pageListing.addClass(clsSwiper);
      } else {
        $pageListing.removeClass(clsSwiper);
      }
    }
  }
});
