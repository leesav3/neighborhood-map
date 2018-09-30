import React, { Component } from 'react';
import './App.css';

class List extends Component {
	render() {
		let visibility = "hide";

		if (this.props.menuVisibility) {
			visibility = "show";
		}

		return (
			<div id="flyoutMenu" onClick={this.props.handleClick} className={visibility}>
				<h2>menu 1</h2>
				<h2>menu 2</h2>
				<h2>menu 3</h2>
				<h2>menu 4</h2>
			</div>
		)
	}

}

export default List;