import { callApi } from '../utils/http';

const
  classParsleyError = 'parsley-error',
  classDNone = 'd-none',
  classDone = 'done',
  classActive = 'active',
  classCurrent = 'current'
;

const generateErrorServer = (msgError) =>
  `<ul class="parsley-errors-list filled" data-validate-server>
    <li class="parsley-required">
      ${msgError}
    </li>
  </ul>`;

@Plugin({
  options: {
    url: '/data/request-step.json',
    dataLoading: '[data-loading]',
    dataHeading: '[data-heading]',
    dataProgressStep: '[data-progress-step]',
    dataNextBtn: '[data-next-btn]',
    dataTabContent: '[data-tab-content]',
    dataFieldValidate: '[data-parsley-required]',
    dataValidateServer: '[data-validate-server]',
    dataCheckbox: '[data-checkbox]',
    dataStepValid: '[data-step-valid]',
    formElement: 'form',
    formInputItem: 'component-form__item'
  }
})
export default class RequestStep {
  init () {
    this.initProps();
    this.initDom();
    this.initEvent();
    this.initParsleyGroup();
  }

  initProps () {
    this.props = {
      count: 0
    };
  }

  initDom () {
    const {
      dataLoading,
      dataHeading,
      dataProgressStep,
      dataNextBtn,
      dataCheckbox,
      formElement,
      dataTabContent,
      dataFieldValidate
    } = this.options;

    this.$heading = this.$element.find(dataHeading);
    this.$tabContent = this.$element.find(dataTabContent);
    this.$progressStep = this.$element.find(dataProgressStep);
    this.$stepItem = this.$progressStep.children();
    this.$form = this.$element.find(formElement);
    this.$nextBtn = this.$element.find(dataNextBtn);
    this.$fieldValidate = this.$element.find(dataFieldValidate);
    this.$checkbox = this.$element.find(dataCheckbox);
    this.$loading = $(dataLoading);
  }

  initEvent () {
    const {
      pluginName,
      formInputItem,
      dataValidateServer
    } = this.options;

    this.$stepItem
    .off(`click.${pluginName}`)
    .on(`click.${pluginName}`, (e) => {
      const
        that = this,
        targetDOM = e.target,
        $targetClick = $(targetDOM),
        $targetActive = that.$stepItem.filter(`.${classActive}`),
        indexClick = that.$stepItem.index(targetDOM),
        indexActive = that.$stepItem.index($targetActive[0])
      ;

      if ($targetClick.hasClass(classActive)) {
        return;
      }

      if ($targetActive.hasClass(classDone)) {
        that.$nextBtn
          .eq(indexActive)
          .trigger('click', {indexNext: indexClick});
      } else {
        that.$stepItem.removeClass(classCurrent);
        $targetActive.not(`.${classDone}`).addClass(classCurrent);

        that.props.count = indexClick;
        that.changeTab(that.props.count);
      }
    });

    this.$fieldValidate
      .off(`focusin.${pluginName}`)
      .on(`focusin.${pluginName}`, (e) => {
        const $current = $(e.target),
          $currentContainer = $current.closest(`.${formInputItem}`),
          $validateServer = $currentContainer.find(dataValidateServer);

        if ($validateServer.length) {
          $validateServer.remove();
          $current.removeClass(classParsleyError);
        }
      });

    this.$nextBtn
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (e, {indexNext} = {}) => {
        e.preventDefault();

        $(e.target).trigger('click-next');

        const
          that = this,
          { dataStepValid } = that.options,
          $target = $(e.target),
          groupName = $target.attr('data-group-validate'),
          goToNextStep = function() {
            that.props.count = typeof indexNext === 'number' ? indexNext : that.props.count += 1;
            that.changeTab(that.props.count);
          }
        ;

        that.$form.parsley().whenValidate({
          group: groupName
        }).done(() => {
          if ($target.attr('type') !== 'submit') {
            if ($target.is(dataStepValid)) {
              goToNextStep();
              return;
            }

            const dataForm = that.$form.serializeArray();

            that.sendData(dataForm)
              .then(res => {
                if (res.success) {
                  goToNextStep();
                } else {
                  that.renderError(res);
                }

                that.$loading.addClass(classDNone);
              }, err => {
                console.error(err);
              });
          } else {
            that.$form.submit();
          }
        });
      });

    this.$checkbox
      .off(`change.${pluginName}`)
      .on(`change.${pluginName}`, (e) => {
        const
          that = this,
          $targetCurr = $(e.target),
          nameCurr = $targetCurr.attr('name'),
          valueCurr = $targetCurr.is(':checked'),
          objData = {}
        ;

        objData[nameCurr] = valueCurr;

        that.sendData(objData)
          .then(() => {
            that.$loading.addClass(classDNone);
          }, err => {
            console.error(err);
          });
      });
  }

  initParsleyGroup() {
    const { dataNextBtn } = this.options;

    this.$tabContent.each((index, tab) => {
      const
        $validateEle = $(tab).find('input, select, textarea'),
        $btn = $(tab).find(dataNextBtn)
      ;

      $validateEle.attr('data-parsley-group', `tab-${index}`);
      $btn.attr('data-group-validate', `tab-${index}`);
    });
  }

  changeTab(index) {
    let indexDone = index > 0 ? index - 1 : index;

    this.$tabContent.addClass(classDNone).eq(index).removeClass(classDNone);
    this.$stepItem.eq(indexDone).addClass(classDone);
    this.$stepItem.removeClass(classActive).eq(index).addClass(classActive);
    $('html, body').scrollTop(this.$element.offset().top);
  }

  sendData(opts) {
    const
      { url, method } = this.options,
      data = opts,
      headers = {}
    ;

    this.$loading.removeClass(classDNone);

    return callApi({url, headers, data, method});
  }

  renderError({ arrError }) {
    const
      { formInputItem } = this.options,
      $tabCurrent = this.$tabContent.eq(this.props.count)
    ;

    if (!arrError.length) {
      return;
    }

    arrError.forEach((item) => {
      const
        { inputError, msgError} = item,
        $current = $tabCurrent.find(`input[name='${inputError}']`),
        $currentContainer = $current.closest(`.${formInputItem}`),
        $errorDOM = $(generateErrorServer(msgError))
      ;

      if (!$current.length || $currentContainer.find('ul li').length) {
        return;
      }

      $current
        .addClass(classParsleyError)
        .after($errorDOM);
    });
  }
}
