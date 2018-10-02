import React, { Component } from 'react';
import './App.css';

class Header extends Component {
	render() {
		return (
			<div className='app-title'>
				<i className="fas fa-bars" onClick={this.props.handleClick}></i>
          		<h1>Taco Finder</h1>
        	</div>
		)
	}
}

export default Header;