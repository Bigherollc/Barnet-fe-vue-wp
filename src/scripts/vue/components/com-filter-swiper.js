import { ref } from 'vue';

export default {
  setup() {
    const isSwiper = ref(false);

    const onSwiperFilter = () => {
      const $pageListing = $('[data-page-listing]');
      const clsSwiper = 'swiper';

      if (!isSwiper.value) {
        $pageListing.addClass(clsSwiper);
      } else {
        $pageListing.removeClass(clsSwiper);
      }

      isSwiper.value = !isSwiper.value;
    };

    return {
      onSwiperFilter,
      isSwiper
    };
  },
  template: `
    <div
      data-filter-swiper
      class="product__filter-swiper --mg-bottom-xs"
      @click="onSwiperFilter"
      title="Filters"
    >
      <i class="icon icon-filter-results-button"></i>
      <span class="close">Filters</span>
    </div>
  `
};

