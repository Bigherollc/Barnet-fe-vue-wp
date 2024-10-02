import { updateParamValue } from '../../utils/http';

const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-box-filter', {
  template: `
    <div
      class="product__boxFilter"
      data-boxcollapse
      :class="{ 'active': isOpen }"
    >
      <div
        data-boxcollapse-toggle
        class="product__boxFilter-title"
        v-on:click="toggleBoxCollapse(event)"
      >{{filterName}}</div>
      <div class="product__boxFilter-box">
        <div class="product__boxFilter-list" data-filter-list>
          <com-filter-item
            v-for="item in arrayFilterItem"
            :key="item.key"
            :slug="item.slug"
            :name="item.name"
            :count="item.count"
            :isActive="item.active"
            :isDarkMode="isDarkMode"
            v-on:onClickFilter="onClickFilter"
          >
          </com-filter-item>
        </div>
      </div>
    </div>
  `,

  props: {
    index: Number,
    filterName: String,
    arrayFilterItem: Array,
    // TODO: DUPLICATED isOpen and computed isOpen
    // isOpen: {
    //   type: Boolean,
    //   default: false,
    // },
    arrOpen: {
      default: [0, 1],
    }
  },

  computed: {
    ...mapState([
      'selectedFilter',
      'isDarkMode'
    ]),

    isOpen: vm => vm.arrOpen.some(item => item === vm.index) || vm.arrayFilterItem.some(filter => filter.active),
  },

  methods: {
    ...mapActions([
      'addItemArrSelectedFilter',
      'removeItemArrSelectedFilter',
      'actionFilter'
    ]),

    toggleBoxCollapse (event) {
      const target = $(event.target);
      const boxCollapse = target.parents('[data-boxcollapse]');
      const clsActive = 'active';
      const isActive = boxCollapse.hasClass(clsActive);

      !isActive ?
        boxCollapse.addClass(clsActive) :
        boxCollapse.removeClass(clsActive);
    },

    onClickFilter (opts) {
      const { slug, isFilted } = opts;

      !isFilted && this.addItemArrSelectedFilter(slug);
      isFilted && this.removeItemArrSelectedFilter(slug);
      this.actionFilter();
      this.updateHistoryFilter();
    },

    updateHistoryFilter () {
      const data = this.selectedFilter.toString();

      updateParamValue('filter', data);
      // !data.length && this.back2Landing();
      // !data.length && updateParamValue('page');
    },

    back2Landing () {
      const landingPage = $('[data-product]');
      const listingPage = $('[data-listing-page]');
      const sliderMain = $('[data-slider-main]');

      landingPage && landingPage.show();
      landingPage && listingPage.hide();
      landingPage && sliderMain.slick('slickGoTo', 0);
    }
  }
});
