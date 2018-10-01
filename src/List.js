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
	

	updateQuery = (query) => {
		this.setState({ query: query })
		this.filterList(query);
	}

	filterList = (query) => {
		this.setState({ query })

		let allRestaurants = this.props.restaurants

		if ((this.state.query) && (this.state.query !== '')) {
			console.log(query);

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

		{ console.log(this.filteredList) }


		if (this.filteredList && this.props.restaurants) {
			console.log("here!");
			results = (
				this.filteredList.map(list => {
					this.props.restaurants.map(restaurant => restaurant.restaurant.id === list.restaurant.id);
					return(
						<div key={list.restaurant.id}>
							<a>{list.restaurant.name}</a>
						</div>
					)
				})
			)
		} else {
			console.log("in else");
			results = this.props.restaurants && (
				this.props.restaurants.map(restaurant => (
				<div key={restaurant.restaurant.id}>
					<a>{restaurant.restaurant.name}</a>
				</div>
			)))
			
		}

		return (
			<div id="flyoutMenu" className={visibility}>
				<div onClick={this.props.handleClick}>
					<i className="fa fa-times"></i>
				</div>
				<div className="filter-bar">
					<input value={this.state.query} onChange={(event) => this.updateQuery(event.target.value)} type="text" placeholder="Filter by Name"/>
				</div>
				<div>{results}</div>
			</div>
				
		)
	}
	
	

}

export default List;