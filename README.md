# Blockspace dApp

Blockspace is a solidity smart contract and web3 front end that allows for daily leasing of any entity. The application utilizes ipfs for meta data storage so leasing of entities with various meta data is possible. The use case I focused on for this implementation is reservation system for a campground.

to install the app download the app and ensure npm is installed, then run
```
npm install
```
to run the app ensure ganache-cli is installed and run it with a blockTime, -b, argument, the default setting of automine causes issues with the front end staying updated
```
ganache-cli -b 3
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

## Use Cases  
This app has two type of users. For owners this smart contract allows them to set meta data regarding the rentable spaces including required deposit, daily fee, and and image detailing the location of the rentable spaces. The are also able to create Spaces which can then be reserved.

For renters the app allows them to reserve Spaces and pay for the reserved dates.

All address can create reservation however only the owner of the account is able to create spaces and update meta data.

### For owners
#### Update Metadata
To update deposit or dailyFee as the owner account navigate to the admin page '/admin' and then click 'Edit Meta Data', this screen allows the owner of the contract to upda the deposit amount, daily fee, and layout file hash. To update the deposit or daily fee enter the amount into one of the corresponding inputs and click 'Submit', this will launch a metamask modal. Click submit in the modal and wait for the transaction to be mined. The UI should automatically update when the transaction is mined however it does not. If the transaction is mined, as indicated by metamask, but the UI does not update refresh the page to see the updated data.

To update the layout file a file must first be updated to IPFS and its hash recorded. To do so drag a file into the upload box, this will trigger the upload to IPFS and the UI will indicate the hash is being generated. After the hash is generated a button to send the hash to the contract will be revealed. Clicking that button will launch the metamask modal, clicking submit on the modal will send the transaction to the contract.


#### Creating Spaces
All reservations in this dApp are based on Spaces, in order to allow users to create reservations Spaces need to be created first. To create a Space you must be logged into metamask as the owner account of the contract and navigate to the '/admin' page and click on the 'Create Space' menu option. This will show the 'Create Space' screen consisting of the fields comprising a Space. Fill in the values and then click 'Generate Hash'. Once the hash is generated the click the 'Create Space' button which will launch the metasmask modal. Submit the transaction to and the Space should be created.

### For Users

#### Creating Reservations
Users of the dApp can lease Spaces. To do so sign in to metamask and navigate to the home page. Click on the Space that you want to create a reservation for. The Space detail page shows meta data about the Space and a calendar showing booked dates. Clicking on first date of the reservation and then the second. With both dates reserved then click one of the 2 reservation buttons to either pay the entire fee now or just the deposit. Clicking either of those two buttons will launch a metamask modal, clicking 'Confirm' on the modal will send the transaction to the blochain.

#### Paying For or Cancelling Reservations
Clicking on the 'User Reservations' option on the navigation menu will bring the user to a page listing the current reservations for that user. Each reservation will include details of the reservation along with the option to pay any remaining fee or to cancel the reservation. Clicking either option for a Reservation wil launch a metamask modal, clicking 'Confirm' in the modal will publish the transaction to the blockchain.

## Known Issues
-the default gas limit for cancelling a reservation is not sufficient, to successfully cancel a reservation increase the gas limit in the metamask transaction confirmation pop up
rinkeby

-The calendar libary used to select reservation dates:
-- it does not allow for advancing months although the app can still be test by choosing dates within this and the next month

-- if dates are already selected only one reservation range can be chosen. After choosing two dates any subsequent selections will cause issue.
