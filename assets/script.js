

//inital fetch function below

function getOrgs(searchedCity) {
    var proPubUrl = "https://projects.propublica.org/nonprofits/api/v2/search.json?q=" + searchedCity + "&ntee%5Bid%5D=3";
    //url format is [API base request URL] + [search text entered by user] + [NTEE code for animal and environment orgs]
    //variable names subject to change

    fetch(areaOrgs)
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