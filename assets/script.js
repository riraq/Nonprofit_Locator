var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-search"); //input box
var searchResultsEl = document.getElementById("searchResults")

var proxyUrl = "https://api.codetabs.com/v1/proxy?quest="

var storedSearches = JSON.parse(localStorage.getItem("searchHistory")); 

var orgArr = [];
var EINarr = [];
var organizations = [];
var finalOrganizations = [];

var priorSearch;

var finalIndex = storedSearches.length;
var priorCity = document.getElementById("prior");

//inital fetch function below

function getOrgs() {
  
  var searchInput = cityInput.value.toLowerCase();
  
  if (priorSearch !== searchInput) {
    organizations = [];
    finalOrganizations = [];
  }
  priorSearch = searchInput;

  var proPubUrl = "https://projects.propublica.org/nonprofits/api/v2/search.json?q=" + cityInput.value + "&ntee%5Bid%5D=3";
  //url format is [API base request URL] + [search text entered by user] + [NTEE code for animal and environment orgs]
  
  fetch(proxyUrl + proPubUrl)

  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    else {
      console.log(response)
      throw response;
    }
  })

  .then(function (data) {
    for (var i = 0; i < 5; i++) {
      EINarr.push(data.organizations[i].ein)
    }
  })

  .then(function () {
    for (var j = 0; j < EINarr.length; j++) {
      var searchByEIN = "https://projects.propublica.org/nonprofits/api/v2/organizations/" + EINarr[j] + ".json";
      fetch(proxyUrl + searchByEIN)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        else {
          throw response;
        }
      })

      .then(function (addressData) {
        var finalOrgObj = {
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: ""
        }

        finalOrgObj.name = addressData.organization.name;
        finalOrgObj.city = addressData.organization.city;
        finalOrgObj.state = addressData.organization.state;
        finalOrgObj.address = addressData.organization.address;
        finalOrgObj.zipCode = addressData.organization.zipcode;
        finalOrganizations.push(finalOrgObj);

        if (finalOrganizations.length === EINarr.length){
          for(var k=0; k<EINarr.length; k++){
            searchResultsEl.children[k].children[0].innerHTML = finalOrganizations[k].name
            searchResultsEl.children[k].children[1].innerHTML = finalOrganizations[k].address
            searchResultsEl.children[k].children[2].innerHTML = finalOrganizations[k].city
            searchResultsEl.children[k].children[3].innerHTML = finalOrganizations[k].state
            searchResultsEl.children[k].children[4].innerHTML = finalOrganizations[k].zipCode
          }
        }
      })
    }
  })

  
  .catch(function (error) {
    console.log("Unable to connect to ProPublica Non-Profit Explorer");
  });
};





// // access token for retrieving map
// mapboxgl.accessToken = 'pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg';

// // creates and styles map, sets location view to USA at an appropriate zoom level
// var map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v11',
//   center: [-95, 37],
//   zoom: 2,
// });

// // adds map controls
// map.addControl(new mapboxgl.NavigationControl());

// var geocoder = new MapboxGeocoder({ // Initialize the geocoder
//   accessToken: mapboxgl.accessToken, // Set the access token
//   mapboxgl: mapboxgl, // Set the mapbox-gl instance
//   marker: false, // Do not use the default marker style
// });

// var practiceData = []

// // fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg")
// // .then(function(response){
// //   console.log(response)
// //   return response.json()
// // })
// // .then(function(data){
// //   console.log(data)
// // })

// var geojson = {
//   type: "FeatureCollection",
//   features: [{
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [-77.032, 38.913]
//     },
//     properties: {
//       title: "Org Name",
//       description: "Org Address"
//     }
//   },
//   {
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [-120.414, 37.776]
//     },
//     properties: {
//       title: "Org Name",
//       description: "Org Address"
//     }
//   },
//   {
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [-122.414, 37.776]
//     },
//     properties: {
//       title: "Org Name",
//       description: "Org Address"
//     }
//   },
//   {
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [-118.414, 37.776]
//     },
//     properties: {
//       title: "Org Name",
//       description: "Org Address"
//     }
//   },
//   {
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [-116.414, 37.776]
//     },
//     properties: {
//       title: "Org Name",
//       description: "Org Address"
//     }
//   }]
  
