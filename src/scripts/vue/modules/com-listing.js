const {
  mapState
} = Vuex;

Vue.component('com-listing', {
  template: `
    <div class="product__listing" :class="{'d-none': isHide}">
      <slot />
    </div>
  `,

  computed: {
    ...mapState([
      'total'
    ]),

    isHide: vm => vm.total === 0,
  },
});
