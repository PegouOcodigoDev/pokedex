const pokemonListUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1118';

function getRandomPokemonList() {
    fetch(pokemonListUrl)
        .then(response => response.json())
        .then(data => {
            const allPokemonUrls = data.results.map(pokemon => pokemon.url);
            const randomPokemonUrls = getRandomItems(allPokemonUrls, 9);
            const requests = randomPokemonUrls.map(url => fetch(url).then(response => response.json()));

            Promise.all(requests)
                .then(pokemonsData => {
                    const pokemonsList = document.querySelector(".pokemons");
                    pokemonsList.innerHTML = '';

                    pokemonsData.forEach(pokemonData => {
                        const pokemonView = createPokemonView(pokemonData);
                        pokemonsList.appendChild(pokemonView);
                    });
                })
                .catch(error => console.log('Erro ao obter detalhes dos pokémons:', error));
        })
        .catch(error => console.log('Erro ao obter lista de pokémons:', error));
}

function getRandomItems(array, count) {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
}

function createPokemonView(pokemonData) {
    const pokemonView = document.createElement('div');
    pokemonView.classList.add('pokemon-view');

    const preInfo = document.createElement('div');
    preInfo.classList.add('pre-info');
    preInfo.innerHTML = `
        <p>${pokemonData.name}</p>
        <p>${pokemonData.id}</p>
        <div class="type"><i class="fas fa-${getTypeIcon(pokemonData.types[0].type.name)}"></i> ${pokemonData.types[0].type.name}</div>
    `;

    const image = document.createElement('div');
    image.classList.add('image');
    image.innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">`;

    const typeColor = getTypeColor(pokemonData.types[0].type.name);
    pokemonView.style.backgroundColor = typeColor;

    pokemonView.appendChild(preInfo);
    pokemonView.appendChild(image);

    pokemonView.onclick = () => {
        updateDisplayInformation(pokemonData);
    };

    return pokemonView;
}

function createDisplayInformation(){
    const displayScreen = document.querySelector(".display-information-screen");

    const fields = ['Nome', 'Id', 'Tipo', 'Habilidade', 'Hp', 'Ataque', 'Defesa'];
    fields.forEach(field =>{
        const div = document.createElement('div');
        const hr = document.createElement('hr');
        hr.classList = 'curved-hr'
        div.innerHTML = `<p>${field}</p><p></p>`;
        displayScreen.appendChild(div);
        if(field != 'Defesa'){
            displayScreen.appendChild(hr)
        }
    })

}

function updateDisplayInformation(pokemonData) {
    const hr = document.querySelector('hr')
    if(!hr){
        createDisplayInformation();
    }

    const displayScreen = document.querySelector(".display-information-screen");
    const fields = [
        { label: "Nome", value: pokemonData.name },
        { label: "Id", value: pokemonData.id },
        { label: "Tipo", value: pokemonData.types.map(type => type.type.name).join(', ') },
        { label: "Habilidade", value: pokemonData.abilities.map(ability => ability.ability.name).join(', ') },
        { label: "Hp", value: pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat },
        { label: "Ataque", value: pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat },
        { label: "Defesa", value: pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat }
    ];

    fields.forEach((field, index) => {
        const div = displayScreen.children[index * 2];
        const secondP = div.querySelectorAll("p")[1];
        secondP.textContent = field.value;
    });

    const pokemonImage = document.getElementById("pokemon-image");
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonImage.alt = pokemonData.name;
}

function getTypeColor(typeName) {
    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    return typeColors[typeName.toLowerCase()] || '#000000';
}

function getTypeIcon(typeName) {
    const typeIcons = {
        normal: 'circle',
        fire: 'fire',
        water: 'water',
        electric: 'bolt',
        grass: 'leaf',
        ice: 'snowflake',
        fighting: 'fist-raised',
        poison: 'skull-crossbones',
        ground: 'globe-americas',
        flying: 'feather-alt',
        psychic: 'brain',
        bug: 'bug',
        rock: 'gem',
        ghost: 'ghost',
        dragon: 'dragon',
        dark: 'moon',
        steel: 'shield-alt',
        fairy: 'magic',
    };
    return typeIcons[typeName.toLowerCase()] || 'question';
}

window.onload = getRandomPokemonList;