import { getParamValue } from '../../utils/http';

const {
  mapState,
  mapActions,
} = Vuex;

Vue.component('com-filter', {
  template: `
    <div data-filter class="product__filter" :class="{'d-none': isHide}">
      <slot />
      <div class="product__filter-collapse" data-filter-collapse>
        <div class="product__filter-wrap">
          <com-filter-reset cls="d-none d-lg-block"/>
          <com-box-filter
            v-for="(item, index) in arrListFilter"
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
      'hasData',
      'listFilter',
      'total',
    ]),

    isHide: vm => vm.total === 0,

    arrListFilter: vm => {
      const arr = vm.listFilter.filter(e => e.parent === 0).sort((first, second) => first.order - second.order);

      arr.forEach((item, index) => {
        const idParent = arr[index].term_id;
        const arrFilter = vm.listFilter.filter(e => e.parent === idParent).sort((first, second) => first.order - second.order);

        Object.assign(item, {filter: arrFilter});
      });

      const activeArr = arr.filter(item => {
        const hasFilter = item.filter.length;
        const isCount = item.filter.every(item => item.count === 0);

        return hasFilter && !isCount;
      });

      return activeArr;
    }
  },

  methods: {
    ...mapActions([
      'updateSelectedFilter',
      'updateListFilter',
      'actionFilter',
    ]),

    initFilter () {
      const param = window.location.search;
      const { filter } = getParamValue(param);
      const selectedFilter = filter ? filter.split(',') : [];
      const { listFilter } = this;
      const listFilterupdated = listFilter.map(item => Object.assign({}, item, {active: selectedFilter.some(slug => slug === item.slug)}));

      this.updateListFilter(listFilterupdated);
      this.updateSelectedFilter(selectedFilter);
      this.actionFilter();
    },
  },

  mounted () {
    window.addEventListener('popstate', () => this.initFilter());
  },

  watch: {
    hasData (value) {
      value && this.initFilter();
    }
  }
});
