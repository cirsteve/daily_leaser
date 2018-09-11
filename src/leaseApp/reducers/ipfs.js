const initialState = {
    hashedContent: {},
    requestedHash: null,
    pendingUpload: false,
    ipfsError: false
};

export default (state = initialState, action) => {
    let pendingUpload;
    let requestedHash;
    let hashedContent = {};

    switch (action.type) {
        case 'IPFS_UPLOAD_REQUESTED':
          pendingUpload = true;
          return Object.assign({}, state, {pendingUpload});
        case 'IPFS_UPLOAD_ACKED':
          requestedHash = null;
          return {requestedHash,...this.state};
        case 'IPFS_UPLOAD_SUCCEEDED':
          pendingUpload = false;
          requestedHash = action.payload.hash;
          hashedContent[action.payload.hash] = action.payload.fields;
          hashedContent = Object.assign({}, state.hashedContent, {hashedContent, requestedHash, pendingUpload);
          return Object.assign({}, state, {hashedContent, pendingHashGeneration: false});
        case 'IPFS_UPLOAD_FAILED':
          pendingUpload = false;
          return Object.assign({}, state, {ipfsError: true, pendingUpload});
        case 'GET_IPFS_SUCCEEDED':
          hashedContent[action.payload.hash] = action.payload.fields;
          hashedContent = Object.assign({}, state.hashedContent, hashedContent);
          return Object.assign({}, state, {ipfsError: false, hashedContent});
        case 'GET_IPFS_FAILED':
          return Object.assign({}, this.state, {ipfsError: true})
        default:
          return state;
    }
}
