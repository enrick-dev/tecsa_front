// URL base do seu backend
const BASE_URL = 'http://localhost:3000/api/products';

function renderProducts(products, isLoading = false) {
  const productsList = document.getElementById('productsList');
  productsList.innerHTML = '';

  if (isLoading) {
    Array.from({ length: 20 }, () => {
      const productCard = document.createElement('div');
      productCard.className =
        'border border-gray-200 rounded-lg h-[314px] p-4 rounded shadow transition bg-gray-200';

      productsList.appendChild(productCard);
    });
    return;
  }

  if (products.length === 0) {
    productsList.innerHTML = `<p class="col-span-full">Nenhum produto encontrado.</p>`;
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className =
      'bg-white border border-gray-100 rounded-lg p-4 rounded shadow transition';

    productCard.innerHTML = `
      <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
      <h2 class="text-xl font-semibold mt-2">${product.name}</h2>
      <p class="text-gray-600">${product.desc || ''}</p>
      <div class="flex justify-between gap-2 items-center mt-3">
        <p class="font-medium">${product.pricing.price_usd}</p>
        <p class="text-xs text-gray-500" >${product.category}</p>
      </div>
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

    renderProducts([], true);
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
