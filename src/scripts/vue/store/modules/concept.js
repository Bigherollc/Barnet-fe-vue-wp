import { callApi } from '../../../utils/http';

export default {
  state: {
    subConcept: [], // use to group product on concept page
    dataConcept: [],
  },

  mutations: {
    setSubConcept(state, data) {
      state.subConcept = data;
    },

    setDataConcept(state, data) {
      state.dataConcept = data;
    },
  },

  actions: {
    async getSource({ dispatch, rootState }, param) {
      dispatch('setTotalSearchResult', 0, { root: true });

      const { dataApi } = param;

      // GET CONCEPTS
      const otpsData = { url: dataApi };
      const _conceptData = await callApi(otpsData);
      const { sub_concept } = _conceptData;

      // GET MAX NUMBER ORDER
      const max_order = sub_concept.reduce((acc, curr) => {
        const order = parseInt(curr.meta.order) || 0;
        return order > acc ? order : acc;
      }, 0) + 1;

      // SET MAX NUMBER ORDER TO SUB CONCEPT WITHOUT ORDER
      const sub_concept_check_order = sub_concept.map(sup_concept => {
        const order = !sup_concept.meta.order ? max_order : sup_concept.meta.order;
        return { ...sup_concept, meta: { ...sup_concept.meta, order } };
      });

      // SORT SUB CONCEPT WITH ORDER NUMBER (IF DUPLICATE ORDER, SORT BY ALPHABET)
      const sub_concept_order = sub_concept_check_order.sort((first, second) => {
        return first.meta.order === second.meta.order
          ? first.name.localeCompare(second.name)
          : first.meta.order - second.meta.order;
      });

      // SORT PRODUCT IN CONCEPT
      const sub_concept_order_products = sub_concept_order.map(sub_concept => {
        // Your sorting logic for products within each sub_concept
      });

      // Commit the sorted sub_concept_order_products to the state
      dispatch('setSubConcept', sub_concept_order_products);
    }
  }
};
