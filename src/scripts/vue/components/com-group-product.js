import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    image: { type: String, default: '' },
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    list: { type: Array, default: () => [] },
    slug: { type: String, default: '' },
  },

  setup(props) {
    const isShow = () => props.list?.length > 0;

    return {
      isShow,
    };
  },

  template: `
    <div v-if="isShow" class="component-group-product" :data-slug="slug">
      <div class="component-media-group --mg-bottom-xs" v-if="name">
        <div class="component-media-group__image" v-if="image">
          <img :src="image" alt="" :title="name">
        </div>
        <div class="component-media-group__caption">
          <div class="component-media-group__title">{{name}}</div>
          <div v-if="desc" class="component-media-group__content">{{desc}}</div>
        </div>
      </div>
      <com-item-product
        v-for="item in list"
        :key="item.key"
        :title="item.data.post_title"
        :desc="item.data.post_excerpt_full"
        :link="item.data.permalink"
        :area="item.data.product_area"
        :subtext="item.data.product_right_sub_text"
      ></com-item-product>
    </div>
  `,
});

