import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ComSignIn',
  props: {
    backgroundImage: String,
    urlSignIn: String,
    urlRequestAccess: String,
  },
  setup(props) {
    const urlBgImg = computed(() => `url(${props.backgroundImage})`);

    return {
      urlBgImg
    };
  },
  template: `
    <div class="product__signIn">
      <div
        class="component-signin-box"
        :style="{backgroundImage: urlBgImg}"
      >
        <div class="component-signin-box__title">Sign In for Details</div>
        <div class="component-signin-box__box">
          <div class="component-signin-box__signin">
            <div class="component-signin-box__text">Registered users get access to full product information and related resources:</div>
            <div class="component-signin-box__list">
              <ul class="component-list">
                <li>Specifications & Data Sheets</li>
                <li>Videos & Presentations</li>
                <li>Starter Formula</li>
              </ul>
            </div>
            <div class="component-signin-box__link"><a :href="urlSignIn" title="Sign in" class="btn btn-normal --dark-mode">Sign in</a></div>
          </div>
          <div class="component-signin-box__request">
            <div class="component-signin-box__titleRequest">New Customer?</div><a title="Request Access" :href="urlRequestAccess" class="btn btn-solid --dark-mode btn-gtm-request-access">Request Access</a>
          </div>
        </div>
      </div>
    </div>
  `
});
