const
  classToDow = 'todow'
;

@Plugin({
  options: {
    language: 'en',
    todayHighlight: true,
    configLang: {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      daysMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today',
      clear: 'Clear',
      titleFormat: 'MM yyyy'
    }
  }
})
export default class Calendar {
  init() {
    this.handleCalendar();
  }

  handleCalendar() {
    this.initLanguage();
    this.initCalendar();
    this.handleButtonControl();
  }

  initLanguage () {
    $.fn.datepicker.dates.en = this.options.configLang;
  }

  initCalendar() {
    const
      that = this,
      date = new Date(),
      today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    ;

    this.$element.datepicker(this.options)
      .on('changeDate', function() {
        that.handleActiveDayName();
      })
      .on('changeMonth', function() {
        that.handleActiveDayName();
      });

    //set default date today into input value
    this.$element.datepicker('setDate', today);
  }

  handleButtonControl() {
    const
      $btnNext = this.$element.find('.next'),
      $btnPrev = this.$element.find('.prev')
    ;

    $btnPrev.empty().append('<i class="icon icon-arrow-left">');
    $btnNext.empty().append('<i class="icon icon-arrow-right">');
  }

  handleActiveDayName() {
    const that = this;

    //after change month func run
    setTimeout(function() {
      const
        indexActive =  that.$element
                        .find('[data-date].active')
                        .index(),
        $daysName =  that.$element.find('.dow')
      ;

      $daysName.removeClass(classToDow);
      indexActive !== -1 ? $daysName.eq(indexActive).addClass(classToDow) : '';
    }, 0);
  }
}
