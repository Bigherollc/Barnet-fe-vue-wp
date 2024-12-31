import { callApi } from '../../../utils/http';

export default {
  actions: {
    async getSource({ dispatch, rootState }, param) {
      try {
        dispatch('setTotalSearchResult', 0, { root: true });

        const { listType } = rootState;
        const { dataApi, filterApi } = param;

        // GET DATA
        const otpsData = { url: dataApi };
        const resData = await callApi(otpsData);
        const _data = resData.sort((first, second) => {
          const fit = first.data.post_title.toUpperCase();
          const sed = second.data.post_title.toUpperCase();
          return fit > sed ? 1 : -1;
        });

        // GET FILTER
        const otpsFilter = { url: filterApi };
        const _filter = await callApi(otpsFilter);
        const _filter_max_order = _filter.reduce((acc, curr) => {
          const order = Object.prototype.hasOwnProperty.call(curr, 'order') ? parseInt(curr.order) : acc;
          return order > acc ? order : acc;
        }, 0) + 1;

        const _filter_check_order = _filter.map(filter => ({
          ...filter,
          order: Object.prototype.hasOwnProperty.call(filter, 'order') ? parseInt(filter.order) : _filter_max_order
        }));

        // SETUP SOURCE
        const source = {};
        listType.forEach(itemType => {
          let filter = _filter_check_order.filter(item => item.parent === 0);
          const data = _data.filter(item => item.data.web_type === itemType);
          const count = data.length;

          data.forEach(item => {
            if (!item.taxonomies.length) {
              return;
            }

            item.taxonomies.forEach(item_tax => {
              const tax_order = _filter_check_order.find(filter => filter.term_id === item_tax.term_id);
              const item_tax_order = {
                ...item_tax,
                order: tax_order ? tax_order.order : _filter_max_order
              };

              if (!filter.some(item => item.term_id === item_tax_order.term_id)) {
                filter.push(item_tax_order);
              }
            });
          });

          source[itemType] = { filter, data, count };
        });

        // Dispatch or commit the source to the state as needed
        // Example: dispatch('setSource', source, { root: true });
      } catch (error) {
        console.error('Error fetching source data:', error);
      }
    }
  }
};
