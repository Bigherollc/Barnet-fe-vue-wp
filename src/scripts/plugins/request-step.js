import { callApi } from '../utils/http';

// Define class-level constants for CSS classes
const classParsleyError = 'parsley-error',
  classDNone = 'd-none',
  classDone = 'done',
  classActive = 'active',
  classCurrent = 'current';

/**
 * Generate HTML for server-side validation errors.
 * @param {string} msgError - The error message.
 * @returns {string} HTML string for the error.
 */
const generateErrorServer = (msgError) => {
  if (typeof msgError !== 'string') {
    console.error('Invalid msgError type:', msgError);
    return '';
  }
  return `<ul class="parsley-errors-list filled" data-validate-server>
    <li class="parsley-required">${msgError}</li>
  </ul>`;
};

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
    formInputItem: 'component-form__item',
  },
})
export default class RequestStep {
  init() {
    this.initProps();
    this.initDom();
    this.initEvent();
    this.initParsleyGroup();
  }

  initProps() {
    this.props = { count: 0 };
  }

  initDom() {
    const {
      dataLoading,
      dataHeading,
      dataProgressStep,
      dataNextBtn,
      dataCheckbox,
      formElement,
      dataTabContent,
      dataFieldValidate,
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

  initEvent() {
    const { pluginName, formInputItem, dataValidateServer } = this.options;

    // Step navigation click event
    this.$stepItem.off(`click.${pluginName}`).on(`click.${pluginName}`, (e) => {
      const targetDOM = e.target,
        $targetClick = $(targetDOM),
        $targetActive = this.$stepItem.filter(`.${classActive}`),
        indexClick = this.$stepItem.index(targetDOM),
        indexActive = this.$stepItem.index($targetActive[0]);

      if ($targetClick.hasClass(classActive)) {
        return;
      }

      if ($targetActive.hasClass(classDone)) {
        this.$nextBtn
          .eq(indexActive)
          .trigger('click', { indexNext: indexClick });
      } else {
        this.$stepItem.removeClass(classCurrent);
        $targetActive.not(`.${classDone}`).addClass(classCurrent);
        this.props.count = indexClick;
        this.changeTab(this.props.count);
      }
    });

    // Input focus event to remove server validation errors
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

    // Next button click event
    this.$nextBtn
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (e, { indexNext } = {}) => {
        e.preventDefault();
        const { dataStepValid } = this.options,
          $target = $(e.target),
          groupName = $target.attr('data-group-validate');

        if (!groupName || typeof groupName !== 'string') {
          console.error('Invalid groupName:', groupName);
          return;
        }
        this.$form
          .parsley()
          .whenValidate({ group: groupName})
          .done(() => {
            if ($target.attr('type') !== 'submit') {
              if (!dataStepValid || typeof dataStepValid !== 'string') {
                console.error('Invalid dataStepValid:', dataStepValid);
                return;
              }
              if ($target.is(dataStepValid)) {
                this.props.count =
                  typeof indexNext === 'number'
                    ? indexNext
                    : this.props.count + 1;
                this.changeTab(this.props.count);
                return;
              }

              const dataForm = this.$form.serializeArray();
              this.sendData(dataForm)
                .then((res) => {
                  if (res.success) {
                    this.props.count =
                      typeof indexNext === 'number'
                        ? indexNext
                        : this.props.count + 1;
                    this.changeTab(this.props.count);
                  } else {
                    this.renderError(res);
                  }
                  this.$loading.addClass(classDNone);
                })
                .catch((err) => console.error('Error sending data:', err));
            } else {
              this.$form.submit();
            }
          })
          .fail(() => {
            console.error('Validation failed for group:', groupName);
          });
      });

    // Checkbox change event
    this.$checkbox
      .off(`change.${pluginName}`)
      .on(`change.${pluginName}`, (e) => {
        const nameCurr = $(e.target).attr('name'),
          valueCurr = $(e.target).is(':checked'),
          objData = { [nameCurr]: valueCurr };

        this.sendData(objData)
          .then(() => this.$loading.addClass(classDNone))
          .catch((err) => console.error('Error sending checkbox data:', err));
      });
  }

  initParsleyGroup() {
    const { dataNextBtn } = this.options;

    this.$tabContent.each((index, tab) => {
      if (typeof index !== 'number') {
        console.error('Invalid index:', index);
        return;
      }

      const $validateEle = $(tab).find('input, select, textarea'),
        $btn = $(tab).find(dataNextBtn);

      $validateEle.attr('data-parsley-group', `tab-${index}`);
      $btn.attr('data-group-validate', `tab-${index}`);
    });
  }

  changeTab(index) {
    const indexDone = index > 0 ? index - 1 : index;

    this.$tabContent.addClass(classDNone).eq(index).removeClass(classDNone);
    this.$stepItem.eq(indexDone).addClass(classDone);
    this.$stepItem.removeClass(classActive).eq(index).addClass(classActive);
    $('html, body').scrollTop(this.$element.offset().top);
  }

  sendData(opts) {
    const { url, method } = this.options;

    this.$loading.removeClass(classDNone);

    if (typeof opts !== 'object') {
      console.error('Invalid data type for opts:', opts);
      return Promise.reject(new Error('Invalid data type for opts'));
    }

    return callApi({ url, headers: {}, data: opts, method });
  }

  renderError({ arrError }) {
    if (!Array.isArray(arrError)) {
      console.error('Invalid arrError:', arrError);
      return;
    }

    const { formInputItem } = this.options,
      $tabCurrent = this.$tabContent.eq(this.props.count);

    arrError.forEach((item) => {
      const { inputError, msgError } = item;

      if (!inputError || typeof inputError !== 'string') {
        console.error('Invalid inputError:', inputError);
        return;
      }

      const $current = $tabCurrent.find(`input[name='${inputError}']`),
        $currentContainer = $current.closest(`.${formInputItem}`),
        $errorDOM = $(generateErrorServer(msgError));

      if (!$current.length || $currentContainer.find('ul li').length) {
        return;
      }

      $current.addClass(classParsleyError).after($errorDOM);
    });
  }
}
