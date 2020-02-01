const express = require('express');
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000
const standings_service = require('./service/standings');

app.get('/', async (req, res) => {
    let response = await standings_service.findStanding("149", "Leeds", "41", "England");
    console.log(response)
    res.send(response)
})
app.get('/v1/standings', async function getStandings(req, res) {
    if (req.query.country_name && req.query.team_name && req.query.league_name) {
        let country_name = req.query.country_name
        let team_name = req.query.team_name
        let league_name = req.query.league_name

        let country_id = await standings_service.getCountries(country_name);
        let league_id = await standings_service.getLeagues(league_name, country_id)
        console.log(country_id, "country_id")
        console.log(league_id, "league_id")

        let standings_result = await standings_service.findStanding(league_id, team_name, country_id, country_name) 
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

