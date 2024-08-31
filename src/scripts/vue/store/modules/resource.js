import { callApi } from '../../../utils/http';

export default {
  actions: {
    async getSource ({ dispatch, rootState }, param) {
      dispatch('setTotalSearchResult', 0, { root: true });

      let source = {};
      const { listType, currentType } = rootState;
      const { dataApi, filterApi } = param;

      // GET DATA
      const otpsData = { url: dataApi };
      const resData = await callApi(otpsData);
      // const filData = resData.filter(resource => !/(pdf)/.test(resource.data.resource_media_type));
      const _data = resData.sort((first, second) => {
        const fit = first.data.post_title.toUpperCase();
        const sed = second.data.post_title.toUpperCase();

        return fit > sed ? 1 : -1;
      });


      // GET FILTER
      const otpsFilter = { url: filterApi };
      const _filter = await callApi(otpsFilter);
      const _filter_max_order = _filter.reduce((acc, curr) => {
        const order = curr.hasOwnProperty('order') ? parseInt(curr.order) : acc;
        return order > acc ? order : acc;
      }, 0) + 1;
      const _filter_check_order = _filter.map(filter => Object.assign({}, filter, { order: filter.hasOwnProperty('order') ? parseInt(filter.order) : _filter_max_order }));

      // SETUP SOURCE
      listType.forEach(itemType => {
        let filter = _filter_check_order.filter(item => item.parent === 0);
        const data = _data.filter(item => item.data.web_type === itemType);
        const count = data.length;

        data.forEach(item => {
          if ( !item.taxonomies.length ) {
            return;
          }

          item.taxonomies.forEach(item_tax => {
            const tax_order = _filter_check_order.filter(filter => filter.term_id === item_tax.term_id)[0];
            const item_tax_order = Object.assign({}, item_tax, {order: tax_order ? tax_order.order : _filter_max_order});

            !filter.some(item => item.term_id === item_tax_order.term_id) && filter.push(item_tax_order);
          });
        });
        Object.assign(source, { [itemType]: {data, filter, count} });
      });

      dispatch('setSource', source, { root: true });
      dispatch('setData', currentType, { root: true });
    },
  },
};
