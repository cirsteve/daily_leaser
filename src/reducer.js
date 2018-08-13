import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import spaceReducer from './layouts/space/reducer'



const reducer = combineReducers({
  routing: routerReducer,
  space: spaceReducer,
  ...drizzleReducers
})

export default reducer
