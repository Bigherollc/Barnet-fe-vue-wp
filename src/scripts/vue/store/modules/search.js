import { callApi } from '../../../utils/http';

export default {
  state: {
    dataApi: '',
    filterApi: '',
    searchKeyword: '',
    totalSearchResult: 0,
    conceptSource: {},
  },

  mutations: {
    dataApi (state, data) {
      state.dataApi = data;
    },

    filterApi (state, data) {
      state.filterApi = data;
    },

    searchKeyword (state, data) {
      state.searchKeyword = data;
    },

    totalSearchResult (state, data) {
      state.totalSearchResult = data;
    },

    conceptSource (state, data) {
      state.conceptSource = data;
    },
  },

  getters: {
    getUrlApi: state => {
      return {
        dataApi: state.dataApi,
        filterApi: state.filterApi,
      };
    }
  },

  actions: {
    async getSource ({ dispatch, state, rootState }, param) {
      let source = {};
      let conceptSource = {};
      let { searchKeyword } = state;

      const { listType } = rootState;
      const { dataApi, filterApi } = param;
      const listTypeConcept = ['active', 'system', 'dispersions'];
      // UPDATE URL
      dispatch('updateApiUrl', param);

      // GET DATA
      const otpsData = { url: dataApi };
      searchKeyword && Object.assign(otpsData, {
        data: { q: searchKeyword }
      });
      const _data = await callApi(otpsData);
      // GET PRODUCT HIGHEST POINT
      // const indexDataHasCurrentType = Object.keys(_data).find(item => listType.some(type => type === _data[item].data.web_type));
      const ignoreType = ['concept_active_system', 'concept_active', 'concept_system'];
      const indexDataHasCurrentType = 0;
      const currentType = !ignoreType.includes(_data[indexDataHasCurrentType]?.data.web_type) ? _data[indexDataHasCurrentType]?.data.web_type : 'active';

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

      // SETUP CONCEPT SOURCE
      listTypeConcept.forEach(itemType => {
        const type = `concept_${itemType}`;
        const types = `concept_active_system`;
        const data = _data.filter(item => item.data.web_type === type || item.data.web_type === types);

        Object.assign(conceptSource, { [itemType]: data });
      });

      dispatch('setSource', source, { root: true });
      dispatch('setData', currentType, { root: true });
      dispatch('actionFilter', null, { root: true });
      dispatch('setTotalSearchResult', _data.length);
      dispatch('setConceptSource', conceptSource);
    },

    updateApiUrl ({commit}, data) {
      const { dataApi, filterApi } = data;

      commit('dataApi', dataApi);
      commit('filterApi', filterApi);
    },

    setSearchKeyword ({ commit }, data) {
      commit('searchKeyword', data);
    },

    setTotalSearchResult ({ commit }, data) {
      commit('totalSearchResult', data);
    },

    setConceptSource ({ commit }, data) {
      commit('conceptSource', data);
    },
  },
};
