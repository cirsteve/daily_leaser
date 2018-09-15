import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import ipfsReducer from './leaseApp/reducers/ipfs'
import leaseReducer from './leaseApp/reducers/lease'
import web3Reducer from './util/web3/web3Reducer'



const reducer = combineReducers({
  routing: routerReducer,
  lease: leaseReducer,
  ipfs: ipfsReducer,
  web3Instance:  web3Reducer,
  ...drizzleReducers
})

export default reducer
