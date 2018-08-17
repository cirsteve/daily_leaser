var Blockspace = artifacts.require("./Blockspace.sol");

const TEST_HASH = 'a23a';

contract('Blockspace', function(accounts) {
  it("...should be insantiated with a startEpoch greater then 0", function () {
     var lat = 1111;
     var lon = 2222;
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.getStartEpoch.call();
    }).then(function (se) {
        assert.isAbove(1*se, 1, "The startEpoch should be more then 1")
    });
  });

  it("...should be able to create a space", function () {

     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.createSpace(TEST_HASH, {from: accounts[0]});
    }).then(function () {
        return blockspaceInstance.getSpaces.call();
    }).then(function (ids) {
        assert.equal(ids.length, 1, "The length of ids should be 1");
    })
  });

  it("...should use arguments to create a space", function () {
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.getSpace(0, {from: accounts[0]});
    }).then(function (space) {
        assert.equal(space[1], TEST_HASH, `space.hash equals ${TEST_HASH}`);
    });
  });

  it("...should update deposit amount to 5.", function() {
    return Blockspace.deployed().then(function(instance) {
      blockspaceInstance = instance;

      return blockspaceInstance.updateDepositAmount(5, {from: accounts[0]});
    }).then(function() {
      return blockspaceInstance.getDepositAmount.call();
  }).then(function(depositAmount) {
      assert.equal(depositAmount, 5, "the deposit amount was updated to .");
    });
  });

  it("...should update daily fee amount.", function() {
    const fee = 100
    return Blockspace.deployed().then(function(instance) {
      blockspaceInstance = instance;

      return blockspaceInstance.updateDailyFee(fee, {from: accounts[0]});
    }).then(function() {
      return blockspaceInstance.getDailyFee.call();
  }).then(function(feeAmount) {
      assert.equal(feeAmount, fee, "the daily fee amount was updated");
    });
  });

  it("...should be able to create a reservation ", function () {
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.createReservation(0, 5, 9, {from: accounts[0], value: 5000});
    }).then(function () {
        return blockspaceInstance.getReservations.call(0,4,10);
    }).then(function (res) {
        assert.equal(res[1][1].toNumber(), 5, 'reservation start is correctly set');
    }).then(function() {
        return blockspaceInstance.getAvailability.call(0,3,10);
    }).then(function(avail) {
        assert.equal(avail[0], false, 'available date is marked false');
        assert.equal(avail[1], false, 'booked date is marked true');
    });
  });



});
