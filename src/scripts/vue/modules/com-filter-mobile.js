const {
  mapState
} = Vuex;

Vue.component('com-filter-mobile', {
  template: `
    <div data-filter class="product__filter product__filter--mobile" :class="{'d-none': isHide}">
      <div class="product__filter-toggle" v-on:click="onToggle">
        <span class="open">Hide Filters</span>
        <span class="close">Show all Categories & Filters</span>
      </div>
      <div class="product__filter-collapse" data-filter-collapse>
        <div class="product__filter-wrap">
          <com-filter-reset cls="d-block d-lg-none"/>
          <com-box-filter
            v-for="(item, index) in _arrListFilter"
            :key="index"
            :index="index"
            :filterName="item.name"
            :arrayFilterItem="item.filter"
          >
          </com-box-filter>
        </div>
      </div>
    </div>
  `,

  computed: {
    ...mapState([
      'listFilter',
      'total'
    ]),

    isHide: vm => vm.total === 0,

    arrListFilter: vm => {
      const arr = vm.listFilter.filter(e => e.parent === 0).sort((first, second) => first.order - second.order);

      arr.forEach((item, index) => {
        const idParent = arr[index].term_id;
        const arrFilter = vm.listFilter.filter(e => e.parent === idParent).sort((first, second) => first.order - second.order);

        Object.assign(item, {filter: arrFilter});
      });

      return arr;
    },

    _arrListFilter: vm => {
      return vm.arrListFilter.filter(item => {
        const hasFilter = item.filter.length;
        const isCount = item.filter.every(item => item.count === 0);

        return hasFilter && !isCount;
      });
    }
  },

  methods: {
    onToggle () {
      const isToggle = $(this.$el).hasClass('active');

      !isToggle ?
        $(this.$el).addClass('active') :
        $(this.$el).removeClass('active');
    }
  }
});
