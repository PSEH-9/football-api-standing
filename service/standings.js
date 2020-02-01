const https = require('https');
const request = require('request');

// API Football Configuration
const HOST_URL = "https://apiv2.apifootball.com"
const API_KEY = "9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978"
const ACTION = {
    "LEAGUES": "get_leagues",
    "COUNTRIES": "get_countries",
    "STANDINGS": "get_standings"
}

async function getLeagues(league_name, country_id){
    // Get league id by leauge name and country id

    let url = `${HOST_URL}/?action=${ACTION.LEAGUES}&country_id=${country_id}&APIkey=${API_KEY}`
    return new Promise((resolve, reject) => {
        let r = https.get(url, (res) => {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                let reponse = JSON.parse(data);
                reponse.forEach(league => {
                    if (league.league_name === league_name) {
                        resolve(league.league_id)
                    }
                });
                reject("Invalid league name")
            });
        })
    })
    return true
}

async function getCountries(country_name){
    // Get country id by country name

    let url = `${HOST_URL}/?action=${ACTION.COUNTRIES}&APIkey=${API_KEY}`
    return new Promise((resolve, reject) => {
        let r = https.get(url, (res) => {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                country_reponse = JSON.parse(data);
                country_reponse.forEach(countries => {
                    if (countries.country_name === country_name) {
                        resolve(countries.country_id)
                        }
                    });
                reject("Invalid country name")
            });
        })
    });
}

async function findStanding(league_id, team_name, country_id, country_name){
    // Get standings of team by team name, league id, and country id

    let url = `${HOST_URL}/?action=${ACTION.STANDINGS}&league_id=${league_id}&APIkey=${API_KEY}`
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                standings = JSON.parse(body)
                standings.forEach(standing => {
                    if (standing.country_name === country_name && standing.team_name === team_name) {
                        resolve({
                            "country_id": country_id,
                            "country_name": country_name,
                            "league_id": standing.league_id,
                            "league_name": standing.league_name,
                            "team_id": standing.team_id,
                            "team_name": standing.team_name,
                            "overall_league_position": standing.overall_league_position
                        })
                    }
                });
            }
            reject("Invalid request");
        })
    });
}

exports = module.exports = {
    getCountries: getCountries,
    getLeagues: getLeagues,
    findStanding: findStanding
};