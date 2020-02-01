let chai = require("chai");
const assert =  chai.assert;
const expect = chai.expect;
const standings_service = require('../../service/standings');

describe('standings service', () => {
    it('should return correct country id for England', () => {
      return standings_service.getCountries("England").then(result => {
        expect(result).to.be.a('string')
        assert.equal(result, "41")
      })
    }),
    it('should return correct league id for Championship league', () => {
        return standings_service.getLeagues("Championship", "41").then(result => {
            expect(result).to.be.a('string')
            assert.equal(result, "149")
        })
    }),
    it('should return correct league position', () => {
        return standings_service.findStanding("149", "Leeds", "41", "England").then(result => {
            expect(result).to.be.a('object');
            expect(result).to.have.property("country_id");
            expect(result).to.have.property("country_name");
            expect(result).to.have.property("league_id");
            expect(result).to.have.property("league_name");
            expect(result).to.have.property("team_id");
            expect(result).to.have.property("team_name");
            expect(result).to.have.property("overall_league_position");
        })
    })
})