// };

// geojson.features.forEach(function (marker) {

//   // create a HTML element for each feature
//   var el = document.createElement('div')
//   el.className = 'marker';

//   // make a marker for each feature and add to the map
//   new mapboxgl.Marker(el)
//     .setLngLat(marker.geometry.coordinates)
//     .addTo(map);

//   new mapboxgl.Marker(el)
//     .setLngLat(marker.geometry.coordinates)
//     .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
//       .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
//     .addTo(map);
// });

// // { type: "FeatureCollection", query: Array(2), features: Array(5), attribution: "NOTICE: © 2021 Mapbox and its suppliers. All right…y not be retained. POI(s) provided by Foursquare." }
// // attribution: "NOTICE: © 2021 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare."
// // features: Array(5)
// // 0:
// // bbox: (4)[-118.521456965901, 33.9018913203336, -118.121305008073, 34.161440999758]
// // center: Array(2)
// // 0: -118.2439
// // 1: 34.0544
// // length: 2
// // __proto__: Array(0)
// // context: (2)[{ … }, { … }]
// // geometry: { type: "Point", coordinates: Array(2) }
// // id: "place.7397503093427640"
// // place_name: "Los Angeles, California, United States"
// // place_type: ["place"]
// // properties: { wikidata: "Q65" }
// // relevance: 1
// // text: "Los Angeles"
// // type: "Feature"
// // __proto__: Object
// // 1: { id: "place.10952642230180310", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// // 2: { id: "poi.300647807514", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// // 3: { id: "locality.9858218050180310", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// // 4: { id: "neighborhood.2104633", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// // length: 5
// // __proto__: Array(0)
// // query: (2)["los", "angeles"]
// // type: "FeatureCollection"
// // __proto__: Object


function showLastSearch() {
    finalIndex = storedSearches.length;
    console.log("Search history length:" + finalIndex);
    console.log("Search history: " + storedSearches);
    console.log("Last searched: " + storedSearches[finalIndex - 1]);
    priorCity.textContent = storedSearches[finalIndex - 1];

}

function init() {
  showLastSearch();
}

function redoSearch() {
  cityInput.value = priorCity.textContent;
  console.log(priorCity.textContent);
  getOrgs();
}

init();

searchBtn.addEventListener("click", getOrgs);
priorCity.addEventListener("click", redoSearch);

searchBtn.onclick = function () {
  //input field is set to cityInput.value
  var search_query = cityInput.value;
  //array to hold search history
  //output beign over written bc of 62, edit 
  //was history becuase reffered to histry outside of scope (window history)
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory == null) { searchHistory = []} //initialization of empyt array BEFORE user interacts
  //["search_query0", "search_query1", "search_query2"]; //edit for JSO
  /// use array or object then decide how you will add items to the array or object
  //SHIFT adds to beg of array, push to end 
  //history[0] = search_query
  // alert("New search for storage? " + search_query + " for storage");
  // console.log(history);
  // console.log(typeof history);
  //cityInput is PUSHED to history array
  searchHistory.push(search_query);
  //history array is saved to loaclStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  return search_query

  
};

document.addEventListener('DOMContentLoaded', function () {

  // Modals

  var rootEl = document.documentElement;
  var allModals = getAll('.modal');
  var modalButtons = getAll('.modal-button');
  var modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

  if (modalButtons.length > 0) {
      modalButtons.forEach(function (el) {
          el.addEventListener('click', function () {
              var target = document.getElementById(el.dataset.target);
              rootEl.classList.add('is-clipped');
              target.classList.add('is-active');
          });
      });
  }

  if (modalCloses.length > 0) {
      modalCloses.forEach(function (el) {
          el.addEventListener('click', function () {
              closeModals();
          });
      });
  }

  document.addEventListener('keydown', function (event) {
      var e = event || window.event;
      if (e.keyCode === 27) {
          closeModals();
      }
  });

  function closeModals() {
      rootEl.classList.remove('is-clipped');
      allModals.forEach(function (el) {
          el.classList.remove('is-active');
      });
  }

  // Functions

  function getAll(selector) {
      return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }
});