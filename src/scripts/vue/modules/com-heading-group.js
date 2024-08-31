const {
  mapState
} = Vuex;

Vue.component('com-heading-group', {
  template: `
    <div class="product__groupTitle">
      <div
        class="component-heading-group"
        :class="{'--dark-mode': isDarkMode}"
      >
        <h2 class="component-heading-group__heading --size-lg">{{title}}</h2>
        <div class="component-heading-group__desc">{{desc}}</div>
      </div>
    </div>
  `,

  props: {
    title: String,
    desc: String,
  },

  computed: {
    ...mapState([
      'isDarkMode',
    ]),
  }
});
