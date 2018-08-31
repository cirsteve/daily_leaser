import Launcher from './Launcher'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    Launcher: state.contracts.Launcher,
    web3: state.web3Instance.web3Instance
  }
}


export default drizzleConnect(Launcher, mapStateToProps);
