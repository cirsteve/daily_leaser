var Blockspace = artifacts.require("./Blockspace.sol");

const TEST_HASH = 'a23a';

contract('Blockspace', function(accounts) {
  it("...should be insantiated with a startEpoch greater then 0", async () => {
    let instance = await Blockspace.deployed();
    let se = await instance.getStartEpoch.call();
    assert.isAbove(1*se, 1, "The startEpoch should be more then 1");
    });

  it("...should be able to create a space", async () => {
    let instance = await Blockspace.deployed();
    await instance.createSpace(TEST_HASH, {from: accounts[0]});
    let ids = await instance.getSpaces.call();
    assert.equal(ids.length, 1, "The length of ids should be 1");
    });

  it("...should use arguments to create a space", async () => {
    let instance = await Blockspace.deployed();
    let space = await instance.getSpace(0, {from: accounts[0]});
    assert.equal(space[1], TEST_HASH, `space.hash equals ${TEST_HASH}`);
    });

  it("...should update deposit.", async () => {
    let instance = await Blockspace.deployed();
    await instance.updateDepositAmount(5, {from: accounts[0]});
    let depositAmount = await instance.getDepositAmount.call();
    assert.equal(depositAmount, 5, "the deposit amount was updated to .");
    });

  it("...should update daily fee amount.", async () => {
    const fee = 100;
    let instance = await Blockspace.deployed();
    await instance.updateDailyFee(fee, {from: accounts[0]});
    let feeAmount = await instance.getDailyFee.call();
    assert.equal(feeAmount, fee, "the daily fee amount was updated");
    });

  it("...should be able to create a reservation ", async () => {
    let instance = await Blockspace.deployed();
    await instance.createReservation(0, 5, 9, {from: accounts[0], value: 5});
    let reservations = await instance.getReservations.call(0, 4, 10);
    assert.equal(reservations[1][1].toNumber(), 5, 'reservation start is correctly set');
    let availability = await instance.getAvailability.call(0, 4, 10);
    assert.equal(availability[0], false, 'available date is marked false');
    assert.equal(availability[1], true, 'booked date is marked true');
    });

  it("...should be able to pay for a reservation ", async () => {
    let instance = await Blockspace.deployed();
    await instance.payReservation(0, 5, {from: accounts[0], value: 100});
    let reservation = await instance.getReservations.call(0, 5, 6);
    assert.equal(reservation[3][0].toNumber(), 105, 'reservation amtPaid is updated');
    });

  it("...should be able to cancel a reservation", async () =>{
    let instance = await Blockspace.deployed();
    await instance.cancelReservation(0, 5, 0);
    let reservation = await instance.getReservations.call(0, 5, 6);
    assert.equal(reservation[0][0], 0, 'reservation is cancelled');
    });

});
