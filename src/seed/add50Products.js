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

async function addProducts() {

    const products = [];

    for(let i=0;i<50;i++){

        products.push({
            name: faker.commerce.productName(),
            category: faker.helpers.arrayElement(categories),
            price: Number(faker.commerce.price())
        });

    }

    await prisma.product.createMany({
        data: products
    });

    console.log("50 products inserted");

}

addProducts()
.then(async ()=>{
    await prisma.$disconnect();
});