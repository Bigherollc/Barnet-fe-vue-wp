import { updateParamValue } from '../../utils/http';

const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-tab-list-item', {
  template: `
    <li :class="{ 'd-none': !isShow }">
      <a
        href=""
        :class="{'active': isActive}"
        :data-tab-name="name"
        :data-product-api="productapi"
        :data-filter-api="filterapi"
        :data-is-group="isgroup"
        :title="name"
        v-on:click="onClickTab(event)"
      >
        {{name}} (<span data-tab-count>{{countAll}}</span>)
      </a>
    </li>
  `,

  props: {
    name: String,
    productapi: String,
    filterapi: String,
    isgroup: Boolean,
  },

  computed: {
    ...mapState([
      'source',
      'time4Load',
      'currentType',
    ]),

    ...mapState('search', [
      'conceptSource',
    ]),

    ...mapState('concept', [
      'dataConcept',
      'dataNoConcept'
    ]),

    count: ({ source, name }) => source[name]?.count,
    countConceptSearch: vm => vm.conceptSource[vm.name]?.length || 0,
    countAll: vm => vm.count + vm.countConceptSearch,
    isShow: vm => !!vm.count || !!vm.countConceptSearch,
    isActive: vm => vm.currentType === vm.name,
  },

  methods: {
    ...mapActions([
      'pushListType',
      'setData',
      'reUpdateSourceCount',
      'actionFilter',
      'updateIsGroup'
    ]),

    async onClickTab (event) {
      event.preventDefault();
      const target = $(event.currentTarget);
      const tabName = target.data('tab-name');
      const type = this.name;

      target.parents('li').siblings().find('a').removeClass('active');
      target.addClass('active');

      $('[data-loading]').removeClass('d-none');
      await new Promise(res => setTimeout(res, this.time4Load));
      this.setData(type);
      this.updateIsGroup(this.isgroup);
      this.actionFilter();
      this.reUpdateSourceCount();
      updateParamValue('tab', tabName);
      updateParamValue('filter');
      $('[data-loading]').addClass('d-none');
    },
  },

  created () {
    this.pushListType(this.name);
  }
});
