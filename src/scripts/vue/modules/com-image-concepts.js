const {
  mapState
} = Vuex;

Vue.component('com-image-concepts', {
  template: `
    <div
      class="component-image-concepts slider-init"
      :class="{'d-none': !isShow}"
    >
      <div class="component-image-concepts__wrapper slider-control --light-mode">
      </div>
    </div>
  `,

  props: {
    api: String,
    options: String,
  },

  computed: {
    ...mapState([
      'currentType',
      'listImageConcepts',
    ]),

    ...mapState('search', [
      'conceptSource'
    ]),

    dataSource: vm => vm.conceptSource[vm.currentType] || [],

    isShow: vm => vm.dataSource.length,
  },

  mounted () {
    const $eleSlick = $(this.$el).find('.component-image-concepts__wrapper');
    const _options = JSON.parse(this.options);

    $eleSlick.on('init breakpoint reInit', () => {
      const $prevBtn = $eleSlick.find('.slick-prev');
      const $nextBtn = $eleSlick.find('.slick-next');
      const $dots = $eleSlick.find('.slick-dots');
      const $wrapControl = $(`<div class="slick-wrap"></div>`);
      const $wrapAvailable = $eleSlick.find(`.slick-wrap`);

      $wrapAvailable.length && $wrapAvailable.remove();
      $wrapControl.append([$prevBtn, $dots, $nextBtn]);
      $eleSlick.append($wrapControl);
    });
    $eleSlick.slick(_options);
  },

  watch: {
    dataSource (data) {
      const $eleSlick = $(this.$el).find('.component-image-concepts__wrapper');
      const _options = JSON.parse(this.options);

      $eleSlick.slick('unslick');
      $eleSlick.find('[data-slider-item]').remove();
      $eleSlick.find('.slick-wrap').remove();

      data && data.forEach(item => {
        const $itemAppend = `<div data-slider-item class="component-image-concepts__item" data-oid="${item.data.id}">
          <div class="component-image-concepts__item--wrapper">
            <div class="component-image-concepts__item--img">
              <img src="${item.data.concept_thumbnail_url}" alt="${item.data.post_title}" title="${item.data.post_title}">
            </div>
            <div class="component-image-concepts__item--content">
              <div class="component-image-concepts__item--heading">${item.data.post_title}</div>
              <div class="component-image-concepts__item--desc">${item.data.post_excerpt}</div>
            </div><a href="${item.data.permalink}" title="${item.data.post_title}" rel="stylesheet" ></a>
          </div>
        </div>`;

        $eleSlick.append($itemAppend);
      });

      $eleSlick.slick(_options);
    }
  }
});
