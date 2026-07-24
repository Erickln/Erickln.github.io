let games = [];
let filteredGames = [];
let currentSort = { field: null, ascending: true };
let categoryDescriptions = {};
let collectionConfig = null;

const defaultCollectionConfig = {
    collectionName: 'Colección de Juegos de Mesa',
    defaultHiddenColumns: [6],
    categoryFields: [
        { field: 'categoria', label: 'Cat. Principal' },
        { field: 'categoria2', label: 'Cat. Secundaria' },
        { field: 'categoria3', label: 'Cat. Terciaria' }
    ],
    columns: [
        { col: 0, field: '__index', label: '#', type: 'index', visible: true, freezeLabel: '#' },
        { col: 1, field: 'imagen', label: 'Imagen', type: 'image', visible: true, freezeLabel: 'Imagen' },
        { col: 2, field: 'juego', label: 'Juego', type: 'text', visible: true, freezeLabel: 'Juego', sortableField: 'juego' },
        { col: 3, field: 'rank', label: 'Rank', type: 'number', visible: true, freezeLabel: 'Rank', sortableField: 'rank' },
        { col: 4, field: 'complejidad', label: 'Complejidad', type: 'number', visible: true, freezeLabel: 'Complejidad', sortableField: 'complejidad' },
        { col: 5, field: 'trata', label: '¿De qué trata?', type: 'text', visible: true, freezeLabel: '¿De qué trata?', sortableField: 'trata' },
        { col: 6, field: 'calificacion', label: 'Calificación', type: 'number', visible: false, freezeLabel: 'Calificación', sortableField: 'calificacion' },
        { col: 7, field: 'recomm_players', label: 'Recomm Players', type: 'number', visible: true, freezeLabel: 'Recomm Players', sortableField: 'recomm_players' },
        { col: 8, field: 'maxplayers', label: 'Max Players', type: 'number', visible: true, freezeLabel: 'Max Players', sortableField: 'maxplayers' },
        { col: 9, field: 'minplaytime', label: 'Min Playtime', type: 'number', visible: true, freezeLabel: 'Min Playtime', sortableField: 'minplaytime' },
        { col: 10, field: 'maxplaytime', label: 'Max Playtime', type: 'number', visible: true, freezeLabel: 'Max Playtime', sortableField: 'maxplaytime' },
        { col: 11, field: 'minplayers', label: 'Min Players', type: 'number', visible: true, freezeLabel: 'Min Players', sortableField: 'minplayers' },
        { col: 12, field: 'categoria', label: 'Cat. Principal', type: 'category', visible: true, freezeLabel: 'Cat. Principal', sortableField: 'categoria' },
        { col: 13, field: 'categoria2', label: 'Cat. Secundaria', type: 'category', visible: true, freezeLabel: 'Cat. Secundaria', sortableField: 'categoria2' },
        { col: 14, field: 'categoria3', label: 'Cat. Terciaria', type: 'category', visible: true, freezeLabel: 'Cat. Terciaria', sortableField: 'categoria3' },
        { col: 15, field: 'se_jugar', label: 'Sé jugarlo', type: 'status', visible: true, freezeLabel: 'Sé jugarlo', sortableField: 'se_jugar' }
    ],
    filters: [
        { inputId: 'filter-rank', sliderId: 'slider-rank', operatorId: 'filter-rank-op', field: 'rank', type: 'number' },
        { inputId: 'filter-complejidad', sliderId: 'slider-complejidad', operatorId: 'filter-complejidad-op', field: 'complejidad', type: 'number', minOverride: 1.0 },
        { inputId: 'filter-minplayers', sliderId: 'slider-minplayers', operatorId: 'filter-minplayers-op', field: 'minplayers', type: 'number' },
        { inputId: 'filter-maxplayers', sliderId: 'slider-maxplayers', operatorId: 'filter-maxplayers-op', field: 'maxplayers', type: 'number' },
        { inputId: 'filter-maxplaytime', sliderId: 'slider-maxplaytime', operatorId: 'filter-maxplaytime-op', field: 'maxplaytime', type: 'number' }
    ]
};

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

function cloneDefaultCollectionConfig() {
    return JSON.parse(JSON.stringify(defaultCollectionConfig));
}

