import { ref, watch, onMounted } from 'vue';
import { getParamValue, updateParamValue } from '../../utils/http';

export default {
  props: {
    hastoggle: {
      type: Boolean,
      default: false
    },
  },

  setup(props, { emit }) {
    const currentType = ref(null);
    const isDarkMode = ref(false);
    const source = ref({});
    const total = ref(0);
    const hasData = ref(false);
    const firstAvailableSection = ref(null);


    watch(firstAvailableSection, (value) => {
      const hasTab = $('.component-tab-list').hasClass('d-none');

      !hasTab && updateParamValue('tab', value, true);
      currentType.value = value;
      emit('setData', value);
    });

    const checkHistory = () => {
      const param = window.location.search;
      const objParam = getParamValue(param);
      const hasTab = $('.component-tab-list').hasClass('d-none');
      const tabActive = objParam.tab || false;
      const tab = tabActive ? $('.component-tab-list').find(`a[data-tab-name=${tabActive}]`) : $('.component-tab-list').find('li:first').find('a');
      const tabName = tab.data('tab-name');
      const isGroup = tab.data('is-group');

      emit('updateIsGroup', isGroup);
      currentType.value = tabName;
      !hasTab && updateParamValue('tab', tabName);
    };

    onMounted(() => {
      checkHistory();
    });

    return {
      currentType,
      isDarkMode,
      source,
      total,
      hasData,
      firstAvailableSection,
      isHide: hasData.value === 0 || !hasData.value,
    };
  },
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
};

