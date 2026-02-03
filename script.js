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

// Aplicar filtros
function applyFilters() {
    const filters = {
        caja: document.getElementById('filter-caja').value.toLowerCase(),
        juego: document.getElementById('filter-juego').value.toLowerCase(),
        rank: document.getElementById('filter-rank').value.toLowerCase(),
        complejidad: document.getElementById('filter-complejidad').value.toLowerCase(),
        trata: document.getElementById('filter-trata').value.toLowerCase(),
        calificacion: document.getElementById('filter-calificacion').value.toLowerCase(),
        recomm: document.getElementById('filter-recomm').value.toLowerCase(),
        maxplayers: document.getElementById('filter-maxplayers').value.toLowerCase(),
        minplaytime: document.getElementById('filter-minplaytime').value.toLowerCase(),
        maxplaytime: document.getElementById('filter-maxplaytime').value.toLowerCase(),
        minplayers: document.getElementById('filter-minplayers').value.toLowerCase(),
        categoria: document.getElementById('filter-categoria').value.toLowerCase()
    };
    
    filteredGames = games.filter(game => {
        return (
            game.caja.toLowerCase().includes(filters.caja) &&
            game.juego.toLowerCase().includes(filters.juego) &&
            game.rank.toLowerCase().includes(filters.rank) &&
            game.complejidad.toLowerCase().includes(filters.complejidad) &&
            game.trata.toLowerCase().includes(filters.trata) &&
            game.calificacion.toLowerCase().includes(filters.calificacion) &&
            game.recomm_players.toLowerCase().includes(filters.recomm) &&
            game.maxplayers.toLowerCase().includes(filters.maxplayers) &&
            game.minplaytime.toLowerCase().includes(filters.minplaytime) &&
            game.maxplaytime.toLowerCase().includes(filters.maxplaytime) &&
            game.minplayers.toLowerCase().includes(filters.minplayers) &&
            game.categoria.toLowerCase().includes(filters.categoria)
        );
    });
    
    renderTable();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filter-caja').value = '';
    document.getElementById('filter-juego').value = '';
    document.getElementById('filter-rank').value = '';
    document.getElementById('filter-complejidad').value = '';
    document.getElementById('filter-trata').value = '';
    document.getElementById('filter-calificacion').value = '';
    document.getElementById('filter-recomm').value = '';
    document.getElementById('filter-maxplayers').value = '';
    document.getElementById('filter-minplaytime').value = '';
    document.getElementById('filter-maxplaytime').value = '';
    document.getElementById('filter-minplayers').value = '';
    document.getElementById('filter-categoria').value = '';
    
    filteredGames = [...games];
    renderTable();
}

// Event listeners
document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', applyFilters);
});

document.getElementById('clear-filters').addEventListener('click', clearFilters);

// Renderizar tabla inicial
renderTable();
