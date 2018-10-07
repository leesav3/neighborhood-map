import React, { Component } from 'react';
import '../App.css';

class TacoMap extends Component {

	render() {
		console.log(this.props.error);
		return (
			!this.props.error ? (
				<div id="map"></div>
			) : (
				<div>Error loading map. Please try again later.</div>
			)
		)
	}
}

export default TacoMap;