function getActiveCollectionConfig() {
    return collectionConfig || defaultCollectionConfig;
}

function getCategoryFields() {
    return getActiveCollectionConfig().categoryFields || defaultCollectionConfig.categoryFields;
}

function getColumnConfigs() {
    return getActiveCollectionConfig().columns || defaultCollectionConfig.columns;
}

function getColumnConfigByIndex(colIndex) {
    return getColumnConfigs().find(column => column.col === colIndex) || null;
}

function getNumericFields() {
    return getColumnConfigs()
        .filter(column => column.type === 'number' && column.field)
        .map(column => column.field);
}

function getFilterConfigs() {
    return getActiveCollectionConfig().filters || defaultCollectionConfig.filters;
}

function getConfigFieldLabel(fieldName, fallbackLabel = fieldName) {
    const column = getColumnConfigs().find(columnConfig => columnConfig.field === fieldName);
    return column?.label || fallbackLabel;
}

// Calcular percentiles para ignorar valores atípicos
function calculatePercentiles(values, lower = 50, upper = 95) {
    const sorted = [...values].filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (sorted.length === 0) return { min: 0, max: 1, mid: 0.5 };
    
    const getPercentileValue = (p) => {
        const index = Math.floor(sorted.length * p / 100);
        return sorted[Math.min(index, sorted.length - 1)];
    };
    
    return {
        min: getPercentileValue(0),
        mid: getPercentileValue(lower),  // Punto medio (amarillo) - percentil 50
        max: getPercentileValue(upper)   // Rojo - percentil 95
    };
}

