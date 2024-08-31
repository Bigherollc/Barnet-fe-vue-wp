const {
  mapState
} = Vuex;

Vue.component('com-no-result', {
  template: `
    <div
      class="search__no-result"
      :class="{'d-none': isHide}"
    >
      <div class="search__no-result--image">
        <img :src="image" />
      </div>
      <div class="search__no-result--text">{{text}}</div>
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
