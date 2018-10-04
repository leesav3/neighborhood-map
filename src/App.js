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
      visible: false,
      infoWindow: null
    }
  }

  handleClick(event) {
    this.toggleMenu();
  }

  cleanUp(visible) {
    console.log("app cleanup");
    // if list is being closed, we want to reset map
    //console.log(visible);
    if (!visible) {
      if (this.state.infoWindow) {
        this.state.infoWindow.close();
      }

      this.refs.childList.initList();
    }

    
  }

  toggleMenu() {
    this.setState({visible: !this.state.visible}, () => {
      //console.log(this.state.visible); 
    });
    this.cleanUp(this.visible);
  }

  componentDidMount() {
    this.getRestaurants();
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA3TEO3u-tQkhwwKu8TyI-RsmlQ_JwQ2Ho&callback=initMap");
    window.initMap = this.initMap;
  }

  //closeInfoWindow() {
  //  this.infoWindow.close();
  //}

  //testFunc(info) {
  //  this.setState({infoWindow: info})
  //}

  initMap = () => {
    console.log("initmap");
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
      marker.addListener('click', () => {
        console.log("app marker listener");
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);

        this.setState({ infoWindow: infoWindow })

        //console.log(this.state.infoWindow);

        arrayMarkers.map(thisMarker => thisMarker.setAnimation(null))
        marker.setAnimation(window.google.maps.Animation.BOUNCE)  
      })

      // add listener to stop marker from bouncing when infowindow is closed
      infoWindow.addListener('closeclick', function() {
        console.log("app info window listener");
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
        <List ref="childList"
          menuVisibility={this.state.visible} 
          restaurants={this.state.restaurants} 
          markers={this.state.markers} 
          //closeInfoWindow={this.closeInfoWindow}
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
