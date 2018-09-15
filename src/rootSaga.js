import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import leaseSaga from './leaseApp/saga'


export default function* root() {
  yield all(
    drizzleSagas.concat([leaseSaga]).map(saga => fork(saga))
  )
}
