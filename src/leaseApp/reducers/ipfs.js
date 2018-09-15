const initialState = {
    hashedContent: {},
    requestedHash: null,
    pendingUpload: false,
    error: false
};

export default (state = initialState, action) => {
    let pendingUpload;
    let requestedHash;
    let error;
    let hashedContent = {};

    switch (action.type) {
        case 'IPFS_UPLOAD_REQUESTED':
          pendingUpload = true;
          return Object.assign({}, state, {pendingUpload});
        case 'IPFS_UPLOAD_ACKED':
        console.log('ipfs upload acked')
          requestedHash = null;
          return {...state, requestedHash};
        case 'IPFS_UPLOAD_SUCCEEDED':
        console.log('ipfs upload success')
          pendingUpload = false;
          error = false
          requestedHash = action.payload.hash;
          return Object.assign({}, state, {requestedHash, pendingUpload, error});
        case 'IPFS_UPLOAD_FAILED':
          pendingUpload = false;
          return Object.assign({}, state, {error: action.message, pendingUpload});
        case 'GET_IPFS_SUCCEEDED':
          hashedContent[action.payload.hash] = action.payload.fields;
          hashedContent = Object.assign({}, state.hashedContent, hashedContent);
          return Object.assign({}, state, {error: false, hashedContent});
        case 'GET_IPFS_FAILED':
          return Object.assign({}, state, {ipfsError: true})
        default:
          return state;
    }
}
