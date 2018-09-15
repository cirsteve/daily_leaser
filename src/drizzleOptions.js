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
    Launcher: ['BlockLeaseLaunched', 'DailyLeaseLaunched'],
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
