import { call, put, takeEvery, all } from 'redux-saga/effects'
import ipfs from '../../ipfs';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* generateFieldsHash(action) {
    console.log('gen fields hash called:', action);
   try {
      const hash = yield call(ipfs.add, Buffer.from(action.payload.fields, 'utf-8'));

      yield put({type: "FIELDS_HASH_SUCCEEDED", payload:{fields: JSON.parse(action.payload.fields), hash: hash[0].path}});
   } catch (e) {
      yield put({type: "IELDS_HASH_FAILED", message: e.message});
   }
}

function* generateFileHash(action) {
    console.log('gen file hash called:', action);
   try {
      const hash = yield call(ipfs.add, Buffer.from(action.payload.file, 'utf-8'));
      console.log('file hash returned: ', hash)
      yield put({type: "FILE_HASH_SUCCEEDED", payload:{hash: hash[0].path}});
   } catch (e) {
      yield put({type: "FILE_HASH_FAILED", message: e.message});
   }
}

function* getHash(action) {
    const url = `/ipfs/${action.payload.hash}`
    console.log('get hash called:', action, url);
    try {
      const fields = yield call(ipfs.get, url);

      yield put({type: "GET_FIELDS_SUCCEEDED", payload:{fields: JSON.parse(fields[0].content.toString()), hash: action.payload.hash}});
    } catch (e) {
      yield put({type: "GET_FIELDS_FAILED", message: e.message});
    }
}

function* spaceSaga() {
  yield all([
      yield takeEvery("FIELDS_HASH_REQUESTED", generateFieldsHash),
      yield takeEvery("FILE_HASH_REQUESTED", generateFileHash),
      yield takeEvery("GET_FIELDS_REQUESTED", getHash)
  ])
}

export default spaceSaga;
