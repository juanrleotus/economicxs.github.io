// Datos de ejemplo (podés reemplazar por datos reales)
const noticias = [
    {
        titulo: "Inflación: nuevos datos del INDEC",
        resumen: "El índice mensual muestra variaciones importantes en alimentos y transporte.",
        imagen: "https://picsum.photos/600/400?random=1"
    },
    {
        titulo: "Dólar hoy: cómo cerró la jornada",
        resumen: "El mercado cambiario tuvo movimientos moderados con tendencia estable.",
        imagen: "https://picsum.photos/600/400?random=2"
    },
    {
        titulo: "Salarios: actualización trimestral",
        resumen: "Los ingresos reales muestran señales mixtas según el sector.",
        imagen: "https://picsum.photos/600/400?random=3"
    }
];

const grid = document.getElementById("news-grid");

noticias.forEach(nota => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${nota.imagen}" alt="">
        <div class="card-content">
            <h3>${nota.titulo}</h3>
            <p>${nota.resumen}</p>
        </div>
    `;

    grid.appendChild(card);
});
