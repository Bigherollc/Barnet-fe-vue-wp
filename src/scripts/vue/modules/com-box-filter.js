import { updateParamValue } from '../../utils/http';
import { mapState, mapActions } from 'vuex';

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
        @click="toggleBoxCollapse"
      >{{ filterName }}</div>
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
            @onClickFilter="onClickFilter"
          >
          </com-filter-item>
        </div>
      </div>
    </div>
  `,

  props: {
    index: {
      type: Number,
      required: true
    },
    filterName: {
      type: String,
      required: true
    },
    arrayFilterItem: {
      type: Array,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    arrOpen: {
      type: Array,
      default: () => []
    },
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    toggleBoxCollapse(event) {
      // Your toggle logic here
    },
    onClickFilter(item) {
      // Your click filter logic here
    }
  }
});
