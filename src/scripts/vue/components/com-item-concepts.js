import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },

  template: `
    <div class="component-image-concepts__item--wrapper">
      <div class="component-image-concepts__item--img">
        <img :src="image" :alt="title" :title="title">
      </div>
      <div class="component-image-concepts__item--content">
        <div class="component-image-concepts__item--heading" v-text="title"></div>
        <div class="component-image-concepts__item--desc" v-text="desc"></div>
      </div><a :href="link" :title="title" rel="stylesheet" ></a>
    </div>
  `,
});

