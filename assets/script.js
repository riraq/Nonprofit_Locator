var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-search");

//inital fetch function below

function getOrgs(searchedCity) {
    var proPubUrl = "https://projects.propublica.org/nonprofits/api/v2/search.json?q=" + cityInput.value + "&ntee%5Bid%5D=3";
    //url format is [API base request URL] + [search text entered by user] + [NTEE code for animal and environment orgs]
    //variable names subject to change

    fetch(proPubUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                .then(function (data) {
                    console.log("City searched: " + searchedCity);
                    console.log(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to ProPublica NonProfit Explorer");
        });
};

// function to save prior searches

// function recordSearch() {
//     var input = $("#search").val();
//     var searches = getSearches();
//     searches.push({initials: inputInitials, score: currentScore});
//     searches = searches.sort(function (item, other) {
//         return parseInt(other.search) - parseInt(item.search)        
//     });
//     searches = topScores.slice(0, 5);
//     localStorage.searches = JSON.stringify(searches); //get this object and transform it into a string that looks like json
//     $("#").hide();
//     renderTopScores();
// }
// function recordScore() {
//     var inputInitials = $("#initials").val();
//     var topScores = getTopScores();
//     topScores.push({initials: inputInitials, score: currentScore});
//     topScores = topScores.sort(function (item, other) {
//         return parseInt(other.score) - parseInt(item.score)        
//     });
//     topScores = topScores.slice(0, 5);
//     localStorage.topScores = JSON.stringify(topScores); //get this object and transform it into a string that looks like json
//     $("#scorePrompt").hide();
//     renderTopScores();
// }
searchBtn.addEventListener("click", getOrgs);