document.addEventListener('DOMContentLoaded', async () => {
    const resultado = document.getElementById('resultado');
    const preciosContainer = document.getElementById('precios');
    let precios;

    try {
    const res = await fetch('http://localhost:3000/api/precios');
    precios = await res.json();

    // Mostrar precios en la interfaz
    const lista = document.createElement('ul');
    Object.entries(precios).forEach(([tipo, precio], index) => {
      if (typeof precio !== 'number') { // Check if it's not a number
        precio = parseFloat(precio);     // Attempt to convert it to a number
        if (isNaN(precio)) {             // Verify that the conversion was successful
          console.error("Error: precio no es un numero en la posicion", index, "con valor",precio); //Log the error
          return; // Skip to the next element
        }
      }

      const item = document.createElement('li');
      precio = precio.toFixed(2); // Now you can safely call toFixed()
      item.textContent = `${tipo}: $${precio}`;
      lista.appendChild(item);
    });
    preciosContainer.innerHTML = '<h2>Precios actuales</h2>';
    preciosContainer.appendChild(lista);
    } catch (err) {
    console.error('Error al cargar precios:', err);
    preciosContainer.textContent = 'No se pudieron cargar los precios. Intenta más tarde.';
    return;
    }

    document.getElementById('fuel-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const km = parseFloat(document.getElementById('km').value);
    const consumo = parseFloat(document.getElementById('consumo').value);
    const tipo = document.getElementById('combustible').value;

    if (isNaN(km) || isNaN(consumo) || km <= 0 || consumo <= 0) {
        resultado.textContent = 'Por favor, ingresa valores válidos.';
        return;
    }

    const litrosNecesarios = (km * consumo) / 100;
    const precioLitro = precios[tipo];
    const costoTotal = litrosNecesarios * precioLitro;

    resultado.textContent = `Costo estimado: $${costoTotal.toFixed(2)}`;
    });
});