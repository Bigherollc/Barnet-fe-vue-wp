import { getParamValue } from '../../utils/http';

const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-heading-search', {
  template: `
    <div
      class="product__groupTitle"
      :class="{'d-none': isHide}"
    >
      <div
        class="component-heading-group"
        :class="{'--dark-mode': isDarkMode}"
      >
        <div class="component-heading-group__desc">
          <span data-total-all>{{totalSearchResult}}</span> Results for “{{searchKeyword}}”
        </div>
      </div>
    </div>
  `,

  props: {
    keyword: String,
  },

  computed: {
    ...mapState([
      'isDarkMode',
      'total',
      'hasData',
    ]),

    ...mapState('search', [
      'searchKeyword',
      'totalSearchResult',
    ]),

    isHide: vm => vm.total > 0 || !vm.hasData,
  },

  methods: {
    ...mapActions('search', [
      'setSearchKeyword'
    ]),
  },

  created () {
    let kq = '';
    const param = getParamValue();
    const { q } = param;
    const $searchInput = $('[data-search-input]');

    kq = q && q.search(/(%20|\+)/g) && q.replace(/(%20|\+)/g, ' ');
    $searchInput.val(kq);
    this.setSearchKeyword(kq);
  }
});
