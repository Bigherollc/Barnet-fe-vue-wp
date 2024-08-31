import { $win } from '../utils/doms';

@Plugin({
  options: {
    pluginName: `table`,

    dataTableHead: 'th',
    dataTableRow: 'tr',
    dataTableCell: 'td',
    dataTitle: 'data-title',
  }
})
export default class Table {
  init () {
    this.initDOM();
    this.initWinEvent();
    this.handleEvent();
  }

  initWinEvent () {
    $win.on(`onInitTable`, this.initTable);
  }

  initDOM () {
    const { $element } = this;
    const {
      dataTableHead,
      dataTableRow,
      dataTableCell
    } = this.options;

    this.$element = $element;
    this.tblHead = $element.find(dataTableHead);
    this.tblRow = $element.find(dataTableRow);
    this.tblCell = $element.find(dataTableCell);
  }

  handleEvent () {
    const arr_text_table_head = [];
    const $ele = this.$element;

    $ele.find(this.tblHead).each((index, element) => {
      arr_text_table_head.push($(element).text());
    });

    $ele.find(this.tblRow).each((indexRow, tblRow) => {
      $(tblRow).find(this.tblCell).each((indexCell, tblCell) => {
        $(tblCell).attr(this.options.dataTitle, arr_text_table_head[indexCell]);
      });
    });
  }

  initTable = () => {
    this.initDOM();
    this.handleEvent();
  }
}
