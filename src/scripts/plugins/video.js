import videojs from 'video.js';

/* eslint-disable class-methods-use-this */
@Plugin({
  options: {
    param: {
      aspectRatio: `16:9`,
      responsive: true,
      controls: true,
      controlBar: {
        muteToggle: false,
        volumePanel: {
          inline: false
        },
        seekToLive: false,
        remainingTimeDisplay: false,
        pictureInPictureToggle: false,
        audioTrackButton: false,
      }
    },
    secondSkip: 15,
    gtmViewVideo: ''
  }
})
export default class Video {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const { $element } = this;

    this.$video = $element.find(`video`);
  }

  initEvent () {
    const { secondSkip, gtmViewVideo } = this.options;
    const video = this.$video[0];
    const player = videojs(this.$video[0], this.options.param);
    const Button = videojs.getComponent('Button');
    const btnBackward = videojs.extend(Button, {});
    const btnForward = videojs.extend(Button, {});

    videojs.registerComponent('btnBackward', btnBackward);
    videojs.registerComponent('btnForward', btnForward);

    const DomBackward = player.getChild('controlBar').addChild('btnBackward');
    const DomForward = player.getChild('controlBar').addChild('btnForward');
    const DomBigPlayBtn = player.bigPlayButton;

    if (gtmViewVideo) {
      DomBigPlayBtn.addClass('btn-gtm-view-video');
      DomBigPlayBtn.controlText(gtmViewVideo);
    }

    DomBackward.addClass('vjs-backward');
    DomForward.addClass('vjs-forward');

    DomBackward.el_.addEventListener('click', () => {
      video.currentTime -= secondSkip;
    });
    DomForward.el_.addEventListener('click', () => {
      video.currentTime += secondSkip;
    });
  }
}
