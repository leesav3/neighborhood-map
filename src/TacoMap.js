import React, { Component } from 'react';
import './App.css';

class TacoMap extends Component {

	state = {
		restaurants: []
	}

	componentDidMount() {
		this.getVenues();
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

    	this.state.restaurants.map(thisRestaurant => {
    		const marker = new window.google.maps.Marker({
	    		position: {lat: Number(thisRestaurant.restaurant.location.latitude), lng: Number(thisRestaurant.restaurant.location.longitude)},
	    		map: map,
	    		title: thisRestaurant.restaurant.name
	    	});
    	})
  	}

  	getVenues = () => {
  		const apiURL = "https://developers.zomato.com/api/v2.1/search?entity_id=898&entity_type=city&count=10&cuisines=73&sort=rating";
  		fetch(apiURL, {
  			method: "GET",
  			headers: new Headers ({
  				'Content-Type' : 'application/json', 
  				'user-key' : '75a828f3ff19fe64e68d40e776fd3da8'
  			})
  		}).then(response => {
  			return response.json()
  			
  			}).then(json => {
  				//let restaurants = json.restaurants;
  				console.log(json.restaurants);
  				console.log(json.restaurants[0].restaurant.location.latitude);
  				this.setState({
  					restaurants: json.restaurants
  				}, this.loadMap())
  				//console.log(restaurants[0].restaurant.name);
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