const initialState = {
  web3Instance: null
}

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED')
  {
    console.log('web3 is inited', action)
    return Object.assign({}, state, {
      web3Instance: action.payload ? action.payload.web3Instance : null
    })
  }

  return state
}

export default web3Reducer
