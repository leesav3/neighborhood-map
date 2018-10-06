import React, { Component } from 'react';
import '../App.css';


class List extends Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			restaurants: this.props.restaurants,
			markers: this.props.markers
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
		console.log("render list " + this.props.menuVisibility);
		const restaurantList = this.props.restaurants;
	
		let visibility = "hide";

		if (this.props.menuVisibility) {
			visibility = "show";
		}

		return (
			<div id="flyoutMenu" className={visibility}>
				<div className="filter-bar">
					<input id="inputFilter" aria-label="filter by restaurant name" value={this.props.query} onChange={(event) => this.props.updateQuery(event.target.value)} type="text" placeholder="Filter by Name"/>
				</div>
				<ul>
				{
					restaurantList.map(restaurant => (
						<li 
							aria-label={restaurant.restaurant.name + "details"}
							tabindex="0"
							key={restaurant.restaurant.id} 
							value={restaurant.restaurant.id} 
							onKeyPress={(event) => {if (event.key === 'Enter') {this.showInfoWindow(restaurant.restaurant.id)}}}
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