import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header';
import List from './Components/List';
import TacoMap from './Components/TacoMap';


class App extends Component {
  
  constructor(props, context) {
    super(props, context);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      restaurants: [],
      markers: [],
      visible: false
    }
  }

  handleClick(event) {
    this.toggleMenu();
  }

  toggleMenu() {
    this.setState({visible: !this.state.visible});
  }

  componentDidMount() {
    this.getRestaurants();
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA3TEO3u-tQkhwwKu8TyI-RsmlQ_JwQ2Ho&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    let arrayMarkers = this.state.markers;

    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.7796, lng: -78.6382},
        zoom: 9
    });

    // create an infowindow
    const infoWindow = new window.google.maps.InfoWindow();

    this.state.restaurants.forEach(thisRestaurant => {
      const contentString = `${thisRestaurant.restaurant.name + " " + thisRestaurant.restaurant.location.address}`;

      // create a marker
      let marker = new window.google.maps.Marker({
        position: {lat: Number(thisRestaurant.restaurant.location.latitude), lng: Number(thisRestaurant.restaurant.location.longitude)},
        map: map,
        title: thisRestaurant.restaurant.name,
        animation: window.google.maps.Animation.DROP,
        id: thisRestaurant.restaurant.id
      });


      // push marker into array
      arrayMarkers.push(marker)


      // add listener to hook marker to infowindow
      marker.addListener('click', function() {
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);

        arrayMarkers.map(thisMarker => thisMarker.setAnimation(null))
        marker.setAnimation(window.google.maps.Animation.BOUNCE)  
      })

      // add listener to stop marker from bouncing when infowindow is closed
      infoWindow.addListener('closeclick', function() {
        arrayMarkers.map(thisMarker => thisMarker.setAnimation(null))
      }) 
    })
  }



  // access zomato api and get data
  getRestaurants = () => {
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
        this.setState({
          restaurants: json.restaurants
        }, this.loadMap())
    }).catch(error => {
      console.log("Error: " + error);
      alert("Error loading restaurants");
    })
  }

  render() {
    return (
      <main>
        <Header handleClick={this.handleClick} />
        <List 
          handleClick={this.handleClick} 
          menuVisibility={this.state.visible} 
          restaurants={this.state.restaurants} 
          markers={this.state.markers} 
        />    
        <TacoMap />
      </main>
    );
  }
}

// loads map in react
function loadScript(url, state) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  script.onerror = function() {
    alert("Error loading map");
  }
  index.parentNode.insertBefore(script, index)
}

export default App;
