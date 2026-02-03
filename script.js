// Los datos de los juegos se cargan desde games.js
let filteredGames = [...games];
let currentSort = { field: null, ascending: true };

// Colores para categorías (se asignan dinámicamente)
const categoryColors = {};
const categoryColorPalette = [
    '#1e3a5f', '#2d4a3e', '#4a2d4a', '#3d3d1e', '#1e3d3d',
    '#4a3d2d', '#2d2d4a', '#3d1e3d', '#1e4a3d', '#4a1e2d',
    '#2d4a1e', '#3d2d1e', '#1e2d4a', '#4a2d1e', '#2d1e4a',
    '#1e4a1e', '#4a1e4a', '#2d3d2d', '#3d1e1e', '#1e1e4a'
];
let colorIndex = 0;

// Obtener color para una categoría
function getCategoryColor(category) {
    if (!category) return '#3d3d3d';
    if (!categoryColors[category]) {
        categoryColors[category] = categoryColorPalette[colorIndex % categoryColorPalette.length];
        colorIndex++;
    }
    return categoryColors[category];
}

// Color para "Sé jugarlo"
function getSeJugarColor(value) {
    if (!value) return '#3d3d3d';
    const normalized = value.toLowerCase().trim();
    if (normalized === 'sí' || normalized === 'si') return '#1b5e20'; // Verde oscuro - Sí
    if (normalized === 'no') return '#b71c1c'; // Rojo oscuro - No
    return '#e65100'; // Naranja oscuro - Otro valor
}

// Calcular percentiles para ignorar valores atípicos
function calculatePercentiles(values, lower = 5, upper = 95) {
    const sorted = [...values].filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (sorted.length === 0) return { min: 0, max: 1 };
    const lowerIndex = Math.floor(sorted.length * lower / 100);
    const upperIndex = Math.floor(sorted.length * upper / 100);
    return {
        min: sorted[lowerIndex] || sorted[0],
        max: sorted[upperIndex] || sorted[sorted.length - 1]
    };
}

// Obtener color de gradiente para valores numéricos
// invertir = true para rank (menor es mejor)
function getGradientColor(value, min, max, invertir = false) {
    const num = parseFloat(value);
    if (isNaN(num)) return '#555555'; // Color por defecto si no es numérico
    
    // Normalizar entre 0 y 1
    let normalized = (num - min) / (max - min);
    normalized = Math.max(0, Math.min(1, normalized)); // Clamp entre 0 y 1
    
    if (invertir) normalized = 1 - normalized;
    
    // Gradiente de rojo oscuro (malo) a verde oscuro (bueno)
    const r = Math.round(139 * (1 - normalized) + 27 * normalized);
    const g = Math.round(35 * (1 - normalized) + 94 * normalized);
    const b = Math.round(35 * (1 - normalized) + 32 * normalized);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Calcular rangos para las columnas numéricas
function calculateColorRanges() {
    const ranges = {};
    
    // Rank (menor es mejor - invertir)
    const ranks = games.map(g => parseFloat(g.rank)).filter(v => !isNaN(v));
    ranges.rank = calculatePercentiles(ranks);
    ranges.rank.invertir = true;
    
    // Complejidad (1-5, menor = más fácil = verde)
    ranges.complejidad = { min: 1, max: 5, invertir: true };
    
    // Calificación (mayor es mejor)
    const calificaciones = games.map(g => parseFloat(g.calificacion)).filter(v => !isNaN(v));
    ranges.calificacion = calculatePercentiles(calificaciones);
    ranges.calificacion.invertir = false;
    
    // Recomm players (neutral, usar escala)
    ranges.recomm_players = { min: 1, max: 8, invertir: false };
    
    // Max players (más = verde para grupos grandes)
    ranges.maxplayers = { min: 1, max: 10, invertir: false };
    
    // Min playtime (menor = más rápido = verde)
    const minPlaytimes = games.map(g => parseFloat(g.minplaytime)).filter(v => !isNaN(v));
    ranges.minplaytime = calculatePercentiles(minPlaytimes);
    ranges.minplaytime.invertir = true;
    
    // Max playtime (menor = más rápido = verde)
    const maxPlaytimes = games.map(g => parseFloat(g.maxplaytime)).filter(v => !isNaN(v));
    ranges.maxplaytime = calculatePercentiles(maxPlaytimes);
    ranges.maxplaytime.invertir = true;
    
    // Min players (menor = más flexible = verde)
    ranges.minplayers = { min: 1, max: 4, invertir: true };
    
    return ranges;
}

const colorRanges = calculateColorRanges();

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
        
        // Calcular colores para cada columna numérica
        const rankColor = getGradientColor(game.rank, colorRanges.rank.min, colorRanges.rank.max, colorRanges.rank.invertir);
        const complejidadColor = getGradientColor(game.complejidad, colorRanges.complejidad.min, colorRanges.complejidad.max, colorRanges.complejidad.invertir);
        const calificacionColor = getGradientColor(game.calificacion, colorRanges.calificacion.min, colorRanges.calificacion.max, colorRanges.calificacion.invertir);
        const recommColor = getGradientColor(game.recomm_players, colorRanges.recomm_players.min, colorRanges.recomm_players.max, colorRanges.recomm_players.invertir);
        const maxPlayersColor = getGradientColor(game.maxplayers, colorRanges.maxplayers.min, colorRanges.maxplayers.max, colorRanges.maxplayers.invertir);
        const minPlaytimeColor = getGradientColor(game.minplaytime, colorRanges.minplaytime.min, colorRanges.minplaytime.max, colorRanges.minplaytime.invertir);
        const maxPlaytimeColor = getGradientColor(game.maxplaytime, colorRanges.maxplaytime.min, colorRanges.maxplaytime.max, colorRanges.maxplaytime.invertir);
        const minPlayersColor = getGradientColor(game.minplayers, colorRanges.minplayers.min, colorRanges.minplayers.max, colorRanges.minplayers.invertir);
        
        // Colores para categorías
        const cat1Color = getCategoryColor(game.categoria);
        const cat2Color = getCategoryColor(game.categoria2);
        const cat3Color = getCategoryColor(game.categoria3);
        
        // Color para "Sé jugarlo"
        const seJugarColor = getSeJugarColor(game.se_jugar);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${game.imagen}" alt="${game.juego}" class="game-thumbnail"></td>
            <td><strong>${game.juego}</strong></td>
            <td style="background-color: ${rankColor}">${game.rank}</td>
            <td style="background-color: ${complejidadColor}">${game.complejidad}</td>
            <td>${game.trata}</td>
            <td style="background-color: ${calificacionColor}">${game.calificacion}</td>
            <td style="background-color: ${recommColor}">${game.recomm_players}</td>
            <td style="background-color: ${maxPlayersColor}">${game.maxplayers}</td>
            <td style="background-color: ${minPlaytimeColor}">${game.minplaytime}</td>
            <td style="background-color: ${maxPlaytimeColor}">${game.maxplaytime}</td>
            <td style="background-color: ${minPlayersColor}">${game.minplayers}</td>
            <td style="background-color: ${cat1Color}">${game.categoria}</td>
            <td style="background-color: ${cat2Color}">${game.categoria2}</td>
            <td style="background-color: ${cat3Color}">${game.categoria3}</td>
            <td style="background-color: ${seJugarColor}">${game.se_jugar}</td>
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
