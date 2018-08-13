const initialState = {toCreate:{}};

const spaceReducer = (state = initialState, action) => {
    let update = {};

    switch (action.type) {
        case 'FIELDS_HASH_SUCCEEDED':
            update.toCreate = {hash: action.payload.hash, fields:action.payload.fields};
            return Object.assign({}, state, update);
        case 'GET_FIELDS_SUCCEEDED':
            update[action.payload.hash] = action.payload.fields;
            return Object.assign({}, state, update);
        default:
            return state;
    }
}

export default spaceReducer;
