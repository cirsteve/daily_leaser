import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import spaceReducer from './blockspaceReducer'



const reducer = combineReducers({
  routing: routerReducer,
  space: spaceReducer,
  ...drizzleReducers
})

export default reducer
