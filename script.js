function getFirstNine() {
    const pokemonListUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=9';
    fetch(pokemonListUrl)
        .then(response => response.json())
        .then(data => {
            const pokemonsList = document.querySelector(".pokemons");
            pokemonsList.innerHTML = '';
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => {
                        const pokemonView = document.createElement('div');
                        pokemonView.classList.add('pokemon-view');
                        const preInfo = document.createElement('div');
                        preInfo.classList.add('pre-info');
                        preInfo.innerHTML = `
                            <p>${pokemonData.name}</p>
                            <p>${pokemonData.id}</p>
                            <div class="type"><i class="fas fa-dragon"></i> ${pokemonData.types[0].type.name}</div>
                        `;

                        const image = document.createElement('div');
                        image.classList.add('image');
                        image.innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">`;

                        pokemonView.appendChild(preInfo);
                        pokemonView.appendChild(image);

                        pokemonsList.appendChild(pokemonView);
                    })
                    .catch(error => console.log('Erro ao obter detalhes do Pokémon:', error));
            });
        })
        .catch(error => console.log('Erro ao obter lista de Pokémon:', error));
}

window.onload = getFirstNine;