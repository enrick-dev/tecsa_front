// URL base do seu backend
const BASE_URL = 'http://localhost:3000/api/products';

function renderProducts(products) {
  const productsList = document.getElementById('productsList');
  productsList.innerHTML = '';

  if (products.length === 0) {
    productsList.innerHTML = `<p class="col-span-full">Nenhum produto encontrado.</p>`;
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className =
      'bg-white border border-gray-100 rounded-lg p-4 rounded shadow hover:shadow-lg transition';

    productCard.innerHTML = `
      <h2 class="text-xl font-semibold mb-2">${product.name}</h2>
      <p class="text-gray-600">${product.description || ''}</p>
    `;

    productsList.appendChild(productCard);
  });
}

async function fetchProducts(keyword = '', cep = '') {
  try {
    let url = BASE_URL;
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (cep) params.append('cep', cep);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar produtos');
    const data = await response.json();

    renderProducts(data);
  } catch (error) {
    console.error(error);
    alert('Houve um problema ao buscar os produtos.');
  }
}

document.getElementById('filterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const keyword = document.getElementById('keyword').value.trim();
  const cep = document.getElementById('cep').value.trim();
  fetchProducts(keyword, cep);
});

fetchProducts();
