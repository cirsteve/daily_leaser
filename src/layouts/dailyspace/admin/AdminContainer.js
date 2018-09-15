import Admin from './Admin'
import { drizzleConnect } from 'drizzle-react'
import { withRouter } from 'react-router-dom'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    contracts: state.contracts,
    ipfsError: state.ipfs.error,
  }
}

export default withRouter(drizzleConnect(Admin, mapStateToProps));