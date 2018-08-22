import Reservations from './Reservations'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    Blockspace: state.contracts.Blockspace,
  }
}


const ReservationsContainer = drizzleConnect(Reservations, mapStateToProps);

export default ReservationsContainer
