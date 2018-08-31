import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { DrizzleProvider } from 'drizzle-react'

// Layouts
import App from './App'
import HomeContainer from './layouts/home/HomeContainer'
import SpaceContainer from './layouts/space/SpaceContainer'
import AdminContainer from './layouts/admin/AdminContainer'
import ReservationsContainer from './layouts/reservations/ReservationsContainer'
import LauncherContainer from './layouts/launcher/LauncherContainer'
import ContractWrapper from './layouts/common/ContractWrapper'
import { LoadingContainer } from 'drizzle-react-components'

import store from './store'
import drizzleOptions from './drizzleOptions'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={LauncherContainer} />
            <Route path="/:address" component={ContractWrapper} />
            <Route path="/:address/space/:id" component={SpaceContainer} />
            <Route path="/:address/admin" component={AdminContainer} />
            <Route path="/:address/user" component={ReservationsContainer} />
          </Route>
        </Router>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
