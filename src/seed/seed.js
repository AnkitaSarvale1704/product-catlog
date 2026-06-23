const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Sports",
  "Furniture",
  "Beauty",
  "Toys",
  "Food"
];

async function seedProducts() {

  const batchSize = 1000;
  const totalProducts = 200000;

  for (let i = 0; i < totalProducts; i += batchSize) {

    const products = [];

    for (let j = 0; j < batchSize; j++) {

      products.push({
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: Number(faker.commerce.price())
      });

    }

    await prisma.product.createMany({
      data: products
    });

    console.log(`Inserted ${i + batchSize} products`);
  }

  console.log("Done!");
}

seedProducts()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });