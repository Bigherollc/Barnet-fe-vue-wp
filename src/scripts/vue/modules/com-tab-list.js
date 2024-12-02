import { getParamValue, updateParamValue } from '../../utils/http';

const { mapState, mapActions, mapGetters } = Vuex;

Vue.component('com-tab-list', {
  template: `
    <div>
      <div
        data-tab-list
        class="product__tabList component-tab-list"
        :class="{
          '--dark-mode': isDarkMode,
          '--hasToggle': hastoggle,
          'd-none': isHide
        }"
      >
        <div
          class="component-tab-list__toggle"
          v-if="hastoggle"
          data-toggle-tab
          v-text="currentType"
        ></div>
        <ul>
          <slot />
        </ul>
      </div>
    </div>
  `,

  props: {
    hastoggle: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['currentType', 'isDarkMode', 'source', 'total', 'hasData']),

    ...mapGetters(['firstAvailableSection']),

    isHide: (vm) => vm.total === 0 || !vm.hasData,
  },

  methods: {
    ...mapActions([
      'updateListApi',
      'setCurrentType',
      'setData',
      'updateIsGroup',
    ]),

    checkHistory() {
      const param = window.location.search;
      const objParam = getParamValue(param);
      const hasTab = $('.component-tab-list').hasClass('d-none');
      const tabActive = objParam.tab || false;
      const tab = tabActive
        ? $('.component-tab-list').find(`a[data-tab-name=${tabActive}]`)
        : $('.component-tab-list').find('li:first').find('a');
      const tabName = tab.data('tab-name');
      const isGroup = tab.data('is-group');

      this.updateIsGroup(isGroup);
      this.setCurrentType(tabName);
      !hasTab && updateParamValue('tab', tabName);
    },
  },

  mounted() {
    this.checkHistory();
  },

  watch: {
    firstAvailableSection(value) {
      const hasTab = $('.component-tab-list').hasClass('d-none');

      !hasTab && updateParamValue('tab', value, true);
      this.setCurrentType(value);
      this.setData(value);
    },
  },
});
