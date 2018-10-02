import React, { Component } from 'react';
import './App.css';
import escapeRegExp from 'escape-string-regexp'

class List extends Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			query: '',
			filteredList: [],
			restaurants: this.props.restaurants
		}
	}	

	componentWillReceiveProps() {
		this.initList();
	}

	initList = () => {
		// put all restaurants in list to begin with
		this.setState({restaurants: this.props.restaurants});
	}
	

	updateQuery = (query) => {
		this.setState({ query: query });
		this.filterList(query);
	}

	filterList = (query) => {
		
		this.setState({ query: query })

		let allRestaurants = this.props.restaurants

		if ((query) && (query !== '')) {
			
			const match = new RegExp(escapeRegExp(query), 'i');
			this.filteredList = allRestaurants.filter((restaurant) => match.test(restaurant.restaurant.name))
			this.setState({restaurants: this.filteredList})
		} else {
			this.setState({restaurants: allRestaurants})
		}
	}

	render() {
		let visibility = "hide";
		let results;

		if (this.props.menuVisibility) {
			visibility = "show";
		}

		return (
			<div id="flyoutMenu" className={visibility}>
				<div onClick={this.props.handleClick}>
					<i className="fa fa-times"></i>
				</div>
				<div className="filter-bar">
					<input value={this.state.query} onChange={(event) => this.updateQuery(event.target.value)} type="text" placeholder="Filter by Name"/>
				</div>
				{
					this.state.restaurants.map(restaurant => (
						<div key={restaurant.restaurant.id}>
							<a>{restaurant.restaurant.name}</a>
							
						</div>
					))
				}
				
			</div>
				
		)
	}
	


}

export default List;