import React, { Component } from 'react';
import '../App.css';

class Header extends Component {

	

	render() {

		return (
			<div className='app-title'>
          		<h1>Taco Finder</h1>
          		<i id="header-icon" aria-label="open close menu" className="fas fa-bars" onClick={this.props.handleClick} tabindex="0" onKeyPress={(event) => {if (event.key === 'Enter') {this.props.handleClick(event)}}}></i>
        	</div>
		)
	}
}

export default Header;