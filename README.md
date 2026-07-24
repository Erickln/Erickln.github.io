# 🎲 Colección de Juegos de Mesa

Una aplicación web interactiva para explorar, filtrar y gestionar una colección personal de juegos de mesa. Diseñada con un enfoque en usabilidad móvil y visualización intuitiva de datos.

## 📋 Descripción

Este proyecto es un catálogo visual de juegos de mesa que permite a los usuarios explorar información detallada sobre cada juego, incluyendo:

- **Ranking** en BoardGameGeek
- **Complejidad** del juego (escala 1-5)
- **Número de jugadores** (mínimo, máximo y recomendado)
- **Tiempo de partida** estimado
- **Categorías** y mecánicas del juego
- **Descripción** resumida de cada juego
- **Estado de conocimiento** (si el usuario sabe jugarlo o no)

## 🎯 Objetivo

Facilitar la selección de juegos de mesa según las necesidades del momento:
- ¿Cuántos jugadores somos?
- ¿Cuánto tiempo tenemos?
- ¿Qué nivel de complejidad buscamos?
- ¿Qué tipo de juego queremos?

## ✨ Características

### 🔍 Sistema de Filtros Avanzados
- Filtros numéricos con operadores configurables (≥, ≤, =)
- Sliders intuitivos para ajustar valores
- Filtro por categoría de juego
- Botón para limpiar todos los filtros

### 📊 Tabla Interactiva
- **Ordenamiento**: Clic en cualquier columna para ordenar ascendente/descendente
- **Columnas personalizables**: Oculta/muestra las columnas que necesites
- **Congelación de columnas**: Fija columnas a la izquierda para facilitar el scroll horizontal
- **Código de colores**: Visualización por gradiente (verde → amarillo → rojo) según métricas

### 🎨 Sistema de Colores
| Métrica | Verde (Mejor) | Rojo (Peor) |
|---------|---------------|-------------|
| Rank | Menor número | Mayor número |
| Complejidad | Más simple | Más complejo |
| Calificación | Mayor puntuación | Menor puntuación |
| Tiempo | Partidas cortas | Partidas largas |

### 📱 Diseño Responsivo
- Optimizado para dispositivos móviles
- Modo oscuro por defecto
- Interfaz táctil amigable

### ℹ️ Información Adicional
- Tooltips con descripción de categorías
- Panel de instrucciones integrado
- Indicador visual de "Sé jugarlo" (verde = sí, rojo = no)

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones (variables CSS, flexbox, grid)
- **JavaScript Vanilla** - Lógica de la aplicación (sin dependencias externas)

## 📁 Estructura del Proyecto

```
├── index.html      # Estructura principal de la página
├── styles.css      # Estilos y diseño responsivo
├── script.js       # Lógica de filtros, ordenamiento y renderizado
├── games.json      # Base de datos de juegos (array JSON)
├── README.md       # Documentación del proyecto
└── LICENSE         # Licencia del proyecto
```

## 🚀 Uso

1. Abre el archivo `index.html` en cualquier navegador moderno
2. O visita la página desplegada en GitHub Pages

### Cómo usar los filtros:
1. Ajusta los valores usando los campos numéricos o sliders
2. Cambia el operador de comparación (≥, ≤, =) haciendo clic en el botón
3. Selecciona una categoría del menú desplegable
4. Los resultados se actualizan automáticamente

### Cómo personalizar la vista:
1. Clic en **⚙️ Columnas** para mostrar/ocultar columnas
2. Clic en **❄️ Congelar** para fijar columnas al hacer scroll
3. Clic en cualquier encabezado con ↕ para ordenar

## 📝 Agregar Nuevos Juegos

Para agregar juegos, edita el archivo `games.json` siguiendo esta estructura:

```javascript
{
    "juego": "Nombre del Juego",
    "imagen": "URL de la imagen (150x150 recomendado)",
    "rank": "Posición en BGG",
    "complejidad": "1.000 - 5.000",
    "trata": "Descripción breve del juego",
    "calificacion": "Puntuación en BGG",
    "recomm_players": "Número de jugadores recomendado",
    "maxplayers": "Máximo de jugadores",
    "minplaytime": "Tiempo mínimo en minutos",
    "maxplaytime": "Tiempo máximo en minutos",
    "minplayers": "Mínimo de jugadores",
    "categoria": "Categoría principal",
    "categoria2": "Categoría secundaria",
    "categoria3": "Categoría terciaria",
    "se_jugar": "Sí / No"
}
```

## 🎮 Categorías Disponibles

- **Estrategia** - Juegos que requieren planificación a largo plazo
- **Cooperativo** - Todos los jugadores trabajan juntos
- **Colocación de Decks** - Construye tu mazo durante la partida
- **Deducción Social** - Roles ocultos y engaño
- **Familiar** - Accesibles para toda la familia
- **Fiesta** - Juegos sociales y divertidos
- **Dados** - Mecánica principal de dados
- Y muchas más...

## 🌐 Demo

Este proyecto está desplegado en GitHub Pages y puede ser visitado directamente desde el repositorio.

## 📄 Licencia

Este proyecto está bajo la licencia incluida en el archivo [LICENSE](LICENSE).

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes sugerencias para mejorar esta aplicación:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

Hecho con ❤️ para los amantes de los juegos de mesa