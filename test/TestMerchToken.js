const MerchToken = artifacts.require("./MerchToken.sol");
const truffleAssert = require('truffle-assertions');

contract("MerchToken", accounts => {
  it("should have deployed", async () => {
    const merchTokenInstance = await MerchToken.deployed();
  });

  it("should create a token", async () => {
    // get contract instance
    const merchTokenInstance = await MerchToken.deployed();

    // check if the id is initialized to zero
    var storedData = await merchTokenInstance.getTokens.call();
    assert.equal(storedData, 0, "There should be no tokens created.");

    // create a token
    await merchTokenInstance.mintToken(300, "test token 1", "imageurl", "description", false);
    
    // ensure that the contract has incrimented 
    storedData = await merchTokenInstance.getTokens.call();
    assert.equal(storedData, 1, "There should have been one token created.");

    // const tokens = await merchTokenInstance.balanceOf(accounts[0]);
    // assert.equal(tokens, 1, "A token was not created for the user.");
  });

  it("should check the default value", async () => {
    // get contract instance
    const merchTokenInstance = await MerchToken.deployed();

    // check that there is a token created
    storedData = await merchTokenInstance.getTokens.call();
    assert.equal(storedData, 1, "There should have been one token created.")

    // create a token
    // await merchTokenInstance.mintToken(300, "test token 1", "imageurl", "description", false);
    var h = await merchTokenInstance.getToken(0);
    assert.equal(h['0'], 'test token 1', "check the token name");
    assert.equal(h['1'], 'imageurl', "check the token image");
    assert.equal(h['2'], 'description', "check the token description");
    assert.equal(h['3'][0], 300, "check the token price");
    assert.equal(h['3'][1] <= 9, true, "check the token tag");
    assert.equal(h['3'][2] <= 4, true, "check the token type"); 
  });

  it("should stop you from doing stuff you're not supposed to do with the token", async () => {
    const merchTokenInstance = await MerchToken.deployed();
    const tokenId = await merchTokenInstance.tokenOfOwnerByIndex(accounts[0], 0);
    // You can't list a token you don't own!
    truffleAssert.reverts(merchTokenInstance.listToken(tokenId, { from: accounts[1]} ));
    // You can't buy a token that's not for sale!
    truffleAssert.reverts(merchTokenInstance.buyToken(tokenId, { from: accounts[1], value: 300 }));

  });

  it("should change the price of a token", async () => {
    const merchTokenInstance = await MerchToken.deployed();
    const tokenId = await merchTokenInstance.tokenOfOwnerByIndex(accounts[0], 0);

    var h = await merchTokenInstance.getToken(tokenId);
    await merchTokenInstance.listToken(tokenId);
    assert.equal(h['3'][0], 300, "check the token price");

    await merchTokenInstance.changePrice(tokenId,500);
    h = await merchTokenInstance.getToken(tokenId);
    assert.equal(h['3'][0], 500, "check the token price has changed");
  });

  // it("should create a token", async () => {
  //   const merchTokenInstance = await MerchToken.deployed();
  // });

  // it("should create a token", async () => {
  //   const merchTokenInstance = await MerchToken.deployed();
  // });


});
