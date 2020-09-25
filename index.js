const bent = require('bent');
const getJSON = bent('json');
const { argv } = require('yargs');

(async function () {
  const maxPrice = 13000;
  const { homes } = await getJSON(
    `https://homie.mx/api/internal/homes.json?filters%5Bmap_filter_check%5D=true&filters%5Bcurrency%5D=mxn&filters%5Bcriteria%5D%5Bsqare_mts%5D%5B%24gte%5D=0&filters%5Bcriteria%5D%5Bsqare_mts%5D%5B%24lte%5D=500&filters%5Bcriteria%5D%5Btotal_amount%5D%5B%24gte%5D=8000&filters%5Bcriteria%5D%5Btotal_amount%5D%5B%24lte%5D=${maxPrice}&filters%5Bcriteria%5D%5Bbathrooms%5D%5B%24gte%5D=1&filters%5Bcriteria%5D%5Bbedrooms%5D%5B%24gte%5D=1&filters%5Bcriteria%5D%5Bparkings%5D%5B%24gte%5D=0&filters%5Bcriteria%5D%5Border_by%5D%5Blast_published_at%5D=asc&filters%5Blocation_opts%5D%5Bcenter_location%5D%5B%5D=-99.1755681550476&filters%5Blocation_opts%5D%5Bcenter_location%5D%5B%5D=19.432213912157557&filters%5Blocation_opts%5D%5Bsearching_ratio%5D=19.432213912157557&filters%5Blocations_selected%5D%5Bstate_id%5D=57f6a83dd2a57d180e000001&filters%5BshowFilters%5D=true`,
  );

  const foundHomes = {};
  const desired = [
    'polanco',
    'noche buena',
    'chapultepec',
    'clavería',
    'anzures',
    'condesa',
    'rafael',
    'juárez',
    'cuauhtémoc',
    'tabacalera',
    'mixcoac',
    'narvarte',
    'hipódromo',
    'del valle',
    'nápoles',
    'escandón',
  ];

  function addDesired(found) {
    const neighborhood = found.one_line_address.toLowerCase();
    for (let neighbor of desired) {
      if (neighborhood.includes(neighbor)) {
        const formatted = {
          name: found.abbr_address,
          price: found.monthly_amount,
          url: found.url,
        };
        if (!argv.url) {
          delete formatted.url;
        }
        if (neighbor in foundHomes) {
          foundHomes[neighbor].push(formatted);
        } else {
          foundHomes[neighbor] = [formatted];
        }
      }
    }
  }

  for (let home of homes) {
    if (home.one_line_address) {
      addDesired(home);
    }
  }

  console.log(foundHomes);
})();
