# Blockchain Developer DeCal - Final Project
### Ayush Aggarwal, Joe Broder, Ryan Adolf

Hello! For the final project in this course we want to give you some intuition on how a dApp looks in code. For this, we have created an NFT marketplace (which,
for the record, was a project idea we came up with before this awkward hype wave). 

## THE BACKSTORY 
Oski Bear is a godly figure on campus and wants to profit off of his clout. He decides to create a marketplace to exclusively offer his NFT's on. 
This marketplace is going to be created by you, the dev he hired from the DeCal. He has created a set of 5 TAGS and 10 MERCHTYPES to apply to NFT's created by
users of the marketplace. You will implement the logic to psuedo-randomly assign properties to NFT's created by a user. You will then implement a utility function
so that these NFT's are usable to other people and protocols, and finally connect the contract to a website using web3.js 

### Here is a breakdown of what you will be doing: 

1. Finishing some smart contract functions to complete the MerchToken.sol contract, which is the backend of our application
2. looking over the tests we wrote to understand how these are made
3. Implementing some front end web3 calls to complete the integration

We have provided skeleton code for this marketplace application, and here I will provide a guide on how to get started. 


First, there are a couple things to install. If you are on mac, I recomend using homebrew. If on PC, install these things separately. 

#### `brew install truffle`
#### `brew install node`

Open up the project code in any editor, we use VSCode at B@B because it has LiveShare and its easy to use multiple terminals

#### `npm install`
#### `cd client`
#### `npm install`
#### `cd ..`

you should be in the project folder with everything installed. Now is where the fun starts! We will begin by working on smart contract functions.
Take some time to read through the smart contract and comments to understand what is going on. Comments marked TO DO are where you will write code. 
This is an ERC721 contract. You can look online for the ERC721 API, this just extends that API using OpenZepplins open source contracts. 

#### `truffle develop`
This will open up a local blockchain network on your localhost:8545. This is what you will use to build the app! Copy down the Address and Private keys
that this command spits out. **YOU WILL NEED THIS TO TEST THE FRONT END. PLS COPY AND PASTE IT SOMEWHERE!**

the command `test` will run through our test cases we set up for you and compile the contracts as you go. Since there is not much coding, you could try
implementing everything first, then debugging (not reccomended in a real project). 

once you are finished you can run `compile` and `migrate` to deploy to the network! This means 

## TASK1: Minting Tokens
### part A: Implementing Psuedorandom property assignment
oski wants the tags to be decided in the following manner: get the current block number, add it to the user's address and pass it through SHA256.
Then, pass the result through keccak256. finally, make sure that the result is a 256 bit unsigned integer. take this result and mod it by 10 to find the `_merchType`
and mod it by 5 to find the `_tag`

TIP: Anytime you hash something, you must wrap it in abi.encode(x); for example, if you want to hash the number 5 it should be hashfunction(abi.encode(5)).

### part B: Keeping Global State
The contract must know that a new token was minted. In the same function write one line of code that indicates to the contract that there is another NFT
to keep track of. Look at the top of the contract for help with this. 

## TASK2: Utility Functions and Debugging
### Part A: Change Price
At the bottom of the contract you will find functions which will be used by Web3.js on the front end to interact with the blockchain through this contract.
Complete the changePrice function by adding the following checks for security. First, `require` that the new price is non zero and that the token in question 
exists in the contract. This requires understanding of what TokenID is. next, `require` that the owner of the token is the one who is calling the function. Finally,
edit a global data structure to change the price of the token. 

### Part B: Deploy
once you are finished passing all tests, you can run `compile` and `migrate` to deploy to the network! This means you are done with the smart contract. An
immutable version of it now lives on the blockchain - In theory. Because this is local dev, we actually have to copy and paste something. 
Go into the `project/build/contracts` folder and find `MerchToken.json`. Copy and paste this into `client/src/contracts` which should currently be empty.

## TASK3: Web3.js Integration
cd into client and run `npm start` this should start up the website! create a NEW metamask account by importing one of the private keys you copied earlier.
this should allow you to interact with the smart contract you made. Use the console if there are errors, try to debug them if you can.
you can get to the console by right clicking -> inspect -> click the console tab. Best way is to stack overflow the errors. 

Now, read over the code in App.js and try to understand it. It is very messy web3 code, 
and for this iteration of the project we decided to not have you all implement it. Instead, please write a txt file named `Task3.txt`. 

1. How is web3 used in componentDidMount? How does the user connect to the blockchain network? This is metamask! 
2. pick one function: fetchLoot, addLoot, or buyLoot and explain in detail what it is doing and how it works. Every line please! 


