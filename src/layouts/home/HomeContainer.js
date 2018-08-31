import Home from './Home'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  const contractAddr = state.routing.locationBeforeTransitions.pathname.split('/')[1];
  const contract = state.contracts[contractAddr];
  return {
    accounts: state.accounts,
    contract,
    contractAddr,
    web3: state.web3Instance.web3Instance
  }
}

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer
