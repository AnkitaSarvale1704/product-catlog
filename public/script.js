const productsContainer = document.getElementById("products");

const categorySelect = document.getElementById("category");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");


let cursorId = null;
let cursorUpdatedAt = null;

let cursorHistory = [];


async function fetchProducts() {

    try {

        let url = "/products";

        const params = new URLSearchParams();

        const category = categorySelect.value;

        if (category) {
            params.append("category", category);
        }

        if (cursorId && cursorUpdatedAt) {

            params.append("cursorId", cursorId);

            params.append("cursorUpdatedAt", cursorUpdatedAt);

        }

        if (params.toString()) {

            url += "?" + params.toString();

        }

        const response = await fetch(url);

        const data = await response.json();

        productsContainer.innerHTML = "";

        data.products.forEach(product => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <h3>${product.name}</h3>

                <p><strong>Category:</strong> ${product.category}</p>

                <p><strong>Price:</strong> ₹${product.price}</p>
            `;

            productsContainer.appendChild(card);

        });


        if (data.nextCursor) {

            nextBtn.disabled = false;

            nextBtn.dataset.cursorId =
                data.nextCursor.cursorId;

            nextBtn.dataset.cursorUpdatedAt =
                data.nextCursor.cursorUpdatedAt;

        }
        else {

            nextBtn.disabled = true;

        }


    }

    catch (error) {

        console.error(error);

    }

}


fetchProducts();



nextBtn.addEventListener("click", () => {

    if (nextBtn.dataset.cursorId) {

        cursorHistory.push({

            cursorId,
            cursorUpdatedAt

        });

        prevBtn.disabled = false;

        cursorId = nextBtn.dataset.cursorId;

        cursorUpdatedAt =
            nextBtn.dataset.cursorUpdatedAt;

        fetchProducts();

    }

});



prevBtn.addEventListener("click", () => {

    if (cursorHistory.length === 0)
        return;

    const previousPage = cursorHistory.pop();

    cursorId = previousPage.cursorId;

    cursorUpdatedAt = previousPage.cursorUpdatedAt;

    fetchProducts();

    if (cursorHistory.length === 0) {

        prevBtn.disabled = true;

    }

});



categorySelect.addEventListener("change", () => {

    cursorId = null;

    cursorUpdatedAt = null;

    cursorHistory = [];

    prevBtn.disabled = true;

    fetchProducts();

});