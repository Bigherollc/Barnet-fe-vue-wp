import { callApi } from '../../../utils/http';

export default {
  state: {
    subConcept: [], // use to group product on concept page
    dataConcept: [],
  },

  mutations: {
    subConcept (state, data) {
      state.subConcept = data;
    },

    dataConcept (state, data) {
      state.dataConcept = data;
    },
  },

  actions: {
    async getSource ({ dispatch, rootState }, param) {
      dispatch('setTotalSearchResult', 0, { root: true });

      let source = {};
      const { listType, currentType } = rootState;
      const { dataApi, filterApi } = param;

      // GET CONCEPTS
      const otpsData = { url: dataApi };
      const _conceptData = await callApi(otpsData);
      const { sub_concept, no_sub_concept } = _conceptData;
      //----- GET MAX NUMBER ORDER
      const max_order = sub_concept.reduce((acc, curr) => {
        const order = parseInt(curr.meta.order) || 0;
        return order > acc ? order : acc;
      }, 0) + 1;
      //----- SET MAX NUMBER ORDER 2 SUP CONCEPT NO ORDER
      const sup_concept_check_order = sub_concept.map(sup_concept => {
        const order = !sup_concept.meta.order ? max_order : sup_concept.meta.order;
        return Object.assign({}, sup_concept, { meta: { order } });
      });
      //----- SORT SUP CONCEPT WITH ORDER NUMBER (IF DULICATE ORDER, SORT BY ALPHABET)
      const sub_concept_order = sup_concept_check_order.sort((first, second) => {
        return first.meta.order === second.meta.order ? first.name.localeCompare(second.name) : first.meta.order > second.meta.order ? 1 : -1;
      });

      // SORT PRODUCT IN CONCEPT
      const sub_concept_order_products = sub_concept_order.map(sub_concept => {
        const { products } = sub_concept;
        const products_max_order = products && products.reduce((acc, curr) => {
          const order = parseInt(curr.data.order) || 0;
          return order > acc ? order : acc;
        }, 0) + 1;
        const products_check_order = products && products.map(product => {
          const { data } = product;
          const order = !product.data.order ? products_max_order : product.data.order;
          const assData = Object.assign({}, data, { order });

          return Object.assign({}, product, { data: assData});
        });
        const products_order = products_check_order && products_check_order.sort((first, second) => {
          const firstData = first.data;
          const secondData = second.data;
          return firstData.order === secondData.order ? firstData.post_title.localeCompare(secondData.post_title) : firstData.order > secondData.order ? 1 : -1;
        });

        return Object.assign({}, sub_concept, { products: products_order });
      });

      // GET DATA
      const resData = sub_concept.reduce((acc, cur) => acc.concat(cur.products), []);
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
      listType.forEach(type => {
        let filter = _filter_check_order.filter(item => item.parent === 0);
        const data = no_sub_concept[type] || _data.filter(item =>
          item ? item.data.web_type === type : false
        );
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

        Object.assign(source, { [type]: {data, filter, count} });
      });

      // DISPATCH DATA
      dispatch('updateSupConcept', sub_concept_order_products);
      dispatch('setSource', source, { root: true });
      dispatch('setData', currentType, { root: true });
    },

    updateDataConcept ({ commit, state, rootState }) {
      const { listShow } = rootState;
      const { subConcept } = state;
      const dataConcept = [];

      subConcept.forEach(itemConcept => {
        const { products } = itemConcept;
        const hasConcept = products && products.some(item => listShow.some(it => parseInt(it.data.id) === parseInt(item.data.id)));

        hasConcept && dataConcept.push(itemConcept);
      });

      dataConcept.forEach(itemConcept => {
        const { products } = itemConcept;
        const listTerm = products.filter(item => listShow.some(it => parseInt(it.data.id) === parseInt(item.data.id)));

        itemConcept.list = listTerm;
      });

      commit('dataConcept', dataConcept);
    },

    updateSupConcept ({ commit }, data) {
      commit('subConcept', data);
    },
  }
};
