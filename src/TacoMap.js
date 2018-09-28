import React, { Component } from 'react';
import './App.css';

class TacoMap extends Component {

	componentDidMount() {
    	this.loadMap();
  		}

  	loadMap = () => {
    	loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA3TEO3u-tQkhwwKu8TyI-RsmlQ_JwQ2Ho&callback=initMap");
    	window.initMap = this.initMap;
  	}
  
  	initMap = () => {
    	const map = new window.google.maps.Map(document.getElementById('map'), {
      		//center: {lat: -34.397, lng: 150.644},
      		center: {lat: 35.7796, lng: -78.6382},
      		zoom: 8
    	});
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