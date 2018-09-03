import Space from './Space'
import { drizzleConnect } from 'drizzle-react'
import { withRouter } from 'react-router-dom'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  const today = new Date();
  return {
    account: state.accounts[0],
    contracts: state.contracts,
    spaces: state.space,
    reservationDates: state.space.reservationDates,
    today,
  }
}


export default withRouter(drizzleConnect(Space, mapStateToProps));
