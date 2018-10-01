import React, { Component } from 'react';
import Header from './Header';
import List from './List';
import TacoMap from './TacoMap';
import './App.css';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { visible: false };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.toggleMenu();
    console.log("clicked");
    event.stopPropagation();
  }

  toggleMenu() {
    this.setState({visible: !this.state.visible});
  }

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

      // create an infowindow
    const infoWindow = new window.google.maps.InfoWindow();

      this.state.restaurants.map(thisRestaurant => {
        const contentString = `${thisRestaurant.restaurant.name + " " + thisRestaurant.restaurant.location.address}`;

        // create a marker
        const marker = new window.google.maps.Marker({
          position: {lat: Number(thisRestaurant.restaurant.location.latitude), lng: Number(thisRestaurant.restaurant.location.longitude)},
          map: map,
          title: thisRestaurant.restaurant.name
        });

        

        // add listener to hook marker to infowindow
        marker.addListener('click', function() {

          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        })
          
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
          console.log(json.restaurants);
          console.log(json.restaurants[0].restaurant.location.latitude);
          this.setState({
            restaurants: json.restaurants
          }, this.loadMap())
        }).catch(error => {
        console.log("Error: " + error);
      })
    }

  
  

  render() {
    return (
      <main>
        <Header handleClick={this.handleClick} />
        <List handleClick={this.handleClick} menuVisibility={this.state.visible} />    
        <TacoMap />
      </main>
    );
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

export default App;
