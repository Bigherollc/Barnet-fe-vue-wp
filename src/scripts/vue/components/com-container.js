import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ComContainer',

  props: {
    isdarkmode: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const store = require('vuex').useStore();
    const { onMounted } = require('vue');

    onMounted(() => {
      store.setDarkMode(props.isdarkmode);
    });

    return () => (
      <div class="product__pageListing" data-page-listing>
        <div class="product__pageListing--row">
          <div class="product__pageListing--colLeft">
            <slot name="left" />
          </div>
          <div class="product__pageListing--colRight">
            <slot name="right" />
          </div>
        </div>
      </div>
    );
  }
});

