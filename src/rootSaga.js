import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import dailyspaceSaga from './dailyspaceApp/saga'
import spaceSaga from './spaceApp/saga'


export default function* root() {
  yield all(
    drizzleSagas.concat([spaceSaga, dailyspaceSaga]).map(saga => fork(saga))
  )
}
