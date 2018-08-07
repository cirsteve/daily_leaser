import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../logo.png'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Drizzle Examples</h1>
            <p>Examples of how to get started with Drizzle in various situations.</p>

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Blockspace</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
            <ContractData contract="Blockspace" method="getSpaces" />
            <p><strong>Create Space</strong>:</p>
            <ContractForm contract="Blockspace" method="createSpace" />
            <ContractData contract="Blockspace" method="getDepositAmount" />
            <ContractForm contract="Blockspace" method="updateDepositAmount" />

            <ContractData contract="Blockspace" method="getSpace" methodArgs={[0]} />


            <br/><br/>
          </div>


        </div>
      </main>
    )
  }
}

export default Home
