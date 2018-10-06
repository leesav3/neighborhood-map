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
      restaurants: [],
      markers: [],
      visible: false,
      query: '',
      width: window.innerWidth
    }

    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentDidMount() {
    this.getRestaurants();

    this.setState({width: window.innerWidth}, () => {
      if (this.state.width > 901) {
        this.setState({visible : true}, () => {
          console.log(this.state.visible);
        })
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    console.log("handle size change");
    this.setState({width: window.innerWidth}, () => {
      if (this.state.width > 901) {
        //let center = new window.google.maps.LatLng(35.7796, -78.6382)
        this.setState({visible : true}, () => {
          console.log(this.state.visible);
        })
      } else {
        //let center = new window.google.maps.LatLng(35.7796, -78.6382)
        this.setState({visible : false}, () => {
          console.log(this.state.visible);
        })
      }
    });
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

    let allMarkers = this.state.markers

    if ((query) && (query !== '')) {
      const match = new RegExp(escapeRegExp(query), 'i');

      this.filteredList = this.state.restaurants.filter((restaurant) => match.test(restaurant.restaurant.name))

      this.setState({restaurants: this.filteredList})

      this.filteredMarkers = allMarkers.filter((marker) => match.test(marker.title))

      // Clean up map!
      // first set all markers invisible
      allMarkers.map(marker => (
        marker.setVisible(false)
      ))

      // now make each filtered marker visible
      this.filteredMarkers.map(marker => (
        marker.setVisible(true)
      ))

      // if query is being changed, close any open infowindows
      if (this.infoWindow) {
        this.infoWindow.close();
      }

      // stop any animation as query is being entered
      this.state.markers.forEach(marker => {
        marker.setAnimation(null);
      })

    } else {
      // if there is no query, display default 10 restaurants
      // reset map (close infowindows and animations)
      this.setState({restaurants: this.allRestaurants})
      allMarkers.map(marker => (
        marker.setVisible(true)
      ))

      // if query is being changed, close any open infowindows
      if (this.infoWindow) {
        this.infoWindow.close();
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
    if (!visible) {
      if (this.infoWindow) {
        this.infoWindow.close();
      }

      this.setState({ query: '' }); 
      document.getElementById("inputFilter").value = "";
      this.state.markers.forEach(marker => {
        marker.setVisible(true);
        marker.setAnimation(null);
      })

      this.setState({restaurants: this.allRestaurants});
    } 
    
  }

  toggleMenu() {
    this.setState({visible: !this.state.visible}, () => {
      console.log(this.state.visible); 
    });
    this.cleanUp(this.visible);
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA3TEO3u-tQkhwwKu8TyI-RsmlQ_JwQ2Ho&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    console.log("initmap");
    let arrayMarkers = this.state.markers;

    this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.7796, lng: -78.6382},
        zoom: 9,
        draggable: false
    });


    // create an infowindow
    this.infoWindow = new window.google.maps.InfoWindow();

    // set variable for all restaurants before filtering
    this.allRestaurants = this.state.restaurants;

    this.state.restaurants.forEach(thisRestaurant => {
      const contentString = `<div><h3>${thisRestaurant.restaurant.name}</h2><p>${thisRestaurant.restaurant.location.address}</p><a href=${thisRestaurant.restaurant.photos_url} target="_blank">View Photos and Reviews</a><p><div id="star-container"><div id="star"><div id="star-text">${thisRestaurant.restaurant.user_rating.aggregate_rating}</div></div></div></div>`
      // create a marker
      let marker = new window.google.maps.Marker({
        position: {lat: Number(thisRestaurant.restaurant.location.latitude), lng: Number(thisRestaurant.restaurant.location.longitude)},
        map: this.map,
        title: thisRestaurant.restaurant.name,
        animation: window.google.maps.Animation.DROP,
        id: thisRestaurant.restaurant.id
      });


      // push marker into array
      arrayMarkers.push(marker)


      // add listener to hook marker to infowindow
      marker.addListener('click', () => {
        this.infoWindow.setContent(contentString);
        this.infoWindow.open(this.map, marker);

        arrayMarkers.map(thisMarker => thisMarker.setAnimation(null))
        marker.setAnimation(window.google.maps.Animation.BOUNCE)  
      })

      // add listener to stop marker from bouncing when infowindow is closed
      this.infoWindow.addListener('closeclick', function() {
        arrayMarkers.map(thisMarker => thisMarker.setAnimation(null))
      }) 
console.log(this.state.visible)
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
          restaurants={this.state.restaurants} 
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
