import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { DrizzleProvider } from 'drizzle-react'

// Layouts
import App from './App'
import LauncherContainer from './layouts/launcher/LauncherContainer'
import ContractWrapper from './layouts/common/ContractWrapper'
import { LoadingContainer } from 'drizzle-react-components'

import store from './store'
import drizzleOptions from './drizzleOptions'

// Initialize react-router-redux.
//const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <BrowserRouter>
        <div>
            <Route exact={true} path="/" component={LauncherContainer} />
            <Route exact={true} path="/:site/:address" component={ContractWrapper} />
            <Route path="/:site/:address/space/:id" component={ContractWrapper} />
            <Route path="/:site/:address/admin" component={ContractWrapper} />
            <Route path="/:site/:address/user" component={ContractWrapper} />
            </div>
        </BrowserRouter>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
