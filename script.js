// Datos de los juegos
const games = [
    {
        caja: "Caja A-1",
        juego: "7 Wonders Duel",
        rank: "15",
        complejidad: "2.22",
        trata: "Juego de cartas de civilización y construcción de maravillas para dos jugadores",
        calificacion: "8.1",
        recomm_players: "2",
        maxplayers: "2",
        minplaytime: "30",
        maxplaytime: "45",
        minplayers: "2",
        categoria: "Estrategia"
    },
    {
        caja: "Caja B-3",
        juego: "Brass: Birmingham",
        rank: "2",
        complejidad: "3.91",
        trata: "Juego de construcción económica durante la Revolución Industrial en Inglaterra",
        calificacion: "8.6",
        recomm_players: "3-4",
        maxplayers: "4",
        minplaytime: "60",
        maxplaytime: "120",
        minplayers: "2",
        categoria: "Económico"
    }
];

let filteredGames = [...games];

// Renderizar la tabla
function renderTable() {
    const tbody = document.getElementById('games-tbody');
    const noResults = document.getElementById('no-results');
    
    tbody.innerHTML = '';
    
    if (filteredGames.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }
    
    filteredGames.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${game.caja}</td>
            <td><strong>${game.juego}</strong></td>
            <td>${game.rank}</td>
            <td>${game.complejidad}</td>
            <td>${game.trata}</td>
            <td>${game.calificacion}</td>
            <td>${game.recomm_players}</td>
            <td>${game.maxplayers}</td>
            <td>${game.minplaytime}</td>
            <td>${game.maxplaytime}</td>
            <td>${game.minplayers}</td>
            <td>${game.categoria}</td>
        `;
        tbody.appendChild(row);
    });
}

// Función para comparar valores numéricos según operador
function compareValues(gameValue, filterValue, operator) {
    if (filterValue === '') return true;
    const numGame = parseFloat(gameValue);
    const numFilter = parseFloat(filterValue);
    if (isNaN(numGame) || isNaN(numFilter)) return true;
    
    switch (operator) {
        case '>=': return numGame >= numFilter;
        case '<=': return numGame <= numFilter;
        case '=': return numGame === numFilter;
        default: return true;
    }
}

// Aplicar filtros
function applyFilters() {
    const filters = {
        rank: document.getElementById('filter-rank').value,
        rankOp: document.getElementById('filter-rank-op').value,
        complejidad: document.getElementById('filter-complejidad').value,
        complejidadOp: document.getElementById('filter-complejidad-op').value,
        minplayers: document.getElementById('filter-minplayers').value,
        minplayersOp: document.getElementById('filter-minplayers-op').value,
        maxplayers: document.getElementById('filter-maxplayers').value,
        maxplayersOp: document.getElementById('filter-maxplayers-op').value,
        maxplaytime: document.getElementById('filter-maxplaytime').value,
        maxplaytimeOp: document.getElementById('filter-maxplaytime-op').value,
        categoria: document.getElementById('filter-categoria').value.toLowerCase()
    };
    
    filteredGames = games.filter(game => {
        return (
            compareValues(game.rank, filters.rank, filters.rankOp) &&
            compareValues(game.complejidad, filters.complejidad, filters.complejidadOp) &&
            compareValues(game.minplayers, filters.minplayers, filters.minplayersOp) &&
            compareValues(game.maxplayers, filters.maxplayers, filters.maxplayersOp) &&
            compareValues(game.maxplaytime, filters.maxplaytime, filters.maxplaytimeOp) &&
            game.categoria.toLowerCase().includes(filters.categoria)
        );
    });
    
    renderTable();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filter-rank').value = '';
    document.getElementById('filter-rank-op').value = '>=';
    document.getElementById('filter-complejidad').value = '';
    document.getElementById('filter-complejidad-op').value = '>=';
    document.getElementById('filter-minplayers').value = '';
    document.getElementById('filter-minplayers-op').value = '>=';
    document.getElementById('filter-maxplayers').value = '';
    document.getElementById('filter-maxplayers-op').value = '>=';
    document.getElementById('filter-maxplaytime').value = '';
    document.getElementById('filter-maxplaytime-op').value = '>=';
    document.getElementById('filter-categoria').value = '';
    
    filteredGames = [...games];
    renderTable();
}

// Event listeners
document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', applyFilters);
});

document.getElementById('clear-filters').addEventListener('click', clearFilters);
querySelectorAll('.filter-operator').forEach(select => {
    select.addEventListener('change', applyFilters);
});

document.
// Renderizar tabla inicial
renderTable();
