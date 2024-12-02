const {
  mapState,
  mapActions
} = Vuex;

Vue.component('com-list-search', {
  template: `
    <div
      :class="{'--has-border': hasborder}"
      :class="[clsList]"
    >
      <com-item-product
        v-if="isProduct"
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt"
        :link="item.data.permalink"
        :area="item.data.product_area"
      ></com-item-product>

      <com-item-formula
        v-if="isFormula"
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt"
        :image="item.data.formula_icon_black"
        :link="item.data.permalink"
      ></com-item-formula>
      
      <com-item-dispersions
        v-if="isDispersions"
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt"
        :image="item.data.dispersions_icon_black"
        :link="item.data.permalink"
      ></com-item-dispersions>


      <div
        v-if="isResource"
        class="component-related-video row"
      >
        <com-item-resource
          v-for="item in listShow"
          :key=item.key
          :title="item.data.post_title"
          :image="item.data.resource_image_url"
          :time="item.data.resource_time"
          :link="item.data.permalink"
          :type="item.data.resource_media_type"
        ></com-item-resource>
      </div>
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
      'currentType'
    ]),

    isActive: vm => vm.currentType === 'actives',
    isSystem: vm => vm.currentType === 'systems',
    isDispersions: vm => vm.currentType === 'dispersions',
    isFormula: vm => vm.currentType === 'formula',
    isResource: vm => vm.currentType === 'resource',
    isProduct: vm => vm.isActive || vm.isSystem || vm.isDispersions,
    clsList: vm => vm.isResource ? 'component-list-resource' : 'component-list-product',
  },

  methods: {
    ...mapActions([
      'updateHasData'
    ]),

    ...mapActions({
      getSearchSource: 'search/getSource',
    }),
  },

  async mounted () {
    const dataApi = this.data;
    const filterApi = this.filter;

    await this.getSearchSource({dataApi, filterApi});
    this.updateHasData(true);
  }
});
