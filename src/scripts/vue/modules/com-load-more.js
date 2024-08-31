const {
  mapState,
  mapActions,
} = Vuex;

Vue.component('com-load-more', {
  template: `
    <div class="product__loadmore" :class="{'d-none': !isMore}">
      <div class="product__loadmore-text">Showing <span>1-{{end}}<span> of <span>{{total}}</span></span></span></div>
      <div class="product__loadmore-btn">
        <a
          class="btn btn-regular"
          v-on:click="onClickLoadmore(event)"
          title="See More"
        >See More</a>
      </div>
    </div>
  `,

  computed: {
    ...mapState([
      'page',
      'skip',
      'total',
      'isMore',
    ]),

    start () {
      return (( this.page - 1 ) * this.skip ) + 1;
    },

    end () {
      return this.start + ( this.skip - 1 );
    },
  },

  methods: {
    ...mapActions([
      'updatePage',
      'updateListShow',
    ]),

    onClickLoadmore (event) {
      event.preventDefault();

      const pageIncrease = this.page + 1;
      this.updatePage(pageIncrease);
      this.updateListShow();
    }
  },
});
