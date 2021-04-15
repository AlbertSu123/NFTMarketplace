import React, { Component } from "react";
import MerchToken from "./contracts/MerchToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const ETH_TO_WEI = 1000000000000000000;

class App extends Component {
  state = {
    addDialogShown: false,
    available: [],
    owned: [],
    buying: null,
    web3: null,
    accounts: null,
    contract: null,
    initializing: true,
    loading: false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MerchToken.networks[networkId];
      const instance = new web3.eth.Contract(
        MerchToken.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      window.contract = instance;
      const tags = (await instance.methods.tags().call()).split(',');
      const merchTypes = (await instance.methods.merchTypes().call()).split(',');

      // const tags = await instance.methods.tags.call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, tags, merchTypes });
      await this.fetchLoot();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  fetchLoot = async () => {
    const { contract, accounts, tags, merchTypes } = this.state;
    this.setState({ initializing: true });

    const numTokens = await contract.methods.totalSupply().call();
    const available = [];
    const owned = [];
    for (let i = 0; i < numTokens; i++) {
      const tokenId = await contract.methods.tokenByIndex(i).call();
      const token = await contract.methods.getToken(tokenId).call();
      const owner = await contract.methods.ownerOf(tokenId).call();
      const deciphered = {
        id: tokenId,
        name: token._name,
        picture: token._picture,
        forSale: token._forSale,
        price: token._ints[0],
        tag: tags[token._ints[1]],
        type: merchTypes[token._ints[2]],
      }
      if (owner == accounts[0]) owned.push(deciphered);
      if (deciphered.forSale) available.push(deciphered);
    }
    this.setState({ initializing: false, available, owned });
  }

  addLoot = (ev) => {
    const { web3, accounts, contract } = this.state;

    ev.preventDefault();
    const name = document.getElementById('name').value;
    let price = web3.utils.toBN(document.getElementById('price').value*1000000000) // Eth to gwei
    price = price.mul(web3.utils.toBN('1000000000')); // Gwei to eth
    const picture = document.getElementById('picture').value;

    this.setState({ loading: true });
    contract.methods.mintToken(price, name, picture, "description", true)
      .send({ from: accounts[0] })
      .then(() => this.fetchLoot())
      .then(() => {
        this.setState({ addDialogShown: false });
      }, (err) => {
        console.error(err);
        alert('Creating the token faile!');
        this.setState({ addDialogShown: false });
      })
  }

  buyLoot = (ev) => {
    const { contract, accounts } = this.state;

    ev.preventDefault();
    this.setState({ loading: true });
    contract.methods.buyToken(this.state.buying.id).send(
      { from: accounts[0], value: this.state.buying.price }
    ).then(() => this.fetchLoot()).then(() => {
      this.setState({ buying: null });
    }, (err) => {
      console.error(err);
      alert('Creating the token faile!');
      this.setState({ buying: null });
    })
  }

  render() {
    /*if (!this.state.web3) {
      return <div className="info">Loading Web3, accounts, and contract...</div>;
    }*/
    return (
      <div className="App">
        <section className="header">
          <h1>Oski's Merch Perch</h1>
          <div className="stamp">OSKI APPROVED*</div>
        </section>
        <section className="buy">
          <h2>Big deals for only the biggest bears</h2>
          <div className="items">
            { this.state.initializing ? <span className="initing">Loading loot...</span> : 
            Array.from(Array(10), (_,i) => i).map(i => this.state.available[i] ? 
              <div key={i} className="card buyable" tabIndex="0" onClick={() => this.setState({ buying: this.state.available[i] })}>
              <div className="tag">{this.state.available[i].tag}</div>
              <div className="img" style={{backgroundImage: `url("${this.state.available[i].picture}")`}}></div>
              <span className="name">{this.state.available[i].name}</span>
              <span className="price">{this.state.available[i].price/ETH_TO_WEI} Eth</span>
            </div> : <div className="card"></div>
            )}
          </div>
          <button className="flip" onClick={() => this.setState({ addDialogShown: true })}>Get me in on this loot thing</button>
        </section>
        <section className="yours">
          <h2>Your un-bear-ably awesome loot</h2>
          { this.state.owned.map(item =>
              <div className="card" key={item.id}>
                <div className="tag">{item.tag}</div>
                <div className="img" style={{backgroundImage: `url("${item.picture}")`}}></div>
                <span className="name">{item.name}</span>
                <span className="price">{item.price/ETH_TO_WEI} Eth</span>
                { item.forSale && <div className="forSale">FOR SALE</div>}
              </div>
            )}
        </section>
        <section className="disclaimer">
          * Oksi bear shall not be held liable for any scams, false claims, or shady deals on this marketplace.
          This marketplace is not sponsored by or affiliated with the Cal university.
          Purchase at your own risk. There are no refunds.
        </section>

        { (this.state.addDialogShown || this.state.buying) && <div className="dialog-bg"></div> }
        { this.state.addDialogShown && (
          <form className="dialog" onSubmit={this.addLoot}>
            <h3>Describe your loot</h3>
            <p>
              <label htmlFor="name">Name</label>
              <input required id="name" />
            </p>
            <p>
              <label htmlFor="price">Price</label>
              <input required id="price" type="number" min="0.1" max="1000" step="0.1" />
            </p>
            <p>
              <label htmlFor="picture">Picture</label>
              <input required id="picture" />
              <span style={{marginLeft: '0.5rem'}}>or</span>
              <button className="inline" onClick={(e) => {e.preventDefault();document.getElementById('picture').value='https://news.berkeley.edu/wp-content/uploads/2016/09/Oskicupcake500-1.jpg'}}>Oski</button>
              <button className="inline" onClick={(e) => {e.preventDefault();document.getElementById('picture').value='https://upload.wikimedia.org/wikipedia/commons/4/4c/Handmade_teddy_bear.jpg'}}>Teddy</button>
            </p>
            <button type="submit">{!this.state.loading ? 'ADD!' : 'ADDING...'}</button>
          </form>
        )}
        { this.state.buying && (
          <form className="dialog" onSubmit={this.buyLoot}>
            <h3>Buy {this.state.buying.name}?</h3>
            <p>{this.state.buying.name} is: {this.state.buying.type}.</p>
            <p>
              The purchase will still cost you <b>{this.state.buying.price} Eth</b>. No returns!
            </p>
            <button type="submit">{!this.state.loading ? 'BUY IT!' : 'BUYING...'}</button>
          </form>
        )}
      </div>
    );
  }
}

export default App;
