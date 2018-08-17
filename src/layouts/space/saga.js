import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import ipfs from '../../ipfs';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* generateHash(action) {
    console.log('gen hash called:', action);
   try {
      const hash = yield call(ipfs.add, Buffer.from(action.payload.fields, 'utf-8'));

      yield put({type: "FIELDS_HASH_SUCCEEDED", payload:{fields: JSON.parse(action.payload.fields), hash: hash[0].path}});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
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
      yield takeEvery("FIELDS_HASH_REQUESTED", generateHash),
      yield takeEvery("GET_FIELDS_REQUESTED", getHash)
  ])
}

export default spaceSaga;
