import Reservations from './Reservations'
import { drizzleConnect } from 'drizzle-react'
import { withRouter } from 'react-router-dom'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    contracts: state.contracts,
  }
}


export default withRouter(drizzleConnect(Reservations, mapStateToProps));
