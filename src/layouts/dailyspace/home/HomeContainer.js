import Home from './Home'
import { drizzleConnect } from 'drizzle-react'
import { withRouter } from 'react-router-dom'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    web3: state.web3Instance.web3Instance
  }
}

export default withRouter(drizzleConnect(Home, mapStateToProps));
