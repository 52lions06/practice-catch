import React from 'react';
import AddFishForm from './AddFishForm'
import base from '../base'

class Inventory extends React.Component {
  constructor(){
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.state = {
      uid: null, 
      owner: null
    }
  }
 
  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, {user});
    }
  })
  }

  handleOnChange(e, key){
  const fish = this.props.fishes[key];
  // need to take a copy of the fish and update it with the new data
  const updatedFish = {
    ...fish,
    [e.target.name]: e.target.value
   }
  // console.log(fish);
  // console.log(e.target.name, e.target.value) //helps to find what we are updating
  // console.log(updatedFish)
  this.props.updateFish(key, updatedFish); 
  }

  renderInventory(key){
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleOnChange(e, key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleOnChange(e, key)}/>
        
        <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleOnChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleOnChange(e, key)}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleOnChange(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
      </nav>
    )
  }

  authenticate(provider) {
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({ uid: null })
  }

  authHandler(err, authData){
    console.log(authData);
    if(err){
      console.log(err);
      return;
    }

    //grab the store info
    const storeRef = base.database().ref(this.props.storeID);

    //query the firebase once for the store data---[snapshot is firebases object of the data]
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {}

      //claim it as our own if there is no owner already
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid 
        })
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  }

  render(){

    const logout = <button onClick={this.logout}>Log Out!</button>
    //checks to see if anyone is logged in
    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }
    //checks to see if the person is the owner of the store
    if(this.state.uid !== this.state.owner) {
      return(
        <div>
          <p>Sorry, you are not the owner of the store</p>
          {logout}
        </div>
      )
    }

    return (
        <div>
          <h2>Inventory</h2>
          {logout}
          {Object.keys(this.props.fishes).map(this.renderInventory)}
          <AddFishForm addFish={this.props.addFish}/>
          <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        </div>
    )
  }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired
}
export default Inventory;