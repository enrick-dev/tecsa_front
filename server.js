import 'dotenv/config';
import axios from 'axios';
import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Service {
  async findProducts(req, res) {
    const cep = req.query.cep || '';
    const keyword = req.query.keyword || '';

    const productsResponse = await axios.get(process.env.PRODUCTS_API_URL, {
      ...(keyword && { params: { keyword } }),
      headers: {
        Authorization: process.env.PRODUCTS_API_KEY,
      },
    });

    const stateByUser = await (async () => {
      try {
        if (!cep) throw new Error();
        const cepResponse = await axios.get(
          `${process.env.CEP_API_URL}/${cep}/json/`,
        );
        return cepResponse.data.uf;
      } catch (error) {
        return null;
      }
    })();

    const products = await Promise.all(
      productsResponse.data.items.map(async (product) => {
        if (product.cep) {
          const productCep = product.cep.replace(/\D/g, '');
          try {
            const cepResponse = await axios.get(
              `${process.env.CEP_API_URL}/${productCep}/json/`,
            );
            return {
              ...product,
              state: cepResponse.data.uf,
            };
          } catch (error) {
            return {
              ...product,
              state: null,
            };
          }
        }
        return product;
      }),
    );

    const filteredProducts = products.filter(
      ({ state }) => state == stateByUser,
    );

    return res.json(cep ? filteredProducts : products);
  }
}

const service = new Service();

app.get('/api/products', async (req, res) => {
  return service.findProducts(req, res);
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
