const d = document;
const $main = d.getElementById("main");
const $nav = d.getElementById("nav");
const $fragment = d.createDocumentFragment();
const $template = d.getElementById("template-card").content;

const getAll = async (url) =>{
    try{
        $main.innerHTML = '<img class="loader" src="img/__Iphone-spinner-1.gif">';
        let res = await fetch(url);
        let json = await res.json();

        if(!res.ok) throw res;

        console.log(json);
        const pokemons = json.results;

        let fetchImg = pokemons.map(pokemon => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`));
        let resImg = await Promise.all(fetchImg);

        for(let i = 0; i< pokemons.length; i++){
            let poke = pokemons[i];
            $template.querySelector("h2").innerHTML = poke.name;

            let jsonPoke = await resImg[i].json();
            if(!resImg[i].ok) throw resImg[i];

            $template.querySelector("img").setAttribute("src",`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${jsonPoke.id}.png`);
            /* try{
                let respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + poke.name);
                let jsonPoke = await respuesta.json();

                if(!respuesta.ok) throw res;
                
                $template.querySelector("img").setAttribute("src",`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${jsonPoke.id}.png`);

            }catch(err){
                console.log(err);
            } */
            $card = $template.cloneNode(true);
            $fragment.appendChild($card);
        }
        $main.innerHTML = "";
        $main.appendChild($fragment); 
        let next = json.next ? `<a id="next" href="${json.next}"> next</a>` : "";
        let prev = json.previous ? `<a id="prev" href="${json.previous}"> prev</a>` : "";
        $nav.innerHTML = prev + "    " + next;
    }catch(err){
        console.log(err);
    }
}

d.addEventListener("DOMContentLoaded",() => getAll("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"));

d.addEventListener("click",(event) =>{
    if(event.target.matches("#next")){
        event.preventDefault();
        getAll(event.target.getAttribute("href"));
    }
    if(event.target.matches("#prev")){
        event.preventDefault();
        getAll(event.target.getAttribute("href"));
    }
});