/* eslint-disable class-methods-use-this */
import { $win } from '../utils/doms';
import layout from '../utils/layout';

@Plugin({
  options: {}
})
export default class SliderMain {
  init () {
    this.initProps();
    this.initEvent();
    this.handleSlick();
  }

  initProps() {
    this.props = {
      screenFunc: {
        lg: 'isDesktop',
        md: 'isTablet',
        sm: 'isSmallScreen'
      },
      slickWrap: 'slick-wrap'
    };
  }

  initEvent () {
    const { mq } = this.options.optsSlider;

    this.$element.on('init', (slick) => this.initControl(slick));
    this.$element.on('breakpoint', (slick) => this.initControl(slick));

    if ( mq ) {
      $win.on(
        `resized.${this.options.pluginName}`,
        this.handleSlick.bind(this)
      );
    }
  }

  initControl(slick) {
    const { slickWrap } = this.props;

    const
      $target = $(slick.currentTarget),
      $prevBtn = $target.find('.slick-prev'),
      $nextBtn = $target.find('.slick-next'),
      $dots = $target.find('.slick-dots'),
      $wrapControl = $(`<div class="${slickWrap}"></div>`)
    ;

    //Remove Wrap Control Before Re-init
    const $wrapAvailable = $target.find(`.${slickWrap}`);

    $wrapAvailable.length && $wrapAvailable.remove();
    // End

    $wrapControl.append([$prevBtn, $dots, $nextBtn]);
    $target.append($wrapControl);

    //Check dot is init
    const { slickContainer } = this.options.optsSlider;

    if (!$wrapControl.is(':empty')
      && !this.$element.hasClass('slider-init')) {
      this.$element.closest(`${slickContainer}`).addClass('slider-init');
    } else {
      this.$element.closest('.slider-init').removeClass('slider-init');
    }
    // End Check dot is init
  }

  isScreenAllow(screenName) {
    return layout[this.props.screenFunc[screenName]];
  }

  handleSlick () {
    const { mq } = this.options.optsSlider;

    if (mq) {
      if (this.isScreenAllow(mq)) {
        this.initSlick();
      } else {
        this.destroySlick();
      }
    } else {
      this.initSlick();
    }
  }

  destroySlick () {
    this.$element.hasClass('slick-initialized') && this.$element.slick('unslick');
    this.$element.closest('.slider-init').removeClass('slider-init');
  }

  initSlick () {
    const { optsSlick } = this.options.optsSlider;

    this.$element.not('.slick-initialized').slick(optsSlick);
  }
}
