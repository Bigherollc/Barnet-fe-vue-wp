// ROOT
import { createStore } from 'vuex'
import root from './root'

// MODULES
import product from './modules/product'
import concept from './modules/concept'
import formula from './modules/formula'
import search from './modules/search'
import resource from './modules/resource'

// INIT
const modules = {
  product,
  concept,
  formula,
  search,
  resource
}

export default createStore({
  ...root,
  modules
})

