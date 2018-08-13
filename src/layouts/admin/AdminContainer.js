import Home from './Home'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Blockspace: state.contracts.Blockspace,
    spaceIds: Object.keys(state.contracts.Blockspace.getSpaces.valueOf()).length ? state.contracts.Blockspace.getSpaces.valueOf()["0x0"].value : []
  }
}

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer
