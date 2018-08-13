import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import spaceSaga from './layouts/space/saga'


export default function* root() {
  yield all(
    drizzleSagas.concat([spaceSaga]).map(saga => fork(saga))
  )
}
