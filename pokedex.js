const pokedexList = document.querySelector("#pokedex");
const btnTypes = document.querySelectorAll(".btn-nav");
const inputSearch = document.querySelector(".searchPokemon");
const btnSearch = document.querySelector(".btnSearch")
const divFav = document.querySelector(".container-fav")

let baseUrl = "https://pokeapi.co/api/v2/pokemon/";
const maxPokemons = 150;

favouriteList = [];


function getDataFromApi(){
    for (let i = 1; i<= maxPokemons; i++){
        const url = `${baseUrl}${i}`;
        fetch(url)
            .then(response => response.json())
            .then(data => renderPokemon(data))
    };

}

function renderPokemon(pokemon) {
    console.log(pokemon)
    let types = pokemon.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p>`);
    types = types.join("  ");
    
    let pokeId = pokemon.id.toString();
    if (pokeId.length === 1){
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const li = document.createElement("li");
    li.classList.add("card");
    pokedexList.appendChild(li);
    li.innerHTML = `
        <h2 class="card-title">${pokemon.name}</h2>
        <img class="card-image" src="${pokemon.sprites.other.dream_world.front_default}"/>
        <div class="type-container">
            ${types}
        </div>
        <div class="container-id-fav">
            <p class="p-id">#${pokeId}</p>
            <p class="fav"><i class="fa-regular fa-heart"></i></p>
        </div>
    `;
};


const handleClickBtnType = (event) => {
    const btnId = event.currentTarget.id;

    pokedexList.innerHTML = "";
    for (let i = 1; i<= maxPokemons; i++){
        const url = `${baseUrl}${i}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const eachType = data.types.map(type => type.type.name);

                if (eachType.some(type => type.includes(btnId))){
                    renderPokemon(data);
                } else if (btnId === "mostrar-todos") {
                    renderPokemon(data);
                }
                
            });
            
    };
}

const handleClickSearch = async (event) => {
    event.preventDefault();
    pokedexList.innerHTML = "";

    let inputName = inputSearch.value.trim().toLowerCase();
    const apiCalls = [];

    for (let i = 1; i <= maxPokemons; i++) {
        const url = `${baseUrl}${i}`;
        apiCalls.push(
            fetch(url)
                .then(response => response.json())
        );
    }

        const responses = await Promise.all(apiCalls);

        responses.forEach(data => {
            const pokeName = data.name.toLowerCase();

            if (pokeName.includes(inputName)) {
                renderPokemon(data);
            }
        });
    
};


btnSearch.addEventListener("click", handleClickSearch)

btnTypes.forEach(button => button.addEventListener("click", handleClickBtnType));

getDataFromApi();