// Obtener color de gradiente para valores numéricos
// Usa 3 colores: verde (mejor) → amarillo (medio) → rojo (peor)
// invertir = true para rank (menor es mejor)
function getGradientColor(value, min, max, invertir = false, mid = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return '#555555'; // Color por defecto si no es numérico
    
    // Si no hay punto medio, usar el promedio
    if (mid === null) mid = (min + max) / 2;
    
    let normalized;
    let r, g, b;
    
    // Colores: verde (#1b5e20), amarillo oscuro (#b8860b - DarkGoldenrod), rojo (#b71c1c)
    const verde = { r: 27, g: 94, b: 32 };
    const amarillo = { r: 184, g: 134, b: 11 };
    const rojo = { r: 183, g: 28, b: 28 };
    
    if (invertir) {
        // Para rank: menor valor = verde, mid = amarillo, mayor = rojo
        if (num <= min) {
            return `rgb(${verde.r}, ${verde.g}, ${verde.b})`;
        } else if (num >= max) {
            return `rgb(${rojo.r}, ${rojo.g}, ${rojo.b})`;
        } else if (num <= mid) {
            // Interpolación verde → amarillo
            normalized = (num - min) / (mid - min);
            r = Math.round(verde.r + (amarillo.r - verde.r) * normalized);
            g = Math.round(verde.g + (amarillo.g - verde.g) * normalized);
            b = Math.round(verde.b + (amarillo.b - verde.b) * normalized);
        } else {
            // Interpolación amarillo → rojo
            normalized = (num - mid) / (max - mid);
            r = Math.round(amarillo.r + (rojo.r - amarillo.r) * normalized);
            g = Math.round(amarillo.g + (rojo.g - amarillo.g) * normalized);
            b = Math.round(amarillo.b + (rojo.b - amarillo.b) * normalized);
        }
    } else {
        // Para calificación: mayor valor = verde, mid = amarillo, menor = rojo
        if (num >= max) {
            return `rgb(${verde.r}, ${verde.g}, ${verde.b})`;
        } else if (num <= min) {
            return `rgb(${rojo.r}, ${rojo.g}, ${rojo.b})`;
        } else if (num >= mid) {
            // Interpolación verde → amarillo
            normalized = (max - num) / (max - mid);
            r = Math.round(verde.r + (amarillo.r - verde.r) * normalized);
            g = Math.round(verde.g + (amarillo.g - verde.g) * normalized);
            b = Math.round(verde.b + (amarillo.b - verde.b) * normalized);
        } else {
            // Interpolación amarillo → rojo
            normalized = (mid - num) / (mid - min);
            r = Math.round(amarillo.r + (rojo.r - amarillo.r) * normalized);
            g = Math.round(amarillo.g + (rojo.g - amarillo.g) * normalized);
            b = Math.round(amarillo.b + (rojo.b - amarillo.b) * normalized);
        }
    }
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Calcular rangos para las columnas numéricas
function calculateColorRanges() {
    const ranges = {};
    const numericFields = getNumericFields();
    
    // Rank (menor es mejor - invertir)
    const ranks = numericFields.includes('rank') ? games.map(g => parseFloat(g.rank)).filter(v => !isNaN(v)) : [];
    ranges.rank = calculatePercentiles(ranks);
    ranges.rank.invertir = true;
    
    // Complejidad (1-5, menor = más fácil = verde)
    ranges.complejidad = { min: 1, mid: 2.5, max: 5, invertir: true };
    
    // Calificación (mayor es mejor)
    const calificaciones = numericFields.includes('calificacion') ? games.map(g => parseFloat(g.calificacion)).filter(v => !isNaN(v)) : [];
    ranges.calificacion = calculatePercentiles(calificaciones);
    ranges.calificacion.invertir = false;
    
    // Recomm players (neutral, usar escala)
    ranges.recomm_players = { min: 1, mid: 4, max: 8, invertir: false };
    
    // Max players (más = verde para grupos grandes)
    ranges.maxplayers = { min: 1, mid: 5, max: 10, invertir: false };
    
    // Min playtime (menor = más rápido = verde)
    const minPlaytimes = numericFields.includes('minplaytime') ? games.map(g => parseFloat(g.minplaytime)).filter(v => !isNaN(v)) : [];
    ranges.minplaytime = calculatePercentiles(minPlaytimes);
    ranges.minplaytime.invertir = true;
    
    // Max playtime (menor = más rápido = verde)
    const maxPlaytimes = numericFields.includes('maxplaytime') ? games.map(g => parseFloat(g.maxplaytime)).filter(v => !isNaN(v)) : [];
    ranges.maxplaytime = calculatePercentiles(maxPlaytimes);
    ranges.maxplaytime.invertir = true;
    
    // Min players (menor = más flexible = verde)
    ranges.minplayers = { min: 1, mid: 2, max: 4, invertir: true };
    
    return ranges;
}

let colorRanges = null;

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
        const rankColor = getGradientColor(game.rank, colorRanges.rank.min, colorRanges.rank.max, colorRanges.rank.invertir, colorRanges.rank.mid);
        const complejidadColor = getGradientColor(game.complejidad, colorRanges.complejidad.min, colorRanges.complejidad.max, colorRanges.complejidad.invertir, colorRanges.complejidad.mid);
        const calificacionColor = getGradientColor(game.calificacion, colorRanges.calificacion.min, colorRanges.calificacion.max, colorRanges.calificacion.invertir, colorRanges.calificacion.mid);
        const recommColor = getGradientColor(game.recomm_players, colorRanges.recomm_players.min, colorRanges.recomm_players.max, colorRanges.recomm_players.invertir, colorRanges.recomm_players.mid);
        const maxPlayersColor = getGradientColor(game.maxplayers, colorRanges.maxplayers.min, colorRanges.maxplayers.max, colorRanges.maxplayers.invertir, colorRanges.maxplayers.mid);
        const minPlaytimeColor = getGradientColor(game.minplaytime, colorRanges.minplaytime.min, colorRanges.minplaytime.max, colorRanges.minplaytime.invertir, colorRanges.minplaytime.mid);
        const maxPlaytimeColor = getGradientColor(game.maxplaytime, colorRanges.maxplaytime.min, colorRanges.maxplaytime.max, colorRanges.maxplaytime.invertir, colorRanges.maxplaytime.mid);
        const minPlayersColor = getGradientColor(game.minplayers, colorRanges.minplayers.min, colorRanges.minplayers.max, colorRanges.minplayers.invertir, colorRanges.minplayers.mid);
        
        // Colores para categorías
        const cat1Color = getCategoryColor(game.categoria);
        const cat2Color = getCategoryColor(game.categoria2);
        const cat3Color = getCategoryColor(game.categoria3);
        
        // Color para "Sé jugarlo"
        const seJugarColor = getSeJugarColor(game.se_jugar);
        
        // Formatear complejidad a 1 decimal
        const complejidadFormatted = isNaN(parseFloat(game.complejidad)) ? game.complejidad : parseFloat(game.complejidad).toFixed(1);
        
        // Función para mostrar categoría o GIF de GAMBLING
        const formatCategory = (cat) => {
            if (cat === 'GAMBLING') {
                return '<img src="https://media.tenor.com/xy2XPgbXW7cAAAAM/bumbur95-gamba.gif" alt="GAMBLING" class="gambling-gif">';
            }
            return cat || '';
        };
        
        row.innerHTML = `
            <td data-col="0"><strong style="font-size: 1.6em">${index + 1}</strong></td>
            <td data-col="1"><img src="${game.imagen}" alt="${game.juego}" class="game-thumbnail"></td>
            <td data-col="2"><strong style="font-size: 1.2em">${game.juego}</strong></td>
            <td data-col="3" style="background-color: ${rankColor}">${game.rank}</td>
            <td data-col="4" style="background-color: ${complejidadColor}">${complejidadFormatted}</td>
            <td data-col="5">${game.trata}</td>
            <td data-col="6" style="background-color: ${calificacionColor}">${game.calificacion}</td>
            <td data-col="7" style="background-color: ${recommColor}">${game.recomm_players}</td>
            <td data-col="8" style="background-color: ${maxPlayersColor}">${game.maxplayers}</td>
            <td data-col="9" style="background-color: ${minPlaytimeColor}">${game.minplaytime}</td>
            <td data-col="10" style="background-color: ${maxPlaytimeColor}">${game.maxplaytime}</td>
            <td data-col="11" style="background-color: ${minPlayersColor}">${game.minplayers}</td>
            <td data-col="12" data-category="${game.categoria}" style="background-color: ${cat1Color}">${formatCategory(game.categoria)}</td>
            <td data-col="13" data-category="${game.categoria2}" style="background-color: ${cat2Color}">${formatCategory(game.categoria2)}</td>
            <td data-col="14" data-category="${game.categoria3}" style="background-color: ${cat3Color}">${formatCategory(game.categoria3)}</td>
            <td data-col="15" style="background-color: ${seJugarColor}">${game.se_jugar}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Aplicar columnas ocultas y congeladas después de renderizar
    applyColumnVisibility();
    applyFrozenColumns();
}

// Ordenar tabla
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }
    
    const isNumeric = getNumericFields().includes(field);
    
    filteredGames.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        
        // N/A siempre al final
        const aIsNA = valA === 'N/A' || valA === '' || valA === null || valA === undefined;
        const bIsNA = valB === 'N/A' || valB === '' || valB === null || valB === undefined;
        
        if (aIsNA && bIsNA) return 0;
        if (aIsNA) return 1;  // A va al final
        if (bIsNA) return -1; // B va al final
        
        if (isNumeric) {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
            // Si después de parsear es NaN, tratar como N/A
            if (isNaN(valA)) return 1;
            if (isNaN(valB)) return -1;
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
    const numFilter = parseFloat(filterValue);
    if (isNaN(numFilter)) return true;
    
    const numGame = parseFloat(gameValue);
    // Si el valor del juego no es numérico (N/A, etc.), mostrarlo igual
    if (isNaN(numGame)) return true;
    
    switch (operator) {
        case '>=': return numGame >= numFilter;
        case '<=': return numGame <= numFilter;
        case '=': return numGame === numFilter;
        default: return true;
    }
}

// Aplicar filtros
function applyFilters() {
    const categoryFields = getCategoryFields().map(categoryField => categoryField.field);
    const filters = {
        rank: document.getElementById('filter-rank').value,
        rankOp: document.getElementById('filter-rank-op').dataset.value,
        complejidad: document.getElementById('filter-complejidad').value,
        complejidadOp: document.getElementById('filter-complejidad-op').dataset.value,
        minplayers: document.getElementById('filter-minplayers').value,
        minplayersOp: document.getElementById('filter-minplayers-op').dataset.value,
        maxplayers: document.getElementById('filter-maxplayers').value,
        maxplayersOp: document.getElementById('filter-maxplayers-op').dataset.value,
        maxplaytime: document.getElementById('filter-maxplaytime').value,
        maxplaytimeOp: document.getElementById('filter-maxplaytime-op').dataset.value,
        categoria: document.getElementById('filter-categoria').value.toLowerCase()
    };
    
    filteredGames = games.filter(game => {
        // Para categoría, buscar en las 3 columnas
        const matchesCategory = filters.categoria === '' || categoryFields.some(field => {
            const categoryValue = (game[field] || '').toLowerCase();
            return categoryValue === filters.categoria;
        });
        
        return (
            compareValues(game.rank, filters.rank, filters.rankOp) &&
            compareValues(game.complejidad, filters.complejidad, filters.complejidadOp) &&
            compareValues(game.minplayers, filters.minplayers, filters.minplayersOp) &&
            compareValues(game.maxplayers, filters.maxplayers, filters.maxplayersOp) &&
            compareValues(game.maxplaytime, filters.maxplaytime, filters.maxplaytimeOp) &&
            matchesCategory
        );
    });
    
    renderTable();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filter-rank').value = '';
    document.getElementById('filter-complejidad').value = '';
    document.getElementById('filter-minplayers').value = '';
    document.getElementById('filter-maxplayers').value = '';
    document.getElementById('filter-maxplaytime').value = '';
    document.getElementById('filter-categoria').value = '';
    
    // Resetear operadores a >=
    document.querySelectorAll('.filter-operator').forEach(button => {
        button.dataset.value = '>=';
        button.textContent = '≥';
        button.classList.remove('op-lte', 'op-eq');
        button.classList.add('op-gte');
    });
    
    // Resetear sliders a su valor mínimo
    document.querySelectorAll('.filter-slider').forEach(slider => {
        slider.value = slider.min;
    });
    
    filteredGames = [...games];
    sortTable('juego');
}

// Ciclar operador al hacer click
function cycleOperator(button) {
    const operators = ['>=', '<=', '='];
    const symbols = ['≥', '≤', '='];
    const currentValue = button.dataset.value;
    const currentIndex = operators.indexOf(currentValue);
    const nextIndex = (currentIndex + 1) % operators.length;
    
    button.dataset.value = operators[nextIndex];
    button.textContent = symbols[nextIndex];
    
    // Actualizar clase de color
    button.classList.remove('op-gte', 'op-lte', 'op-eq');
    switch (operators[nextIndex]) {
        case '>=': button.classList.add('op-gte'); break;
        case '<=': button.classList.add('op-lte'); break;
        case '=': button.classList.add('op-eq'); break;
    }
}

// Calcular rangos de sliders desde los datos
function calculateSliderRanges() {
    const sliderConfigs = getFilterConfigs().reduce((accumulator, filterConfig) => {
        accumulator[filterConfig.sliderId] = {
            field: filterConfig.field,
            step: filterConfig.step || (filterConfig.field === 'complejidad' ? 0.1 : 1),
            minOverride: filterConfig.minOverride,
            inputId: filterConfig.inputId
        };
        return accumulator;
    }, {});
    
    Object.keys(sliderConfigs).forEach(sliderId => {
        const config = sliderConfigs[sliderId];
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(config.inputId);
        if (!slider) return;
        
        // Obtener valores numéricos válidos
        const values = games
            .map(g => parseFloat(g[config.field]))
            .filter(v => !isNaN(v));
        
        if (values.length === 0) return;
        
        const min = config.minOverride !== undefined ? config.minOverride : Math.min(...values);
        const max = Math.max(...values);
        
        slider.min = min;
        slider.max = max;
        slider.step = config.step;
        slider.value = min;
        
        // Actualizar placeholder del input con el valor mínimo
        if (input) {
            input.placeholder = min;
        }
    });
}

async function loadJsonResource(url) {
    const inlineId = url === 'data/games.json' ? 'games-data' : url === 'data/categories.json' ? 'categories-data' : url === 'data/collection-config.json' ? 'collection-config-data' : null;
    if (inlineId) {
        const inlineScript = document.getElementById(inlineId);
        if (inlineScript && inlineScript.textContent.trim()) {
            return JSON.parse(inlineScript.textContent);
        }
    }

    if (window.location.protocol !== 'file:') {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.overrideMimeType('application/json');
        request.onload = () => {
            if (request.status === 0 || (request.status >= 200 && request.status < 300)) {
                try {
                    resolve(JSON.parse(request.responseText));
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error(`HTTP ${request.status}`));
            }
        };
        request.onerror = () => reject(new Error('Network error'));
        request.send();
    });
}

async function loadGames() {
    return loadJsonResource('data/games.json');
}

async function loadCollectionConfig() {
    try {
        const loadedConfig = await loadJsonResource('data/collection-config.json');
        collectionConfig = {
            ...cloneDefaultCollectionConfig(),
            ...loadedConfig,
            categoryFields: loadedConfig.categoryFields || defaultCollectionConfig.categoryFields,
            columns: loadedConfig.columns || defaultCollectionConfig.columns,
            filters: loadedConfig.filters || defaultCollectionConfig.filters,
            defaultHiddenColumns: loadedConfig.defaultHiddenColumns || defaultCollectionConfig.defaultHiddenColumns
        };
    } catch (error) {
        console.error('No se pudo cargar la configuración de la colección:', error);
        collectionConfig = cloneDefaultCollectionConfig();
    }
}

// Sincronizar slider con input
function syncSliderToInput(slider) {
    const targetId = slider.dataset.target;
    const input = document.getElementById(targetId);
    if (input) {
        input.value = slider.value;
        applyFilters();
    }
}

// Sincronizar input con slider
function syncInputToSlider(input) {
    const sliderId = 'slider-' + input.id.replace('filter-', '');
    const slider = document.getElementById(sliderId);
    if (slider && input.value !== '') {
        slider.value = input.value;
    }
}

// Poblar dropdown de categorías con valores únicos
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('filter-categoria');
    
    // Obtener todas las categorías únicas de las columnas configuradas
    const allCategories = new Set();
    games.forEach(game => {
        getCategoryFields().forEach(categoryField => {
            if (game[categoryField.field]) allCategories.add(game[categoryField.field]);
        });
    });
    
    // Ordenar alfabéticamente
    const sortedCategories = Array.from(allCategories).sort((a, b) => 
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
    
    // Agregar opciones al select
    sortedCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase();
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Event listeners
document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', () => {
        syncInputToSlider(input);
        applyFilters();
    });
});

// Event listener específico para el dropdown de categoría
document.getElementById('filter-categoria').addEventListener('change', applyFilters);

document.getElementById('clear-filters').addEventListener('click', clearFilters);

document.querySelectorAll('.filter-operator').forEach(button => {
    button.addEventListener('click', () => {
        cycleOperator(button);
        applyFilters();
    });
});

// Event listeners para sliders
document.querySelectorAll('.filter-slider').forEach(slider => {
    slider.addEventListener('input', () => syncSliderToInput(slider));
});

// Event listeners para ordenamiento
document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => sortTable(th.dataset.sort));
});

// ============ COLUMNAS OCULTAS ============
let hiddenColumns = new Set(defaultCollectionConfig.defaultHiddenColumns);

function applyCollectionConfigToUI() {
    const activeConfig = getActiveCollectionConfig();
    const title = activeConfig.collectionName || defaultCollectionConfig.collectionName;
    document.title = title;

    const pageTitle = document.querySelector('.container h1');
    if (pageTitle) {
        pageTitle.textContent = title;
    }

    document.querySelectorAll('#columns-options label').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        const columnIndex = parseInt(checkbox.dataset.col);
        const columnConfig = getColumnConfigByIndex(columnIndex);
        if (columnConfig) {
            checkbox.checked = !hiddenColumns.has(columnIndex);
            label.lastChild.textContent = ` ${columnConfig.label}`;
        }
    });

    document.querySelectorAll('#freeze-options label').forEach(label => {
        const radio = label.querySelector('input[type="radio"]');
        if (!radio) return;
        if (radio.value === '-1') {
            label.lastChild.textContent = ' Ninguna';
            return;
        }
        const columnConfig = getColumnConfigByIndex(parseInt(radio.value));
        if (columnConfig) {
            label.lastChild.textContent = ` ${columnConfig.freezeLabel || columnConfig.label}`;
        }
    });

    document.querySelectorAll('#games-table th[data-col]').forEach(th => {
        const columnIndex = parseInt(th.dataset.col);
        const columnConfig = getColumnConfigByIndex(columnIndex);
        if (!columnConfig) return;

        const baseLabel = columnConfig.label;
        if (th.classList.contains('sortable')) {
            th.textContent = `${baseLabel} ↕`;
        } else {
            th.textContent = baseLabel;
        }
    });
}

function applyColumnVisibility() {
    const table = document.getElementById('games-table');
    const allCells = table.querySelectorAll('th, td');
    
    allCells.forEach(cell => {
        const col = cell.dataset.col;
        if (col !== undefined) {
            cell.style.display = hiddenColumns.has(parseInt(col)) ? 'none' : '';
        }
    });
}

function toggleColumnVisibility(colIndex, visible) {
    if (visible) {
        hiddenColumns.delete(colIndex);
    } else {
        hiddenColumns.add(colIndex);
    }
    applyColumnVisibility();
}

// Panel de columnas
document.getElementById('toggle-columns-panel').addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById('columns-options');
    const freezePanel = document.getElementById('freeze-options');
    freezePanel.style.display = 'none';
    panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
});

// Panel de congelar
document.getElementById('toggle-freeze-panel').addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById('freeze-options');
    const columnsPanel = document.getElementById('columns-options');
    columnsPanel.style.display = 'none';
    panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
});

// Cerrar paneles al hacer click fuera
document.addEventListener('click', (e) => {
    const columnsPanel = document.getElementById('columns-options');
    const freezePanel = document.getElementById('freeze-options');
    const columnsBtn = document.getElementById('toggle-columns-panel');
    const freezeBtn = document.getElementById('toggle-freeze-panel');
    
    if (!columnsPanel.contains(e.target) && e.target !== columnsBtn) {
        columnsPanel.style.display = 'none';
    }
    if (!freezePanel.contains(e.target) && e.target !== freezeBtn) {
        freezePanel.style.display = 'none';
    }
});

// Checkboxes de columnas - con stopPropagation para evitar activar encabezados
document.querySelectorAll('#columns-options input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        const colIndex = parseInt(checkbox.dataset.col);
        toggleColumnVisibility(colIndex, checkbox.checked);
    });
});

// Prevenir que clicks en el panel de columnas se propaguen
document.getElementById('columns-options').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Prevenir que clicks en el panel de congelar se propaguen
document.getElementById('freeze-options').addEventListener('click', (e) => {
    e.stopPropagation();
});

// ============ COLUMNAS CONGELADAS ============
let frozenUpTo = -1; // Índice de la última columna congelada (-1 = ninguna)

function applyFrozenColumns() {
    const table = document.getElementById('games-table');
    const rows = table.querySelectorAll('tr');
    
    // Primero calcular anchos de columnas visibles
    const colWidths = [];
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    
    headerCells.forEach((th, i) => {
        if (!hiddenColumns.has(i)) {
            colWidths[i] = th.offsetWidth;
        }
    });
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        let leftPos = 0;
        
        cells.forEach((cell, i) => {
            const colIndex = parseInt(cell.dataset.col);
            if (colIndex === undefined || hiddenColumns.has(colIndex)) return;
            
            // Limpiar clases previas
            cell.classList.remove('frozen', 'frozen-border');
            cell.style.left = '';
            
            if (colIndex <= frozenUpTo) {
                cell.classList.add('frozen');
                cell.style.left = leftPos + 'px';
                
                if (colIndex === frozenUpTo) {
                    cell.classList.add('frozen-border');
                }
            }
            
            leftPos += colWidths[colIndex] || 0;
        });
    });
}

function freezeUpToColumn(colIndex) {
    frozenUpTo = colIndex;
    applyFrozenColumns();
}

// Event listeners para radio buttons de congelar
document.querySelectorAll('input[name="freeze-col"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const colIndex = parseInt(radio.value);
        freezeUpToColumn(colIndex);
    });
});

// Poblar modal de descripciones
function populateCategoryDescriptions() {
    const container = document.getElementById('category-descriptions');
    
    // Obtener todas las categorías ordenadas
    const allCategories = new Set();
    games.forEach(game => {
        getCategoryFields().forEach(categoryField => {
            if (game[categoryField.field]) allCategories.add(game[categoryField.field]);
        });
    });
    
    const sortedCategories = Array.from(allCategories).sort((a, b) => 
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
    
    container.innerHTML = sortedCategories.map(cat => {
        const info = categoryDescriptions[cat];
        if (!info) {
            return `
                <div class="category-item">
                    <div class="category-name">${cat}</div>
                    <div class="category-desc">Descripción no disponible.</div>
                </div>
            `;
        }
        return `
            <div class="category-item">
                <div class="category-name">${cat}</div>
                <div class="category-desc">${info.desc}</div>
                <div class="category-ejemplo"><strong>💡 Ejemplo:</strong> ${info.ejemplo}</div>
            </div>
        `;
    }).join('');
}

// Mostrar/ocultar modal
document.getElementById('btn-category-help').addEventListener('click', () => {
    document.getElementById('category-modal').style.display = 'flex';
});

document.getElementById('close-category-modal').addEventListener('click', () => {
    document.getElementById('category-modal').style.display = 'none';
});

document.getElementById('category-modal').addEventListener('click', (e) => {
    if (e.target.id === 'category-modal') {
        document.getElementById('category-modal').style.display = 'none';
    }
});

// Tooltip para categorías en la tabla
const tooltip = document.getElementById('category-tooltip');
let tooltipTimeout;

function showCategoryTooltip(e, category) {
    const info = categoryDescriptions[category];
    if (!category || !info) return;
    
    clearTimeout(tooltipTimeout);
    
    tooltip.innerHTML = `
        <div class="category-name">${category}</div>
        <div class="category-desc">${info.desc}</div>
        <div class="category-ejemplo"><strong>💡</strong> ${info.ejemplo}</div>
    `;
    
    // Posicionar tooltip
    const rect = e.target.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 8;
    
    // Ajustar si se sale de la pantalla
    if (left + 280 > window.innerWidth) {
        left = window.innerWidth - 290;
    }
    if (top + 150 > window.innerHeight) {
        top = rect.top - 8;
        tooltip.style.transform = 'translateY(-100%)';
    } else {
        tooltip.style.transform = 'none';
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.display = 'block';
}

function hideCategoryTooltip() {
    tooltipTimeout = setTimeout(() => {
        tooltip.style.display = 'none';
    }, 200);
}

// Delegación de eventos para celdas de categoría
document.getElementById('games-tbody').addEventListener('click', (e) => {
    const cell = e.target.closest('td[data-category]');
    if (cell) {
        const category = cell.dataset.category;
        if (category) {
            showCategoryTooltip(e, category);
        }
    }
});

// Cerrar tooltip al hacer click fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('td[data-category]') && !e.target.closest('.category-tooltip')) {
        tooltip.style.display = 'none';
    }
});

// ============ PANEL DE INSTRUCCIONES ============
function toggleInstructions(e) {
    e.preventDefault();
    e.stopPropagation();
    const panel = document.getElementById('instructions-panel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
}

function closeInstructions(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('instructions-panel').style.display = 'none';
}

const instructionsBtn = document.getElementById('btn-instructions');
instructionsBtn.addEventListener('click', toggleInstructions);
instructionsBtn.addEventListener('touchend', toggleInstructions);

const closeInstructionsBtn = document.getElementById('close-instructions');
closeInstructionsBtn.addEventListener('click', closeInstructions);
closeInstructionsBtn.addEventListener('touchend', closeInstructions);

async function loadCategoryDescriptions() {
    try {
        const activeConfig = getActiveCollectionConfig();
        if (activeConfig.categoryDescriptions) {
            categoryDescriptions = activeConfig.categoryDescriptions;
            return;
        }

        categoryDescriptions = await loadJsonResource('data/categories.json');
    } catch (error) {
        console.error('No se pudieron cargar las descripciones de categorías:', error);
        categoryDescriptions = {};
    }
}

// Inicializar sliders, dropdown de categorías y ordenar por Juego al cargar
(async function init() {
    await loadCollectionConfig();

    try {
        games = await loadGames();
    } catch (error) {
        console.error('No se pudieron cargar los juegos:', error);
        games = [];
    }

    hiddenColumns = new Set(getActiveCollectionConfig().defaultHiddenColumns || defaultCollectionConfig.defaultHiddenColumns);
    filteredGames = [...games];
    colorRanges = calculateColorRanges();
    await loadCategoryDescriptions();
    applyCollectionConfigToUI();
    calculateSliderRanges();
    populateCategoryDropdown();
    populateCategoryDescriptions();
    sortTable('juego');
})();
