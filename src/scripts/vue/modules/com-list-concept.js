const {
  mapState,
  mapActions,
} = Vuex;

Vue.component('com-list-concept', {
  template: `
    <div
      class="component-list-concept"
      :class="{'--has-border': hasborder}"
    >
      <div v-if="isProduct">
        <com-group-product
          v-for="item in dataConcept"
          :key=item.key
          :image="item.meta.image_url"
          :name="item.name"
          :desc="item.description"
          :list="item.list"
          :slug="item.slug"
        ></com-group-product>

        <com-group-product
          :list="dataNoConcept"
        ></com-group-product>
      </div>

      <com-item-formula
        v-if="isFormula"
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt_full"
        :image="item.data.formula_icon_black"
        :link="item.data.permalink"
      ></com-item-formula>

      <com-item-product
        v-if="isResource"
        v-for="item in listShow"
        :key=item.key
        :title="item.data.post_title"
        :desc="item.data.post_excerpt_full"
        :link="item.data.permalink"
      ></com-item-product>
    </div>
  `,

  props: {
    hasborder: Boolean,
    data: String,
    filter: String,
    detail: String,
  },

  computed: {
    ...mapState([
      'listShow',
      'currentType',
    ]),

    ...mapState('concept', [
      'subConcept',
      'dataConcept',
      'dataNoConcept',

    ]),

    isActive: vm => vm.currentType === 'active',
    isSystem: vm => vm.currentType === 'system',
    isProduct: vm => vm.isActive || vm.isSystem,
    isFormula: vm => vm.currentType === 'formula',
    isResource: vm => vm.currentType === 'resource',
  },

  methods: {
    ...mapActions([
      'updateHasData'
    ]),

    ...mapActions('concept', [
      'getSource',
      'getConcept',
      'updateDataConcept',
      'updateDataNoConcept'
    ]),
  },

  watch: {
    subConcept () {
      this.updateDataConcept();
      this.updateDataNoConcept();
    }
  },

  async mounted () {
    const dataApi = this.data;
    const filterApi = this.filter;

    await this.getSource({dataApi, filterApi});
    this.updateHasData(true);
  },
});
