const prisma = require("../config/prisma");

const getProducts = async (req, res) => {
    try {

        const limit = 20;

        const {
            cursorId,
            cursorUpdatedAt,
            category
        } = req.query;

        let products;

        // First page
        if (!cursorId || !cursorUpdatedAt) {

            products = await prisma.product.findMany({
                where: category
                    ? { category }
                    : {},
                orderBy: [
                    {
                        updated_at: "desc"
                    },
                    {
                        id: "desc"
                    }
                ],
                take: limit
            });

        }
        else {

            products = await prisma.product.findMany({

                where: {
                    ...(category
                        ? { category }
                        : {}),

                    OR: [

                        {
                            updated_at: {
                                lt: new Date(cursorUpdatedAt)
                            }
                        },

                        {
                            updated_at: new Date(cursorUpdatedAt),

                            id: {
                                lt: cursorId
                            }
                        }

                    ]
                },

                orderBy: [
                    {
                        updated_at: "desc"
                    },
                    {
                        id: "desc"
                    }
                ],

                take: limit

            });

        }

        const lastProduct = products[products.length - 1];

        res.json({

            products,

            nextCursor: lastProduct
                ? {
                    cursorId: lastProduct.id,
                    cursorUpdatedAt: lastProduct.updated_at
                }
                : null

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }
};

module.exports = {
    getProducts
};