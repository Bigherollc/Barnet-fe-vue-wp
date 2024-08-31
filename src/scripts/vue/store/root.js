function recursiveFilter (data, filter, index) {
  let listTerm;
  let nextIndex = index + 1;

  if ( !filter.length ) {
    return data;
  }

  listTerm = data.filter(itemProduct => {
    const slug = filter[index];
    return itemProduct.taxonomies.some(item => item.slug === slug);
  });

  if ( nextIndex <= (filter.length - 1) ) {
    listTerm = recursiveFilter(listTerm, filter, nextIndex);
  }

  return listTerm;
}

Vue.use(Vuex);

export default {
  state: {
    listType: [],
    currentType: null,
    source: {},
    listProduct: [], // use to get list product
    listTerm: [], // use to filter
    listShow: [], // use to show list product
    listFilter: [], // use to get list filter
    selectedFilter: [], // use to filter functions
    page: 1,
    skip: 20,
    total: 0,
    totalPage: 0,
    hasData: false,
    isMore: true,
    isDarkMode: false,
    isGroup: false,
    time4Load: 300,
  },

  getters: {
    getCurrentType: state => state.currentType,

    firstAvailableSection: ({source, currentType, search}) => {
      const { conceptSource } = search;
      const countConcept = conceptSource[currentType]?.length || 0;
      const countSource = source[currentType]?.count;

      if ( countConcept + countSource > 0 ) {
        return currentType;
      }

      return Object.keys(source).find(item => source[item].count) || currentType;
    },
  },

  mutations: {
    listType (state, data) {
      state.listType = data;
    },

    currentType (state, data) {
      state.currentType = data;
    },

    source (state, data) {
      state.source = data;
    },

    listProduct (state, data) {
      state.listProduct = data;
    },

    listTerm (state, data) {
      state.listTerm = data;
    },

    clearListTerm (state) {
      state.listTerm = [];
    },

    listShow (state, data) {
      data.forEach(item => {
        state.listShow.push(item);
      });
    },

    clearListShow (state) {
      state.listShow = [];
    },

    page (state, data) {
      state.page = data;
    },

    total (state, data) {
      state.total = data;
    },

    totalPage (state, data) {
      state.totalPage = data;
    },

    hasData (state, data) {
      state.hasData = data;
    },

    listFilter (state, data) {
      state.listFilter = data;
    },

    isMore (state, data) {
      state.isMore = data;
    },

    isGroup (state, data) {
      state.isGroup = data;
    },

    selectedFilter (state, data) {
      state.selectedFilter = data;
    },

    isDarkMode (state, data) {
      state.isDarkMode = data;
    },
  },

  actions: {
    reUpdateSourceCount ({state, dispatch}) {
      const { source } = state;

      for (const key in source) {
        if (Object.hasOwnProperty.call(source, key)) {
          const element = source[key];
          const count = element.data.length;

          source[key].count = count;
        }
      }

      dispatch('setSource', source);
    },

    pushListType ({ state, commit }, data) {
      let { listType } = state;
      listType.push(data);
      commit('listType', listType);
    },

    setSource ({ commit }, data) {
      commit('source', data);
    },

    setData ({ state, dispatch }, type) {
      const { source } = state;
      const dataGeted = source[type];
      const data = dataGeted?.data || [];
      const filter = dataGeted?.filter || [];

      filter && filter.forEach(item => Object.assign(item, {active: false}));

      dispatch('setCurrentType', type);
      dispatch('updateListProduct', data);
      dispatch('updateListFilter', filter);
      dispatch('emptySelectedFilter');
    },

    actionFilter ({ state, dispatch }) {
      const {
        listProduct,
        selectedFilter,
        skip,
        currentType,
        source,
        search,
      } = state;
      const listTerm = recursiveFilter(listProduct, selectedFilter, 0);
      const listFinal =  selectedFilter.length > 0 ? listTerm : listProduct;
      const isMore = listFinal.length > state.skip;
      const totalPage = Math.ceil(listFinal.length / skip);
      const count = listFinal.length;
      const countConceptSearch = search.conceptSource[currentType] ? search.conceptSource[currentType]?.length : 0;
      const countAll = count + countConceptSearch;

      if ( source[currentType] ) {
        Object.assign(source[currentType], {count});
      }

      dispatch('updatePage', 1);
      dispatch('clearListTerm');
      dispatch('clearListShow');
      dispatch('updateTotal', countAll);
      dispatch('updateTotalPage', totalPage);
      dispatch('updateListTerm', listFinal);
      dispatch('updateIsMore', isMore);
      dispatch('updateCountFilter', listFinal);
      dispatch('setSource', source);
      dispatch('updateListShow');
      dispatch('concept/updateDataConcept');
      dispatch('concept/updateDataNoConcept');
    },

    updateListProduct ({ commit }, data) {
      commit('listProduct', data);
    },

    updateListFilter ({ commit }, data) {
      commit('listFilter', data);
    },

    updateTotal ({ commit }, data) {
      commit('total', data);
    },

    updateTotalPage ({ commit }, data) {
      commit('totalPage', data);
    },

    updateHasData ({ commit }, data) {
      commit('hasData', data);
    },

    updateListTerm ({ commit }, data) {
      commit('listTerm', data);
    },

    clearListTerm ({ commit }) {
      commit('clearListTerm');
    },

    updateListShow ({ state, commit, dispatch }) {
      const { page, skip, totalPage, listTerm, isGroup } = state;
      const start = (page - 1) * skip;
      const end = start + ( skip - 1 );
      const _dataSort = listTerm.filter((item, index) => (start <= index && index <= end));
      const isMore = isGroup ? false : page < totalPage;

      dispatch('updateIsMore', isMore);
      commit('listShow', isGroup ? listTerm : _dataSort);
      dispatch('concept/updateDataConcept');
      dispatch('concept/updateDataNoConcept');
    },

    clearListShow ({ commit }) {
      commit('clearListShow');
    },

    updatePage ({ commit }, data) {
      commit('page', data);
    },

    updateIsMore ({ commit }, data) {
      commit('isMore', data);
    },

    updateIsGroup ({ commit }, data) {
      commit('isGroup', data);
    },

    addItemArrSelectedFilter ({ state, dispatch }, data) {
      const { selectedFilter, listFilter } = state;

      listFilter.forEach(item => {
        if ( item.slug === data ) {
          Object.assign(item, {active: true});
        }
      });
      selectedFilter.push(data);

      dispatch('updateSelectedFilter', selectedFilter);
      dispatch('updateListFilter', [...listFilter]);
    },

    removeItemArrSelectedFilter ({ state, dispatch }, data) {
      const { selectedFilter, listFilter } = state;

      listFilter.forEach(item => {
        if ( item.slug === data ) {
          Object.assign(item, {active: false});
        }
      });
      selectedFilter.splice(selectedFilter.indexOf(data), 1);

      dispatch('updateSelectedFilter', selectedFilter);
      dispatch('updateListFilter', [...listFilter]);
    },

    updateSelectedFilter ({ commit }, data) {
      commit('selectedFilter', data);
    },

    emptySelectedFilter ({ commit }) {
      commit('selectedFilter', []);
    },

    updateCountFilter ({ state, dispatch }, data) {
      const { listFilter } = state;

      listFilter.forEach((item, index) => {
        let count = 0;
        const { slug } = item;

        if ( item.parent === 0 ) {
          return;
        }

        data.forEach(itemData => itemData.taxonomies.some(ele => ele.slug === slug) && count++);
        listFilter[index].count = count;
      });

      dispatch('updateListFilter', listFilter);
    },

    setCurrentType ({ commit }, data) {
      commit('currentType', data);
    },

    setDarkMode ({ commit }, data) {
      commit('isDarkMode', data);
    },
  }
};
