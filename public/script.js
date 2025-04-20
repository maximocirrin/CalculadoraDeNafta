const API_URL = "https://calculadoradenafta.onrender.com/api/precios";

const preciosContainer = document.getElementById("precios");
const calcularBtn = document.getElementById("calcular");
const resultadoDiv = document.getElementById("resultado");

let precios = {};

async function obtenerPrecios() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    precios = data;
    mostrarPrecios(data);
  } catch (error) {
    preciosContainer.innerHTML = "Error al obtener precios de combustibles.";
    console.error("Error al obtener precios:", error);
  }
}

function mostrarPrecios(data) {
  preciosContainer.innerHTML = "<h3>Precios actuales:</h3>";
  for (const [tipo, precio] of Object.entries(data)) {
    const p = document.createElement("p");
    p.textContent = `${tipo}: $${precio} por litro`;
    preciosContainer.appendChild(p);
  }
}

calcularBtn.addEventListener("click", () => {
  const kms = parseFloat(document.getElementById("kms").value);
  const consumo = parseFloat(document.getElementById("consumo").value) || 11;
  const tipo = document.getElementById("tipo").value;

  if (isNaN(kms) || kms <= 0 || !precios[tipo]) {
    resultadoDiv.textContent = "Por favor completá todos los datos correctamente.";
    return;
  }

  const litros = (kms / 100) * consumo;
  const costo = litros * precios[tipo];
  resultadoDiv.textContent = `Vas a gastar aproximadamente $${costo.toFixed(2)} (${litros.toFixed(1)} litros).`;
});

obtenerPrecios();
