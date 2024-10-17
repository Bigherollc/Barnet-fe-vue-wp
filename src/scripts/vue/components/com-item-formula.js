import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: String,
    desc: String,
    link: String,
    image: {
      type: String,
      default: '',
    }
  },

  setup(props) {
    const hasImage = Vue.ref(props.image !== '');

    return {
      hasImage,
    };
  },

  template: `
    <div
      class="component-list-product__item"
      :class="{'--has-image': hasImage}"
    >
      <div
        class="component-list-product__image"
        v-if="hasImage"
      >
        <a :href="link" :title="title" rel="stylesheet">
          <img :src="image" :title="title">
        </a>
      </div>
      <div class="component-list-product__wrap">
        <div class="component-list-product__title">
          <h3><a :href="link" :title="title" rel="stylesheet">{{title}}</a></h3>
        </div>
        <div class="component-list-product__desc">{{desc}}</div>
      </div>
    </div>
  `,
});

