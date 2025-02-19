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
    const productsResponse = await axios.get(process.env.PRODUCTS_API_URL, {
      headers: {
        Authorization: process.env.PRODUCTS_API_KEY,
      },
    });

    const products = await Promise.all(
      productsResponse.data.items.map(async (product) => {
        if (product.cep) {
          const cep = product.cep.replace(/\D/g, '');
          try {
            const cepResponse = await axios.get(
              `${process.env.CEP_API_URL}/${cep}/json/`,
            );
            product.state = cepResponse.data.uf;
          } catch (error) {
            product.state = null;
          }
        }
        return product;
      }),
    );

    return res.json(products);
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
