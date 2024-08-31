const
  classDNone = 'd-none'
;

@Plugin({
  options: {
    dataInforConfirm: '[data-infor-confirm]',
    dataInforEdit: '[data-infor-edit]',
    dataEditBtn: '[data-edit-btn]',
    formElement: 'form'
  }
})
export default class SampleRequest {
  init () {
    this.initDom();
    this.initEvent();
  }

  initDom () {
    const {
      dataEditBtn,
      dataInforEdit,
      dataInforConfirm,
      formElement
    } = this.options;

    this.$editBtn = this.$element.find(dataEditBtn);
    this.$inforConfirm = this.$element.find(dataInforConfirm);
    this.$inforEdit = this.$element.find(dataInforEdit);
    this.$form = this.$element.find(formElement);
  }

  initEvent () {
    const {
      pluginName,
    } = this.options;

    const that = this;

    this.$editBtn
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, () => {
        this.$inforConfirm.toggleClass(classDNone);
        this.$inforEdit.toggleClass(classDNone);
      });

    this.$form
      .off(`submit.${pluginName}`)
      .on(`submit.${pluginName}`, () => {
        if (!that.$form.parsley().validate()) {
          that.$inforConfirm.addClass(classDNone);
          that.$inforEdit.removeClass(classDNone);
        }
      });
  }
}