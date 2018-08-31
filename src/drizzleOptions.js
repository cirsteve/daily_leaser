import Blockspace from './../build/contracts/Blockspace.json'
import Launcher from './../build/contracts/Launcher.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    //Blockspace,
    Launcher
  ],
  events: {
    Launcher: ['ContractLaunched'],
    //Blockspace: ['SpaceCreated', 'ReservationCreated', 'ReservationPaid', 'ReservationCancelled']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
