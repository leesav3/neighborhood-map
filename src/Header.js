import React, { Component } from 'react';
import './App.css';

class Header extends Component {
	render() {
		return (
			<header className='app-title'>
          		<button onClick={this.props.handleClick}>click me</button>
          		<h1>Taco Finder</h1>
        	</header>
		)
	}

}

export default Header;