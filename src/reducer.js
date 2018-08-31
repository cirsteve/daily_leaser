import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import spaceReducer from './blockspaceReducer'
import web3Reducer from './util/web3/web3Reducer'



const reducer = combineReducers({
  routing: routerReducer,
  space: spaceReducer,
  web3Instance:  web3Reducer,
  ...drizzleReducers
})

export default reducer
