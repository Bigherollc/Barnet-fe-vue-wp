// ROOT
import root from './root';

// MODULES
import product from './modules/product';
import concept from './modules/concept';
import formula from './modules/formula';
import search from './modules/search';
import resource from './modules/resource';

// INIT
const modules = {
  product,
  concept,
  formula,
  search,
  resource
};

for (let mod in modules) {
  if (modules.hasOwnProperty(mod)) {
    modules[mod].namespaced = true;
  }
}

export default new Vuex.Store({
  ...root,
  modules
});
