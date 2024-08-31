const {
  mapState
} = Vuex;

Vue.component('com-no-result-sidebar', {
  template: `
    <div
      class="search__no-result-sidebar --mg-top-ml"
      :class="{'d-none': isHide}"
    >
      <div class="search__no-result-sidebar--image">
        <img :src="image" />
      </div>
    </div>
  `,

  props: {
    image: String,
    text: String,
  },

  computed: {
    ...mapState([
      'total',
      'hasData',
    ]),

    isHide: vm => vm.total > 0 || !vm.hasData,
  }
});
