/* eslint-disable class-methods-use-this */
import { callApi } from '../utils/http';
import { jsPDF } from '../_libs/jspdf.es';
import '../_libs/jspdf.plugin.autotable';

@Plugin({
  options: {
    pluginName: 'GenPdf',
    fontName: 'helvetica',
    optsPdf: {
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    },
    x: 30,
    y: 25
  }
})
export default class GenPdf {
  init () {
    this.initEvent();
  }

  initEvent () {
    const { pluginName } = this.options;

    this.$element
      .off(`click.${pluginName}`)
      .on(`click.${pluginName}`, (event) => this.initGen(event));
  }

  async initGen (event) {
    event.preventDefault();

    let tableContent = [];
    const { optsPdf, x, y, fontName } = this.options;
    const url = this.$element.data('api');
    const param = { url };
    const source = await callApi(param);
    const {
      logo,
      file_name,
      company_name,
      company_address,
      company_info,
      title,
      date,
      footer
    } = source;
    const doc = new jsPDF(optsPdf);
    const center = doc.getPageWidth() / 2;
    const contentMaxWidth = doc.getPageWidth() - (x * 2);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    source.data.forEach(item => {
      const { digital_code, products } = item;

      products.forEach(itemPro => {
        const { product_description_logged } = itemPro.data;
        const desc = product_description_logged.reduce((accumulator, currentValue) => {
          return `${accumulator}${currentValue.replace(/(<([^>]+)>)/gi, '')}`;
        }, '');

        tableContent.push([
          digital_code,
          itemPro.data.post_title,
          itemPro.data.inci_name,
          desc
        ]);
      });
    });

    tableContent.sort((first, second) => first[1].toUpperCase() > second[1].toUpperCase() ? 1 : -1);

    this.getDataUrl(logo, (dataBase64) => {
      // HEADING
      doc.setFont(fontName);
      doc.setFontSize(9);
      doc.addImage(dataBase64, 'png', x, y, 130, 19);
      doc.setFont(fontName, '', 'bold');
      doc.text(company_name, x, y + 30);
      doc.setFont(fontName, '', 'normal');
      doc.text(company_address, x + doc.getTextWidth(company_name) + 10, y + 30);
      doc.text(company_info, x, y + 40);

      // TITLE
      doc.setFontSize(10);
      doc.setFont(fontName, '', 'bold');
      doc.text(title, center, y + 65, { align: 'center' });

      // TABLE
      doc.setFontSize(8);
      doc.setFont(fontName, '', 'normal');
      doc.autoTable({
        theme: 'grid',
        startX: x,
        startY: y + 80,
        styles: {
          fontSize: 9,
          cellPadding: [3, 5],
          lineColor: '#000000',
          textColor: '#000000'
        },
        headStyles: {
          textColor: '#ffffff',
          fillColor: '#000000',
        },
        columnStyles: {
          1: {
            cellWidth: 60,
          },
          2: {
            cellWidth: 120,
          }
        },
        head: [['CODE', 'TRADE NAME', 'INCI NAME', 'DESCRIPTION']],
        body: tableContent,
        foot: [
          [
            {
              content: date,
              colSpan: 4,
              styles: {
                fillColor: '#ffffff',
                halign: 'right'
              }
            }
          ]
        ],
        showFoot: 'lastPage',
        rowPageBreak: 'avoid',
      });

      // FOOTER
      doc.setPage(doc.lastAutoTable.pageCount + 1);
      doc.setTextColor('#bfbfbf');
      doc.text(footer, x, y + doc.lastAutoTable.finalY + 15, {
        maxWidth: contentMaxWidth,
      });

      // PAGE NUMBER
      const pageNumber = doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageNumber; i++) {
        doc.setPage(i);
        doc.text(`${i}/${pageNumber}`, pageWidth - x, pageHeight - ( y - 10 ), { align: 'right' });
      }

      // SAVE
      // doc.save(file_name);
      doc.output('dataurlnewwindow', file_name);
    });
  }

  getDataUrl (imgURL, callback) {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.src = imgURL;
    img.addEventListener('load', function () {
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
      ctx.drawImage(img, 0, 0, this.width, this.height);
      callback.call(this, canvas.toDataURL('image/jpg'));
    });
  }
}
