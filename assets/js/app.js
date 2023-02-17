// Boton de el carrito

const carButton = document.querySelector(".car__toggle");
const nav = document.querySelector(".car__block");
const apiURL = "https://academlo-api-production.up.railway.app/api";
const productsList = document.querySelector("#products-container");
// Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
let carProducts = [];
// boton Empty car

const emptyCar = document.querySelector(".empty__button");


// Algoritmo para mostrar carrito
carButton.addEventListener("click", () => {
    nav.classList.toggle("nav__car__visible");
})

//! Listeners

eventListenersLoader();

function eventListenersLoader() {
    //se ejecuta cuando se presiona el boton "Add to car"
    productsList.addEventListener("click", addingProduct);

    car.addEventListener("click", deleteproduct);

    document.addEventListener('DOMContentLoaded', () => {
        carProducts = JSON.parse(localStorage.getItem('car')) || [];
        carElementsHTML();
    })
}


// Peticion GET
const getProducts = () => {
    axios.get(`${apiURL}/products`)
        .then((response) => {
            const products = response.data;
            printProductsOnScreen(products);
            // console.log(products[0])
        })
        .catch((error) => {
            console.log(error);
        })

}
getProducts();

// pintando sobre la pagina
const printProductsOnScreen = (products) => {
    let html = "";
    for (let i = 0; i < products.length; i++) {
        html += `
        <div class="product__container">

            <div class="product__container__img">

                <img src="${products[i].images.image1}" alt="product image">

            </div>

            <div class="product__container__name">

                <p>${products[i].name}</p>

            </div>

            <div class="product__container__price">

                <p>${products[i].price.toFixed(2)} USD</p>

            </div>

            <div class="product__container__button">

                <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>

            </div>

        </div>
        `;

    }
    productsList.innerHTML = html;
}

// Agregando productos al carrito.

// 1 capturando la informacion de el producto al que se le da click

function addingProduct(e) {
    if (e.target.classList.contains("add__to__car")) {
        const product = e.target.parentElement.parentElement;
        carProductsElement(product)
    }
}


//2 transformando la informacion HTML en un array de objetos

function carProductsElement(product) {
    const inforProduct = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector(".product__container__name p").textContent,
        price: product.querySelector(".product__container__price p").textContent,
        quantity: 1
    }

    //agregar contador
    if (carProducts.some(product => product.id === inforProduct.id)) {
        const product = carProducts.map(product => {
            if (product.id === inforProduct.id) {
                product.quantity++;
                return product;
            } else {
                return product;
            }
        })
        carProducts = [...product]
    } else {
        carProducts = [...carProducts, inforProduct]
    }
    carElementsHTML();
}

//3 pintar los productos dentro de el carrito

function carElementsHTML() {

    carList.innerHTML = "";

    carProducts.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="car__product">

        <div class="car__product__image">

            <img src="${product.image}" alt="">

        </div>

        <div class="car__product__description">

            <div>

                <p>${product.name}</p>

            </div>

            <div>

                <p>Precio: ${product.price}</p>

            </div>

            <div>

                <p>Cantidad: ${product.quantity}</p>

            </div>

            <div class="car__product__button">

                <button class="delete__product" data-id="${product.id}">Delete</button>

            </div>

        </div>

    </div>

    <hr>
        `;
        carList.appendChild(div);
        console.log(carList);
    })
    productsStorage();
}

// Eliminar productos de el carrito


emptyCar.addEventListener("click", () => {
    carList.innerHTML = "";
    carProducts = [];
})

function deleteproduct(e) {
    if (e.target.classList.contains("delete__product")) {
        const productId = e.target.getAttribute("data-id");
        carProducts = carProducts.filter(product => product.id !== productId);
        carElementsHTML();
    }
}

// Local Storage

function productsStorage() {
    localStorage.setItem("car", JSON.stringify(carProducts));
}