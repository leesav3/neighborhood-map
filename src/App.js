import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import './App.css';

import Header from './Components/Header';
import List from './Components/List';
import TacoMap from './Components/TacoMap';


class App extends Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      filteredRestaurants: [],
      allRestaurants: [],
      markers: [],
      visible: false,
      query: '',
      infoWindow: null
    }

    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

    let allRestaurants = this.state.allRestaurants
    let allMarkers = this.state.markers

    if ((query) && (query !== '')) {
      const match = new RegExp(escapeRegExp(query), 'i');
      this.filteredList = allRestaurants.filter((restaurant) => match.test(restaurant.restaurant.name))
      this.setState({filteredRestaurants: this.filteredList})
      this.filteredMarkers = allMarkers.filter((marker) => match.test(marker.title))

      // first set all markers invisible
      allMarkers.map(marker => (
        marker.setVisible(false)
      ))

      // now make each filtered marker visible
      this.filteredMarkers.map(marker => (
        marker.setVisible(true)
      ))

      // if query is being changed, close any open infowindows
      if (this.state.infoWindow) {
        this.state.infoWindow.close();
      }

      // stop any animation as query is being entered
      this.state.markers.forEach(marker => {
        marker.setAnimation(null);
      })

    } else {
      this.setState({filteredRestaurants: allRestaurants})
      allMarkers.map(marker => (
        marker.setVisible(true)
      ))

      // if query is being changed, close any open infowindows
      if (this.state.infoWindow) {
        this.state.infoWindow.close();
      }

      // stop any animation as query is being entered
      this.state.markers.forEach(marker => {
        marker.setAnimation(null);
      })

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

      this.setState({ query: '' }); 
      document.getElementById("inputFilter").value = "";
      this.state.markers.forEach(marker => {
        marker.setVisible(true);
        marker.setAnimation(null);
      })

      this.setState({filteredRestaurants: this.state.allRestaurants});
    }
    
  }

  toggleMenu() {
    this.setState({visible: !this.state.visible}, () => {
      console.log(this.state.visible); 
    });
    this.cleanUp(this.visible);
  }

  componentDidMount() {
    this.getRestaurants();
    console.log(this.state.restaurants);
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA3TEO3u-tQkhwwKu8TyI-RsmlQ_JwQ2Ho&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    console.log("initmap");
    let arrayMarkers = this.state.markers;

    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.7796, lng: -78.6382},
        zoom: 9
    });

    // create an infowindow
    const infoWindow = new window.google.maps.InfoWindow();
    console.log(this.state.restaurants);

    // fill state arrays with restaurants
    this.setState({filteredRestaurants : this.state.restaurants})
    this.setState({allRestaurants : this.state.restaurants})
    

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
        <Header handleClick={this.handleClick}/>
        <List 
          menuVisibility={this.state.visible} 
          restaurants={this.state.filteredRestaurants} 
          markers={this.state.markers} 
          query={this.state.query}
          updateQuery={this.updateQuery} 
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
