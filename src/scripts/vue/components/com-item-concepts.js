Vue.component('com-item-concepts', {
  template: `
    <div class="component-image-concepts__item--wrapper">
      <div class="component-image-concepts__item--img">
        <img :src="image" :alt="title" :title="title">
      </div>
      <div class="component-image-concepts__item--content">
        <div class="component-image-concepts__item--heading" v-text="title"></div>
        <div class="component-image-concepts__item--desc" v-text="desc"></div>
      </div><a :href="link" :title="title" rel="stylesheet" ></a>
    </div>
  `,

  props: {
    title: String,
    image: String,
    desc: String,
    link: String,
  },
});
