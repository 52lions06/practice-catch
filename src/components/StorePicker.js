import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component{
  // constructor() {
  //   super();
  //   this.goToStore = this.goToStore.bing(this);
  // }

  goToStore(event){
    event.preventDefault();
    console.log('you changeed to URL')
    //first we are going to grab the text from the box
    const storeID = this.storeInput.value;
    console.log(`Going to ${storeID}`);
    //we are going to go to transition for the home to the store screen
    this.context.router.transitionTo(`/store/${storeID}`);
  };
  
  render(){ 
    return(
      <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
        <h2>Please enter Store Name</h2>
        <input type="text" placeholder="Store Name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input}}/>
        <button type="submit">Visit Store -></button>
      </form>
    );
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
};

export default StorePicker;