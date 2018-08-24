#Blockspace dApp

Blockspace is a solidity smart contract and web3 front end that allows for daily leasing of any entity. The application utilizes ipfs for meta data storage so leasing of entities with various meta data is possible. The use case I focused on for this implementation is reservation system for a campground.

For owners this smart contract allows them to set meta data regarding the rentable spaces including required deposit, daily fee, and and image detailing the location of the rentable spaces. The are also able to create Spaces which can then be reserved.

For users/renters the app allows them to reserve Spaces and pay for the reserved dates.

All address can create reservation however only the owner of the account is able to create spaces and update meta data.

to install the app download the app and ensure npm is installed, then run
```
npm install
```
to run the app ensure ganache-cli is installed and running
```
ganache-cli
```
then compile and deploy the smart contract, inside the project directory run
```
truffle compile   

truffle deploy
```
once the contract is deployed compile and serve the front end to interact with the app
```
npm run start
```
to run the tests
```
truffle test
```

rinkeby
0x0c4b3a1f251d50f0ebc72f9213977620a41ae9b7
