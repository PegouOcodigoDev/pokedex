const pokemonListUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1118';

function getRandomPokemon() {
    fetch(pokemonListUrl)
        .then(response => response.json())
        .then(data => {
            const allPokemonUrls = data.results.map(pokemon => pokemon.url);
            const randomPokemonUrl = getRandomItems(allPokemonUrls, 1)[0];

            fetch(randomPokemonUrl)
                .then(response => response.json())
                .then(pokemonData => updateDisplayInformation(pokemonData))
                .catch(error => console.log('Erro ao obter os dados do pokémon:', error));
        })
        .catch(error => console.log('Erro ao obter a lista de pokémons:', error));
}

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

function turnPokemonIndex(index) {
    let currentIndexElement = document.querySelector('[name="Id"]');

    let currentIndex = parseInt(currentIndexElement.textContent);
    const newIndex = currentIndex + index;

    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${newIndex}/`;

    fetch(pokemonUrl)
        .then(response => response.json())
        .then(pokemonData => {
            updateDisplayInformation(pokemonData);
        })
        .catch(error => {
            console.error('Erro ao obter os dados do Pokémon:', error);
        });
}

function searchPokemon() {
    const pokemonNameInput = document.querySelector('.search-bar');
    const pokemonName = pokemonNameInput.value.trim().toLowerCase();
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

    fetch(pokemonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon não encontrado');
            }
            return response.json();
        })
        .then(pokemonData => {
            updateDisplayInformation(pokemonData);
        })
        .catch(error => {
            console.error('Erro ao obter os dados do Pokémon:', error);
            const display = document.querySelector('.display-information');
            while (display.firstChild) {
                display.removeChild(display.firstChild);
            }
            const div = document.createElement('div');
            div.innerHTML = `<p>Pokémon não encontrado</p>`;
            display.appendChild(div);
            const pokemonImage = document.getElementById("pokemon-image");
            pokemonImage.src = 'question-mark.png';
            pokemonImage.alt = 'question mark';
        });
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

function createDisplayInformation() {
    const display = document.querySelector(".display-information");

    const fields = ['Name', 'Id', 'Types', 'Abilities', 'Hp', 'Attack', 'Defense'];
    fields.forEach(field => {
        const div = document.createElement('div');
        const hr = document.createElement('hr');
        hr.classList.add('curved-hr');
        div.innerHTML = `<p>${field}</p><p name="${field}"></p>`;
        display.appendChild(div);
        if (field !== 'Defesa') {
            display.appendChild(hr);
        }
    });
}

function updateDisplayInformation(pokemonData) {
    const display = document.querySelector(".display-information");

    const errorMessage = display.querySelector("p");
    if (errorMessage && errorMessage.textContent === "Pokémon não encontrado") {
        errorMessage.parentElement.remove();
    }

    if (!display.querySelector('hr')) {
        createDisplayInformation();
    }

    const displayScreen = document.querySelectorAll(".display-information p");
    const fields = [
        { label: "Nome", value: pokemonData.name },
        { label: "Id", value: pokemonData.id },
        { label: "Tipo", value: pokemonData.types.map(type => type.type.name).join(', ') },
        { label: "Habilidade", value: pokemonData.abilities.slice(0, 2).map(ability => ability.ability.name).join(', ')  },
        { label: "Hp", value: pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat },
        { label: "Ataque", value: pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat },
        { label: "Defesa", value: pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat }
    ];

    fields.forEach((field, index) => {
        const secondP = displayScreen[index * 2 + 1];
        secondP.textContent = field.value;
    });

    const pokemonImage = document.getElementById("pokemon-image");
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonImage.alt = pokemonData.name;
}

function getRandomItems(array, count) {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
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