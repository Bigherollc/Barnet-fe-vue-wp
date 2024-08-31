Vue.component('com-item-formula', {
  template: `
    <div
      class="component-list-product__item"
      :class="{'--has-image': hasImage}"
    >
      <div
        class="component-list-product__image"
        v-if="hasImage"
      >
        <a :href="link" title="title" rel="stylesheet">
          <img :src="image" :title="title">
        </a>
      </div>
      <div class="component-list-product__wrap">
        <div class="component-list-product__title">
          <h3><a :href="link" :title="title" rel="stylesheet">{{title}}</a>
          </h3>
        </div>
        <div class="component-list-product__desc">{{desc}}</div>
      </div>
    </div>
  `,

  props: {
    title: String,
    desc: String,
    link: String,
    image: {
      type: String,
      default: '',
    }
  },

  computed: {
    hasImage: vm => vm.image !== '',
  }
});
