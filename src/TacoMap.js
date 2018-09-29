import React, { Component } from 'react';
import './App.css';

class TacoMap extends Component {

	componentDidMount() {
		this.getVenues();
    	this.loadMap();
    }

  	loadMap = () => {
    	loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA3TEO3u-tQkhwwKu8TyI-RsmlQ_JwQ2Ho&callback=initMap");
    	window.initMap = this.initMap;
  	}
  
  	initMap = () => {
    	const map = new window.google.maps.Map(document.getElementById('map'), {
      		center: {lat: 35.7796, lng: -78.6382},
      		zoom: 8
    	});
  	}

  	getVenues = () => {
  		const apiURL = "https://developers.zomato.com/api/v2.1/search?entity_id=898&entity_type=city&count=10&cuisines=73&sort=rating";
  		let venues = [];
  		fetch(apiURL, {
  			method: "GET",
  			headers: new Headers ({
  				'Content-Type' : 'application/json', 
  				'user-key' : '75a828f3ff19fe64e68d40e776fd3da8'
  			})
  		}).then(response => {
  			return response.json()
  			}).then(json => {
  				let venues = json.restaurants;
  				console.log(json);
  				console.log(venues[0].restaurant.name);
  			}).catch(error => {
  			console.log("Error: " + error);
  		})
  	}

	render() {
		return (
			<div id="map"></div>
		)
	}
}

function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}




export default TacoMap;