import React, { Component } from 'react';
import Header from './Header';
import List from './List';
import TacoMap from './TacoMap';
import './App.css';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { visible: false };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.toggleMenu();
    console.log("clicked");
    event.stopPropagation();
  }

  toggleMenu() {
    this.setState({visible: !this.state.visible});
  }

  
  

  render() {
    return (
      <main>
        <Header handleClick={this.handleClick} />
        <List handleClick={this.handleClick} menuVisibility={this.state.visible} />    
        <TacoMap />
      </main>
    );
  }

  
}

export default App;
