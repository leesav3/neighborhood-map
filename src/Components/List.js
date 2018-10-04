import React, { Component } from 'react';
import '../App.css';
import escapeRegExp from 'escape-string-regexp'

class List extends Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			query: '',
			restaurants: this.props.restaurants,
			markers: this.props.markers,
			filteredList: [],
			filteredMarkers: []
		}
	}	

	componentWillReceiveProps() {
		//this.initList();
	}

	//isInfoWindowOpen(infoWindow) {
	//	let map = infoWindow.getMap();
	//	return (map !== null && typeof map !== "undefined");
	//}

	// put all restaurants in list to begin with and clean up any filters, animations from previous
	// opening and closing of slider list
	initList = () => {
		console.log("list: initlist");
		// closing info window, do cleanup
		console.log(this.props.visibility)
		if (!this.props.visibililty) {
			this.setState({restaurants: this.props.restaurants});

			this.setState({ query: '' }); 
			document.getElementById("inputFilter").value = "";
			this.props.markers.forEach(marker => {
			marker.setVisible(true);
			marker.setAnimation(null);
		})
	}
		
		
	}
	

	// function to update query state. runs each time text is inputted
	updateQuery = (query) => {
		console.log("list: update query");
		this.setState({ query: query });
		this.filterList(query);
	}

	// function to filter restaurant list. runs each time text is inputted
	filterList = (query) => {
		console.log("list: filterlist");
		
		this.setState({ query: query })

		let allRestaurants = this.props.restaurants
		let allMarkers = this.props.markers

		if ((query) && (query !== '')) {
			const match = new RegExp(escapeRegExp(query), 'i');
			this.filteredList = allRestaurants.filter((restaurant) => match.test(restaurant.restaurant.name))
			this.setState({restaurants: this.filteredList})
			this.filteredMarkers = allMarkers.filter((marker) => match.test(marker.title))

			// first set all markers invisible
			allMarkers.map(marker => (
				marker.setVisible(false)
			))

			// now make each filtered marker visible
			this.filteredMarkers.map(marker => (
				marker.setVisible(true)
			))
		} else {
			this.setState({restaurants: allRestaurants})
			allMarkers.map(marker => (
				marker.setVisible(true)
			))

		}
	}

	showInfoWindow = (id) => {
		console.log("list: showinfowindow");
		this.props.markers.forEach(marker => {
			if (marker.id === id) {
				window.google.maps.event.trigger( marker, 'click' )
			}
		})	
	}

	render() {
		let visibility = "hide";

		if (this.props.menuVisibility) {
			visibility = "show";
		}

		console.log(this.props.menuVisibility);

		return (
			<div id="flyoutMenu" className={visibility}>
				<div className="filter-bar">
					<input id="inputFilter" value={this.state.query} onChange={(event) => this.updateQuery(event.target.value)} type="text" placeholder="Filter by Name"/>
				</div>
				<ul>
				{
					this.state.restaurants.map(restaurant => (
						<li 
							key={restaurant.restaurant.id} 
							value={restaurant.restaurant.id} 
							onClick={() => {this.showInfoWindow(restaurant.restaurant.id)}}>
							{restaurant.restaurant.name}

						</li>
					))
				}
				</ul>
			</div>
				
		)
	}
}

export default List;