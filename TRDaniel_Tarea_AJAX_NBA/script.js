/* Autor: Daniel Tortonda Ruiz */

const equiposAPI = "https://www.balldontlie.io/api/v1/teams/";
const jugadoresAPI = "https://www.balldontlie.io/api/v1/players/?page=";
const filtroPagina = "&&per_page=100";

const selecEquipos = document.getElementById("selecEquipos");
const tabla = document.getElementById("tabla");

let equipos = new Array();

async function getEquipos(){
    let response = await fetch(`${equiposAPI}`);
    let datosEquipos = await response.json();
    llenarSelectEquipos(datosEquipos);
}

const llenarSelectEquipos = datosEquipos => {
    
    for( let pos=0; pos < datosEquipos.meta.total_count; pos++){
        let optionEquipo = document.createElement("option");
        let equipo = datosEquipos.data[pos];
        equipos.push(equipo.name);
        optionEquipo.innerText = equipo.name;
        selecEquipos.appendChild(optionEquipo);
    }
    /* Para comprobar que se cargan los equipos
     console.log(equipos); */
}

async function seleccionarEquipo(){
    let selecionadoId = equipos.indexOf(selecEquipos.value)+1;
    let response = await fetch(`${equiposAPI}${selecionadoId}`);
    let equipoSelecionado = await response.json();
    console.log(`La abreviación de los ${equipoSelecionado.full_name}: ${equipoSelecionado.abbreviation}`)

}

async function getPlantilla(){
    alert("Esto puede tardar unos minutos.")
    let selecionadoId = equipos.indexOf(selecEquipos.value)+1;
    let plantilla = new Array();

    let response = await fetch(`${jugadoresAPI}1${filtroPagina}`);
    let datosJugadores = await response.json();

    for (let pag=1; pag <= datosJugadores.meta.total_pages; pag++){
        let response = await fetch(`${jugadoresAPI}${pag}${filtroPagina}`);
        let paginaJugadores = await response.json();
        paginaJugadores.data.forEach(element => {
            if(element.team.id == selecionadoId) plantilla.push(element);
        });
    }
        console.log(plantilla);
    pintarPlantilla(plantilla);
}

function pintarPlantilla(plantilla){
    tabla.className = "tabla";
    let registro = document.createElement("tr");
    let encabezado1 = document.createElement("th");
    encabezado1.innerText = "Nombre";
    registro.appendChild(encabezado1);
    let encabezado2 = document.createElement("th");
    encabezado2.innerText = "Apellido";
    registro.appendChild(encabezado2);
    let encabezado3 = document.createElement("th");
    encabezado3.innerText = "Posicion";
    registro.appendChild(encabezado3);
    tabla.appendChild(registro);
    for( let x = 0; x < plantilla.length; x++){
        registro = document.createElement("tr");
        let nombre = document.createElement("td");
        let apellido = document.createElement("td");
        let posicion = document.createElement("td");
        nombre.innerText = plantilla[x].first_name;
        apellido.innerText = plantilla[x].last_name;
        posicion.innerText = plantilla[x].position;
        registro.appendChild(nombre);
        registro.appendChild(apellido);
        registro.appendChild(posicion);
        tabla.appendChild(registro);
    }
   alert("Espere un 1 min paro no revasar el límite de peticiones por min de la API");
}


getEquipos();