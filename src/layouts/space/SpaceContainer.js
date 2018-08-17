import Space from './Space'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  const today = new Date();
  return {
    accounts: state.accounts,
    Blockspace: state.contracts.Blockspace,
    id: state.routing.locationBeforeTransitions.pathname.split('/')[2],
    spaces: state.space,
    reservationDates: state.space.reservationDates,
    today,
  }
}


const SpaceContainer = drizzleConnect(Space, mapStateToProps);

export default SpaceContainer
