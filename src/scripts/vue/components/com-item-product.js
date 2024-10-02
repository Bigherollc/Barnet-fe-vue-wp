Vue.component('com-item-product', {
  template: `
    <div class="component-list-product__item">
      <div class="component-list-product__wrap">
        <div class="component-list-product__title">
          <h3>
            <a :href="link" :title="title" rel="stylesheet">
              {{title}}
              <i v-if="isGlobal" class="icon icon-global-product"></i>
            </a>
            <span v-if="subtext"> | {{subtext}}</span>
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
    subtext: {
      type: String,
      default: '',
    },
    area: {
      type: String,
      default: '',
    },
  },

  computed: {
    hasImage: vm => vm.image !== '',
    isGlobal: ({ area }) => area === 'global',
  },
});
