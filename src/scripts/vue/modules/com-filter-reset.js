import { updateParamValue } from '../../utils/http';

const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-filter-reset', {
  template: `
    <div
      class="product__filterReset"
      :class="[cls]"
      v-on:click="handleClickReset"
    >
      <span>Reset Filters</span>
    </div>
  `,

  props: {
    cls: {
      type: String,
      default: null,
    }
  },

  computed: {
    ...mapState([
      'currentType'
    ]),
  },

  methods: {
    ...mapActions([
      'setData',
      'actionFilter',
      'reUpdateSourceCount',
    ]),

    handleClickReset () {
      this.setData(this.currentType);
      this.actionFilter();
      this.reUpdateSourceCount();
      updateParamValue('filter');
    }
  },
});
