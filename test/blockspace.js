var Blockspace = artifacts.require("./Blockspace.sol");

contract('Blockspace', function(accounts) {
  it("...should be insantiated with a startEpoch greater then 0", function () {
     var lat = 1111;
     var lon = 2222;
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.getStartEpoch.call();
    }).then(function (se) {
        assert.isAbove(se, 1, "The startEpoch should be more then 1")
    });
  });

  it("...should be able to create a space", function () {
     var lat = 1111;
     var lon = 2222;
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.createSpace(lat, lon, {from: accounts[0]});
    }).then(function () {
        return blockspaceInstance.getSpaces.call();
    }).then(function (ids) {
        assert.equal(ids.length, 1, "The length of ids should be 1");
    })
  });

  it("...should use arguments to create a space", function () {
     var lat = 1111;
     var lon = 2222;
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.getSpace(0, {from: accounts[0]});
    }).then(function (space) {
        assert.equal(space[0], lat, `space.lat equals ${lat}`);
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

  it("...should be able to create a reservation ", function () {
     return Blockspace.deployed().then(function(instance) {
        blockspaceInstance = instance;
        return blockspaceInstance.createReservation(0, 5, 9, {from: accounts[0], value: 50});
    }).then(function () {
        return blockspaceInstance.getReservations.call(0,4,10);
    }).then(function (res) {
        assert.equal(res[1][1].toNumber(), 5, 'reservation start is correctly set');
    });
  });



});
