const fs = require('fs');
const Pokedex = require('pokedex-promise-v2');

var P = new Pokedex();
  P.getPokemonByName('butterfree') // with Promise
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
          moves['level_learned_at'] = moves['version_group_details'][0]['level_learned_at'];
          moves.move_learn_method = moves['version_group_details'][0].move_learn_method;
          delete moves['version_group_details'];
      });

      fs.writeFile("output.json", JSON.stringify(response), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});
    })
    .catch(function(error) {
      console.log('There was an ERROR: ', error);
    });