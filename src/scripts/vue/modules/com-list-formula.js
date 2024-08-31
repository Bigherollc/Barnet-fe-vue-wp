const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-list-formula', {
  template: `
    <div
      class="component-list-product"
      :class="{'--has-border': hasborder}"
    >
        <com-item-formula
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt"
        :image="item.data.formula_icon_black"
        :link="item.data.permalink"
      ></com-item-formula>
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

    ...mapActions({
      getFormulaSource: 'formula/getSource',
    }),
  },

  async mounted () {
    const dataApi = this.data;
    const filterApi = this.filter;

    await this.getFormulaSource({dataApi, filterApi});
    this.updateHasData(true);
  }
});
