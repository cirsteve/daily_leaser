import Space from './Space'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  const genesisDate = Object.keys(state.contracts.Blockspace.getSpaces.valueOf()).length ?
    new Date(parseInt(state.contracts.Blockspace.getStartEpoch.valueOf()["0x0"].value)) : null;
  const today = new Date();
  return {
    accounts: state.accounts,
    Blockspace: state.contracts.Blockspace,
    spaceId: state.routing.locationBeforeTransitions.pathname.slice(1),
    spaces: state.space,
    today
  }
}

const SpaceContainer = drizzleConnect(Space, mapStateToProps);

export default SpaceContainer
