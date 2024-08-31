const {
  mapActions
} = Vuex;

Vue.component('com-container', {
  template: `
    <div class="product__pageListing" data-page-listing>
      <div class="product__pageListing--row">
        <div class="product__pageListing--colLeft">
          <slot name="left"></slot>
        </div>
        <div class="product__pageListing--colRight">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  `,

  props: {
    isdarkmode: Boolean
  },

  methods: {
    ...mapActions([
      'setDarkMode'
    ]),
  },

  mounted () {
    this.setDarkMode(this.isdarkmode);
  }
});
