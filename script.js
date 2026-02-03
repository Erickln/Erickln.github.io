// Los datos de los juegos se cargan desde games.js
let filteredGames = [...games];
let currentSort = { field: null, ascending: true };

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
    
    filteredGames.forEach((game, index) => {
        const row = document.createElement('tr');
        row.style.height = '15px !important';
        row.style.lineHeight = '13px';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${game.imagen}" alt="${game.juego}" class="game-thumbnail"></td>
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
            <td>${game.categoria2}</td>
            <td>${game.categoria3}</td>
            <td>${game.se_jugar}</td>
        `;
        tbody.appendChild(row);
    });
}

// Ordenar tabla
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }
    
    const numericFields = ['rank', 'complejidad', 'calificacion', 'recomm_players', 'maxplayers', 'minplaytime', 'maxplaytime', 'minplayers'];
    const isNumeric = numericFields.includes(field);
    
    filteredGames.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        
        if (isNumeric) {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        } else {
            valA = (valA || '').toLowerCase();
            valB = (valB || '').toLowerCase();
        }
        
        if (valA < valB) return currentSort.ascending ? -1 : 1;
        if (valA > valB) return currentSort.ascending ? 1 : -1;
        return 0;
    });
    
    updateSortIndicators(field);
    renderTable();
}

// Actualizar indicadores de ordenamiento
function updateSortIndicators(activeField) {
    document.querySelectorAll('.sortable').forEach(th => {
        const field = th.dataset.sort;
        const baseName = th.textContent.replace(/ [↕↑↓]$/, '');
        if (field === activeField) {
            th.textContent = baseName + (currentSort.ascending ? ' ↑' : ' ↓');
        } else {
            th.textContent = baseName + ' ↕';
        }
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

document.querySelectorAll('.filter-operator').forEach(select => {
    select.addEventListener('change', applyFilters);
});

// Event listeners para ordenamiento
document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => sortTable(th.dataset.sort));
});

// Renderizar tabla inicial
renderTable();
