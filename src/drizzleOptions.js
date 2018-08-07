import Blockspace from './../build/contracts/Blockspace.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    Blockspace
  ],
  events: {
    Blockspace: ['SpaceCreated', 'ReservationCreated', 'ReservationPaid', 'ReservationCancelled']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
