import { defineComponent } from 'vue';

export default defineComponent({
  name: 'com-wrapping',
  template: `
    <div class="product__wrapping">
      <slot />
    </div>
  `,
});
