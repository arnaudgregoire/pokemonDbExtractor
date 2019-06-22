const Pokedex = require('pokedex-promise-v2');
const GenericPokemonModel =require('./generic-pokemon-model');
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
    createPokedex('generation-i').then((pokedex)=>{
        let i = 0;
        setInterval(()=>{
            createPokemon(pokedex.pokemon_species[i].name);
            i++;
        },1000)
    })
});

var P = new Pokedex();

function createPokedex(generation){
    return P.getGenerationByName(generation).then(function(response){
        let pokedex = response;
        delete pokedex.id;
        delete pokedex.name;
        delete pokedex.abilities;
        delete pokedex.names;
        delete pokedex.moves;
        delete pokedex.main_region;
        delete pokedex.types;
        delete pokedex.version_groups;
        pokedex.pokemon_species.forEach((pokemon)=>{
            delete pokemon.url;
        })
        return pokedex;
    })
    .catch(function(error) {
        console.log('There was an ERROR: ', error);
    });
}

function createPokemon(name){
    P.getPokemonByName(name)
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
        result['moves'].forEach(moves =>{
            moves.name = moves.move.name;
            moves.url = moves.move.url;
            moves.level_learned_at = moves.move.level_learned_at;
            moves.move_learn_method = moves.move.move_learn_method;
            delete moves.move.name;
            delete moves.move.url;
            delete moves.move.level_learned_at;
            delete moves.move.move_learn_method;
        })

        GenericPokemonModel.create(result).then((res) =>{
            console.log( name + ' created successfully');
        }).catch(function(error) {
        console.log('There was an ERROR: ', error);
        });
    })
    .catch(function(error) {
    console.log('There was an ERROR: ', error);
    });
}
