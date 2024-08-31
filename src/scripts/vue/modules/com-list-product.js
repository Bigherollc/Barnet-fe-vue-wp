const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-list-product', {
  template: `
    <div
      class="component-list-product"
      :class="{'--has-border': hasborder}"
    >
      <com-item-product
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt"
        :link="item.data.permalink"
        :area="item.data.product_area"
      ></com-item-product>
    </div>
  `,

  props: {
    hasborder: Boolean,
    data: String,
    filter: String,
  },

  computed: {
    ...mapState([
      'listShow',
    ]),
  },

  methods: {
    ...mapActions([
      'updateHasData'
    ]),

    ...mapActions('product', [
      'getSource',
    ]),
  },

  async mounted () {
    const dataApi = this.data;
    const filterApi = this.filter;

    await this.getSource({dataApi, filterApi});
    this.updateHasData(true);
  }
});
