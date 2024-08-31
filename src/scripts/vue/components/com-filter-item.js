Vue.component('com-filter-item', {
  template: `
    <div
      class="filter "
      :data-slug="slug"
      :title="name"
      :class="{
        'active': isActive,
        '--dark-mode': isDarkMode,
        'd-none': isHide,
      }"
      v-on:click="onClickFilter(event, slug)"
    >
      <span>{{name}} ({{count}})</span>
    </div>
  `,

  props: {
    slug: String,
    name: String,
    count: Number,
    link: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    }

  },

  computed: {
    isHide: vm => vm.count === 0,
  },

  methods: {
    onClickFilter (event, slug) {
      const isFilted = $(event.target).hasClass('active');
      this.$emit('onClickFilter', {slug, isFilted});
    },
  }
});
