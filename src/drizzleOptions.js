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
    Launcher
  ],
  events: {
    Launcher: ['BlockspaceLaunched', 'SpaceLaunched'],
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
