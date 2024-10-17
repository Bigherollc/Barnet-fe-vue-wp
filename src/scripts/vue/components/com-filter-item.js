import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    slug: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isHide() {
      return this.count === 0;
    },
  },
  methods: {
    onClickFilter(event, slug) {
      const isFilted = event.target.classList.contains('active');
      this.$emit('onClickFilter', { slug, isFilted });
    },
  },
  template: `
    <div
      class="filter"
      :data-slug="slug"
      :title="name"
      :class="{
        'active': isActive,
        '--dark-mode': isDarkMode,
        'd-none': isHide,
      }"
      @click="onClickFilter($event, slug)"
    >
      <span>{{name}} ({{count}})</span>
    </div>
  `,
});

