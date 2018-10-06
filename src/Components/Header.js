import React, { Component } from 'react';
import '../App.css';

class Header extends Component {
	render() {

		return (
			<div className='app-title'>
          		<h1>Taco Finder</h1>
          		<i id="header-icon" className="fas fa-bars" onClick={this.props.handleClick}></i>
        	</div>
		)
	}
}

export default Header;