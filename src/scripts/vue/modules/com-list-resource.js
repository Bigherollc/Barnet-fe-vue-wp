const {
  mapState,
  mapActions
} = Vuex;
//fixed
Vue.component('com-list-resource', {
  template: `
    <div
      class="component-list-resource"
      :class="{'--has-border': hasborder}"
    >
      <div class="component-related-video row">
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
    roles: Array,
    region: String
  },

  computed: {
    ...mapState([
      'listShow'
    ]),
  },

  methods: {
    ...mapActions([
      'updateHasData'
    ]),

    ...mapActions({
      getResourceRource: 'resource/getSource',
    }),
  },

  async mounted () {
    const dataApi = this.data;
    const filterApi = this.filter;
    const userRoles = this.roles; // Define the 'userRoles' variable
    const userRegion = this.region;
    await this.getResourceRource({dataApi, filterApi, userRoles, userRegion});
    this.updateHasData(true);
  }
});
