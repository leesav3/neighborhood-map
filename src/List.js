import React, { Component } from 'react';
import './App.css';

class List extends Component {

	state = {
		query: ''
	}
	render() {
		let visibility = "hide";

		if (this.props.menuVisibility) {
			visibility = "show";
		}

		return (
			<div id="flyoutMenu" onClick={this.props.handleClick} className={visibility}>
				{this.props.restaurants && (
					this.props.restaurants.map(restaurant => (
					<div key={restaurant.restaurant.id}>
						<a>{restaurant.restaurant.name}</a>
					</div>
				)))}
			</div>
		)
	}

}

export default List;