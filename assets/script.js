var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-search"); //input box
var searchResultsEl = document.getElementById("searchResults")
var showList = document.getElementById("showList");
var showMap = document.getElementById("showMap");
var mapEl = document.getElementById("map");
var listEl = document.getElementsByClassName("list")
var modalEl = document.getElementsByClassName("modal");
var realModal = modalEl[0];

var proxyUrl = "https://api.codetabs.com/v1/proxy?quest="

var storedSearches = JSON.parse(localStorage.getItem("searchHistory")); 

var orgArr = [];
var EINarr = [];
var organizations = [];
var finalOrganizations = [];

var priorSearch;

var priorCity = document.getElementById("prior");

function modal() {
  modalEl[0].classList.add("is-active");
}

//inital fetch function below

function getOrgs() {
  
  searchResultsEl.style.backgroundColor = "rgb(9, 131, 84)"
  searchBtn.textContent = "Clear Results"
  showList.style.display = ""
  showMap.style.display = ""
  
  var searchInput = cityInput.value.toLowerCase();
  
  if (priorSearch !== searchInput) {
    finalOrganizations = [];
    EINarr = [];
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
      modal();
      // // var modal = "#modal"
      // var modal = document.getElementById("modal");
      // function modal() {
      //   modal.classList.add("is-active")
      // }
      //var message is-warning = document.getElementsByClassName(".message is-warning");
      //var dltbtn = document.getElementsByClassName("dltbtn");
      // throw response;
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
            geojson.features[k].properties.title = finalOrganizations[k].name            
            searchResultsEl.children[k].children[1].innerHTML = finalOrganizations[k].address
            geojson.features[k].properties.description = finalOrganizations[k].address
            searchResultsEl.children[k].children[2].innerHTML = finalOrganizations[k].city
            searchResultsEl.children[k].children[3].innerHTML = finalOrganizations[k].state
            searchResultsEl.children[k].children[4].innerHTML = finalOrganizations[k].zipCode
            searchResultsEl.children[k].classList.remove("hidden");
          }

        }
      })
    }
  })

  .catch(function (error) {
    modal();

  });
};

// clears search results
function clearResults(){
  cityInput.value = ""
  orgArr = [];
  EINarr = [];
  organizations = [];
  finalOrganizations = [];
  mapEl.textContent = ""
  showList.style.display = "none"
  showMap.style.display = "none"
  searchResultsEl.removeAttribute("style");
  showList.disabled = true;
  showMap.disabled = false;
  mapEl.style.display = "none"
  searchBtn.textContent = "Search"
  for(var q=0; q<5; q++){
    geojson.features[q].geometry.coordinates = []
    searchResultsEl.children[q].classList.add("hidden")
  }
  for(var p=0; p<25; p++){
    listEl[p].textContent = ""
  }
}


// switches to list display for results
showList.addEventListener("click", function(){
  searchResultsEl.removeAttribute("style");
  searchResultsEl.style.backgroundColor = "rgb(9, 131, 84)"
  showList.disabled = true;
  showMap.disabled = false;
  mapEl.style.display = "none"
})

var coordinatesArr = []

// switches to map display for search results
showMap.addEventListener("click", function () {

  if(showList.disabled === false){
    mapEl.style.display = ""
    return
  }

  showMap.disabled = true;
  showList.disabled = false;
  searchResultsEl.style.display = "none"
  mapEl.style.display = ""

  for(var q=0; q<5; q++){
    geojson.features[q].geometry.coordinates = []
  }

  // access token for retrieving map
  mapboxgl.accessToken = 'pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg';

  // creates and styles map, sets location view to USA at an appropriate zoom level
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-95, 37],
    zoom: 2,
  });
  // adds map controls
  map.addControl(new mapboxgl.NavigationControl());

  var urlMap1 = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
  var urlMap2 = ".json?access_token=pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg"

  var citySearch = finalOrganizations[0].city
  var stateSearch = finalOrganizations[0].state
    fetch(urlMap1 + geojson.features[0].properties.description.split("PO BOX")+ geojson.features[0].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (data) {
        geojson.features[0].geometry.coordinates.push(data.features[0].center[0]);
        geojson.features[0].geometry.coordinates.push(data.features[0].center[1]);
        map.transform.center.lng = geojson.features[0].geometry.coordinates[0];
        map.transform.center.lat = geojson.features[0].geometry.coordinates[1];
        map.transform.zoom = 8;
      })
      
      fetch(urlMap1 + geojson.features[1].properties.description.split("PO BOX")+ geojson.features[1].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (data) {
        geojson.features[1].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[1].geometry.coordinates.push(data.features[0].center[1])
      })
      
      fetch(urlMap1 + geojson.features[2].properties.description.split("PO BOX")+ geojson.features[2].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (data) {
        geojson.features[2].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[2].geometry.coordinates.push(data.features[0].center[1])
      })
      
      fetch(urlMap1 + geojson.features[3].properties.description.split("PO BOX")+ geojson.features[3].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (data) {
        geojson.features[3].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[3].geometry.coordinates.push(data.features[0].center[1])
      })

      fetch(urlMap1 + geojson.features[4].properties.description.split("PO BOX")+ geojson.features[4].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (data) {
        geojson.features[4].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[4].geometry.coordinates.push(data.features[0].center[1])
      })

      .then(
        map.on('load', function (e) {
          /* Add the data to your map as a layer */
          geojson.features.forEach(function(marker) {

            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';
          
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates)
              .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
              .addTo(map);
          });
        }),
      )
})


var geojson = {
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  }]
};


function showLastSearch() {
    var finalIndex;
    if(storedSearches !== null ) {
    finalIndex = storedSearches.length;
    priorCity.textContent = storedSearches[finalIndex - 1];
  }
    else return;
}

function init() {
  showLastSearch();
}

function redoSearch(event) {
  event.preventDefault()
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  cityInput.value = capitalizeFirstLetter(priorCity.textContent);
  getOrgs();
}

init();

searchBtn.addEventListener("click", function(){
  if(searchBtn.textContent === "Search"){
    getOrgs()
  }
  else {
    clearResults()
  }
});
priorCity.addEventListener("click", redoSearch);

searchBtn.onclick = function () {
  //input field is set to cityInput.value
  var search_query = cityInput.value;
  //array to hold search history
  //output beign over written bc of 62, edit 
  //was history becuase reffered to histry outside of scope (window history)
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory == null) { searchHistory = []} //initialization of empyt array BEFORE user interacts
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
})