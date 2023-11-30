import axios from 'axios';
const { VITE_API_PATH } = import.meta.env;
const productSelect = document.querySelector('[data-product-select]');

const form = document.querySelector('[data-order-form]');
const paymentSelect = document.querySelector('form[data-order-form] select');
const inputs = document.querySelectorAll('[data-order-form] input');

const submitBtn = document.querySelector(
  '[data-order-form] button[type=submit]'
);
const productList = document.querySelector('[data-product-list]');
const cartsSection = document.querySelector('[data-cart-list]');
const deleteAllBtn = document.querySelector('[data-delete-all-cart');
let productData;

function disableSubmitBtn() {
  if (![...inputs].every((item) => item.value) || !paymentSelect.value) {
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
}

function makeConfirmToast() {
  Swal.bindClickHandler();

  Swal.mixin({
    toast: true,
    confirmButtonText: '確定',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: () => deleteAllCarts(deleteAllBtn),
  }).bindClickHandler('data-swal-toast-template');
}
makeConfirmToast();

form.addEventListener('input', disableSubmitBtn);
function createOrder(e) {
  e.preventDefault();
  const inputsValue = [...inputs].map((item) => item.value);
  const newData = {
    data: {
      user: {
        name: inputsValue[0],
        tel: inputsValue[1],
        email: inputsValue[2],
        address: inputsValue[3],
        payment: paymentSelect.value,
      },
    },
  };
  const orderToast = Swal.mixin({
    toast: true,
  });
  orderToast.fire({
    title: '訂單資訊如下',
    html: `<ul><li>姓名：${inputsValue[0]}</li>
    <li>電話：${inputsValue[1]}</li>
    <li>email：${inputsValue[2]}</li>
    <li>寄送地址：${inputsValue[3]}</li>
    <li>交易方式：${paymentSelect.value}</li>
    `,
    confirmButtonText: '確定',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    confirmButtonColor: 'rgba(48, 30, 95, 1)',
    preConfirm: () => {
      postOrder(newData);
      form.reset();
      disableSubmitBtn();
    },
  });
}

form.addEventListener('submit', createOrder);

productSelect.addEventListener('change', (e) => {
  productSelect.disabled = true;
  const filterData =
    e.target.value === ''
      ? productData
      : productData.filter((item) => item.category === e.target.value);

  renderProducts(filterData);

  productSelect.disabled = false;
});

function showError(e) {
  if (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'SELECT') return;
  if (!e.target.value) {
    e.target.nextElementSibling.classList.add('visible');
  } else {
    e.target.nextElementSibling.classList.remove('visible');
  }
}
form.addEventListener('blur', showError, true);
document.addEventListener('DOMContentLoaded', function () {
  const ele = document.querySelector('.recommendation-wall');
  ele.style.cursor = 'grab';
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  const mouseDownHandler = function (e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';

    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };
  const mouseUpHandler = function () {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  ele.addEventListener('mousedown', mouseDownHandler);

  disableSubmitBtn();
});

let menuOpenBtn = document.querySelector('[data-menu-toggle]');
let menu = document.querySelector('.nav-menu');
menuOpenBtn.addEventListener('click', menuToggle);

menu.addEventListener('click', (e) => {
  if (e.target.nodeName === 'A') {
    closeMenu();
  }
});

function menuToggle() {
  if (menu.classList.contains('open-menu')) {
    menu.classList.remove('open-menu');
  } else {
    menu.classList.add('open-menu');
  }
}
function closeMenu() {
  menu.classList.remove('open-menu');
}

function formatPrice(price) {
  const num_parts = price.toString().split('.');
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return num_parts.join('.');
}
function renderProducts(filterData) {
  let str = '';
  if (!filterData.length) {
    str = `<div class="text-center">
    <h3 class="text-3xl font-medium mb-6 text-secondary-600">無資料</h3>
    
  </div>`;
  } else {
    str = `<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${filterData
      .map(
        (item) =>
          `
          <li class="relative card-hover" data-product-id=${item.id}>
          <div
            class="absolute top-5 -right-1 bg-black text-white py-2 px-6 z-10"
          >
            新品
          </div>
          <div class="overflow-hidden">
            <img
              class="w-full transition-all"
              src="${item.images}"
              alt="${item.title}"
              height="302"
            />
          </div>

          <button
            type="button"
            class="bg-black w-full text-white text-center py-3 mb-2"
          >
            加入購物車
          </button>
          <h3 class="text-xl mb-2">${item.title}</h3>
          <del class="text-xl">NT$${formatPrice(item.origin_price)}</del>
          <p class="text-3xl">NT$${formatPrice(item.price)}</p>
        </li>`
      )
      .join('')}</ul>`;
  }
  productList.innerHTML = str;
}
function renderCarts(data) {
  const { carts, total, finalTotal, status } = data;
  let str = '';
  if (!carts.length) {
    str = `
    <h3 class="text-3xl font-medium mb-6 text-secondary-600 text-center">無加入購物車商品</h3>
  `;
    form.classList.add('max-h-0', 'overflow-hidden');
  } else {
    str = `<table
    class="table w-5/6 mx-auto text-xl whitespace-nowrap min-w-[900px]"
  >
    <thead class="mb-5">
      <tr>
        <th scope="col">品項</th>
        <th scope="col">單價</th>
        <th scope="col">數量</th>
        <th scope="col">金額</th>
        <th scope="col"></th>
      </tr>
    </thead><tbody>${carts
      .map(
        (item) =>
          `
          <tr data-cart-id=${item.id}>
                <th scope="row">
                  <div class="flex">
                    <img
                      src="${item?.product?.images}"
                      alt="${item?.product?.title}"
                      width="80"
                      height="80"
                    />
                    <div class="px-4 py-3 whitespace-normal">
                      <h3>${item?.product?.title}</h3>
                    </div>
                  </div>
                </th>
                <td>NT$${formatPrice(item?.product?.price)}</td>
                <td>
                <select name="" id="" value=${
                  item.quantity
                } class="border-secondary-300 focus-within:ring-primary-500 focus-within:border-primary-500 border-primary-500 ring-primary text-secondary-600 rounded disabled:bg-secondary-300">
                ${[...new Array(10)]
                  .map(
                    (_, num) =>
                      `<option value="${num + 1}" ${
                        num + 1 === item.quantity ? 'selected' : ''
                      }>${num + 1}</option>`
                  )
                  .join('')}
          </select>
                </td>
                <td>NT$${formatPrice(item?.product?.price * item.quantity)}</td>
                <td class="text-end">
                  <button
                    type="button"
                    class="material-icons text-3xl hover:text-primary-400 hover:scale-105 transition-all disabled:opacity-60 disabled:pointer-events-none"
                  >
                    clear
                  </button>
                </td>
              </tr>`
      )
      .join('')}</tbody>
      <tfoot>
        <td colspan="3">
          <button
            type="button"
            class="border border-black rounded px-5 py-2 hover:bg-danger-400 hover:text-white hover:border-danger-400"
            data-delete-all-cart
            data-swal-toast-template='#confirm-template'
          >
            刪除所有品項
          </button>
        </td>
        <td class="text-base">總金額</td>
        <td class="text-3xl text-end">NT$${formatPrice(finalTotal)}</td>
      </tfoot>
    </table>`;
    form.classList.remove('max-h-0', 'overflow-hidden');
  }
  cartsSection.innerHTML = str;
}
function showToast(icon, message) {
  Toast.fire({
    icon: icon,
    title: message,
  });
}
async function getProducts() {
  try {
    const response = await axios.get('/api/livejs/v1/customer/hsinyu/products');
    productData = response.data.products;
    renderProducts(productData);
  } catch (error) {
    showToast('error', error);
  }
}
async function getCarts() {
  try {
    const response = await axios.get('api/livejs/v1/customer/hsinyu/carts');
    renderCarts(response.data);
  } catch (error) {
    showToast('error', error);
  }
}
async function postCart(productId) {
  try {
    const response = await axios.post('api/livejs/v1/customer/hsinyu/carts', {
      data: {
        productId,
        quantity: 1,
      },
    });
    renderCarts(response.data);
    showToast('success', '新增購物車成功');
  } catch (error) {
    showToast('error', error);
  }
}
async function patchCart(cartId, quantity, target) {
  try {
    target.disabled = true;
    const response = await axios.patch(
      `api/livejs/v1/customer/${VITE_API_PATH}/carts`,
      {
        data: {
          id: cartId,
          quantity,
        },
      }
    );
    renderCarts(response.data);
    target.disabled = false;
    showToast('success', `修改購物車成功`);
  } catch (error) {
    showToast('error', error);
  }
}
async function deleteCart(cartId, target) {
  try {
    target.disabled = true;
    const response = await axios.delete(
      `api/livejs/v1/customer/${VITE_API_PATH}/carts/${cartId}`
    );
    renderCarts(response.data);
    target.disabled = false;
    showToast('success', `刪除成功`);
  } catch (error) {
    showToast('error', error);
  }
}
async function deleteAllCarts(target, test) {

  try {
    target.disabled = true;
    const response = await axios.delete(
      `api/livejs/v1/customer/${VITE_API_PATH}/carts`
    );
    renderCarts(response.data);
    showToast('success', `刪除成功`);
  } catch (error) {
    showToast('error', error);
  } finally {
    target.disabled = false;
  }
}
async function postOrder(order) {
  try {
    const response = await axios.post(
      `api/livejs/v1/customer/${VITE_API_PATH}/orders`,
      order
    );
    showToast('success', `新增訂單成功`);
    getCarts();
  } catch (error) {
    showToast('error', error);
  }
}
getProducts();
getCarts();
function addCart(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  const { productId } = e.target.closest('li').dataset;
  postCart(productId);
}
function editCart(e) {
  if (e.target.nodeName !== 'SELECT') return;
  const { cartId } = e.target.closest('tr').dataset;
  patchCart(cartId, +e.target.value, e.target);
}

function removeCart(e) {
  if (
    e.target.nodeName !== 'BUTTON' ||
    e.target.dataset.deleteAllCart !== undefined
  )
    return;
  const { cartId } = e.target.closest('tr').dataset;
  deleteCart(cartId, e.target);
}
productList.addEventListener('click', addCart);
cartsSection.addEventListener('change', editCart);
cartsSection.addEventListener('click', removeCart);
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});
