Vue.component('com-item-dispersions', {
  template: `
    <div class="component-related-video__col col-12 col-sm-6 col-md-4">
      <a
        class="component-related-video__img"
        :class="{'btn-gtm-view-video': isTypeVideo}"
        :href="link"
        :title="title"
      >
        <img :src="image" :title="title" alt="image">
      </a>
      <div class="component-related-video__content">
        <a
          class="component-related-video__title"
          :class="{'btn-gtm-view-video': isTypeVideo}"
          :href="link"
          :title="title"
          v-text="title"
        >
        </a>
        <div
          v-if="time"
          class="component-related-video__time"
        >
          <i class="icon icon-clock-sm"></i>{{ time}}
        </div>
      </div>
    </div>
  `,

  props: {
    image: String,
    title: String,
    time: String,
    link: String,
    type: String
  },
  computed: {
    isTypeVideo() {
      return this.type.includes('video');
    }
  },
});
