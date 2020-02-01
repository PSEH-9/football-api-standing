const express = require('express');
var bodyParser = require('body-parser')
const https = require('https');
const request = require('request');

const PORT = process.env.PORT || 3000

const app = express();
app.use(bodyParser.json())

// API Football Configuration
const HOST_URL = "https://apiv2.apifootball.com"
const API_KEY = "9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978"
const ACTIONS = {
    "LEAGUES": "get_leagues",
    "COUNTRIES": "get_countries",
    "STANDINGS": "get_standings"
}

async function getLeagues(league_name, country_id){
    // Get league id by leauge name and country id

    let url = `${HOST_URL}/?action=${ACTIONS.LEAGUES}&country_id=${country_id}&APIkey=${API_KEY}`
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

    let url = `${HOST_URL}/?action=${ACTIONS.COUNTRIES}&APIkey=${API_KEY}`
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

    let url = `${HOST_URL}/?action=${ACTIONS.STANDINGS}&league_id=${league_id}&APIkey=${API_KEY}`
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                standings = JSON.parse(body)
                standings.forEach(standing => {
                    if (standing.country_name === country_name && standing.team_name === team_name) {
                        resolve({
                            "country_name": country_name,
                            "country_id": country_id,
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


app.get('/', async (req, res) => {
    let response = await findStandings("149", "Leeds", "41", "England");
    console.log(response)
    res.send(response)
})
app.get('/v1/standings', async function getStandings(req, res) {
    if (req.query.country_name && req.query.team_name && req.query.league_name) {
        let country_name = req.query.country_name
        let team_name = req.query.team_name
        let league_name = req.query.league_name

        let country_id = await getCountries(country_name);
        let league_id = await getLeagues(league_name, country_id)
        console.log(country_id, "country_id")
        console.log(league_id, "league_id")

        let standings_result = await findStanding(league_id, team_name, country_id, country_name) 
        console.log(standings_result);
        res.send(standings_result)
    }
    else{
        res.sendStatus(400)
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}....`)
});

