const Pokedex = require('pokedex-promise-v2');
const PokemonModel =require('./pokemon-model');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser : true,
    useCreateIndex: true
  });

mongoose.connection.on("error", (error) => {
    console.log(error);
    process.exit(1);
});
mongoose.connection.on("connected", function () {
    console.log("connected to mongo");
    createPokemon('butterfree');
});

function createPokemon(name){
    var P = new Pokedex();
    P.getPokemonByName(name) // with Promise
    .then(function(response) {
        let result = response;
        delete result['weight'];
        delete result['sprites'];
        delete result['location_area_encounters'];
        delete result['held_items'];
        delete result['species'];
        delete result['order'];
        delete result['game_indices'];
        result['moves'].forEach(moves => {
        moves.move.level_learned_at = moves.version_group_details[0].level_learned_at;
        moves.move.move_learn_method = moves.version_group_details[0].move_learn_method;
        delete moves['version_group_details'];
        });
        PokemonModel.create(result).then((res) =>{
            console.log(res);
        }).catch(function(error) {
        console.log('There was an ERROR: ', error);
        });
    })
    .catch(function(error) {
    console.log('There was an ERROR: ', error);
    });
}
