import axios from '../../main.js';
import * as d3 from 'd3';
import * as c3 from 'c3';
import 'c3/c3.css';
const { VITE_API_KEY, VITE_API_PATH } = import.meta.env;

let chart;
function makeData(data, data_type) {
  const obj = {};
  const dataType = data_type === 'category' ? 'category' : 'title';

  if (!data.length) return [];
  data.forEach((item) => {
    item.products.forEach((product) => {
      if (!obj[product[dataType]]) {
        obj[product[dataType]] = product.price;
      } else {
        obj[product[dataType]] += product.price;
      }
    });
  });
  const sortedArr = Object.entries(obj).sort((a, b) => b[1] - a[1]);
  const removedArr = sortedArr.splice(3);
  sortedArr.push([
    '其他',
    removedArr.reduce(
      (accumulator, currentValue) => accumulator + currentValue[1],
      0
    ),
  ]);

  return sortedArr;
}
function toDateString(time) {
  return new Date(time * 1000).toLocaleString();
}
const orderTable = document.querySelector('[data-order-table]');
const deleteBtn = document.querySelector('[data-delete-all]');
axios.defaults.headers.common['Authorization'] = VITE_API_KEY;
function makePieChart(data, data_type) {
  const chartData = makeData(data, data_type);
  chart = c3.generate({
    bindto: data_type === 'category' ? '#categoryChart' : '#productChart',
    data: {
      columns: chartData,
      type: 'pie',
      empty: {
        label: {
          text: '無訂單資料',
        },
      },
    },
    size: {
      width: 500,
      height: 500,
    },
    padding: {
      bottom: 32,
    },
    color: {
      pattern: [
        'rgba(218, 203, 255, 1)',
        'rgba(157, 127, 234, 1)',
        'rgba(106, 51, 248, 1)',
        'rgba(106, 51, 255, 1)',
        'rgba(84, 52, 167, 1)',
        'rgba(48, 30, 95, 1)',
      ],
    },
    pie: {
      label: {
        format: function (value, ratio, id) {
          return d3.format('$,')(value)
        },
      },
    },
  });
}
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
function showToast(icon, message) {
  Toast.fire({
    icon: icon,
    title: message,
  });
}

function renderOrders(filterData) {
  let str = '';
  if (!filterData.length) {
    deleteBtn.classList.add('hidden');
  } else {
    str = `<table class="table w-full whitespace-nowrap">
    <thead>
      <tr>
        <th scope="col">訂單編號</th>
        <th scope="col">聯絡人</th>
        <th scope="col">聯絡地址</th>
        <th scope="col">電子郵件</th>
        <th scope="col">訂單品項</th>
        <th scope="col">訂單日期</th>
        <th scope="col">訂單狀態</th>
        <th scope="col">操作</th>
      </tr>
    </thead>
    <tbody>${filterData
      .map(
        (item) =>
          `
          <tr>
              <th scope="row">
                ${item.id}
              </th>
              <td>
                ${item?.user?.name} <br>
                ${item?.user?.tel}
              </td>
              <td>${item?.user?.address}</td>
              <td>
                ${item?.user?.email}
              </td>
              <td>
                ${
                  item.products.length > 1
                    ? `<ul>${item.products
                        .map((item) => `<li>${item.title}</li>`)
                        .join('')}</ul>`
                    : `${item.products.map((item) => item.title)}`
                }
              </td>
              <td>
              ${toDateString(item.createdAt)}
              </td>
              <td >
              <button class="hover:opacity-60 ${
                item.paid ? 'text-info' : 'text-danger-400'
              } disabled:opacity-60 disabled:pointer-events-none" type="button" data-type="edit">
                ${item.paid ? '已處理' : '未處理'}
                </button>
              </td>
              <td>
                <button class="bg-danger-400 text-white py-2 px-3" type="button" data-type="delete">
                  刪除
                </button>
              </td>
            </tr>`
      )
      .join('')}  </tbody>
      </table>`;
    deleteBtn.classList.remove('hidden');
  }
  orderTable.innerHTML = str;
}
async function getOrders() {
  try {
    const response = await axios.get(
      `api/livejs/v1/admin/${VITE_API_PATH}/orders`
    );
    const { orders } = response.data;
    renderOrders(orders);
    makePieChart(orders, 'title');
  } catch (error) {
    showToast('error', error);
  }
}
async function putOrder(orderId, paid, target) {
  try {
    target.disabled = true;
    const response = await axios.put(
      `api/livejs/v1/admin/${VITE_API_PATH}/orders`,
      {
        data: {
          id: orderId,
          paid,
        },
      }
    );
    const { orders } = response.data;
    renderOrders(orders);
    makePieChart(orders, 'title');
    target.disabled = false;
    showToast('success', '修改訂單成功');
  } catch (error) {
    showToast('error', error);
  }
}
async function deleteOrder(orderId, target) {
  try {
    target.disabled = true;
    const response = await axios.delete(
      `api/livejs/v1/admin/${VITE_API_PATH}/orders/${orderId}`
    );
    const { orders } = response.data;
    renderOrders(orders);
    makePieChart(orders, 'title');
    showToast('success', '刪除訂單成功');
  } catch (error) {
    showToast('error', error);
  } finally {
    target.disabled = false;
  }
}
async function deleteAllOrders(target) {
  try {
    target.disabled = true;
    const response = await axios.delete(
      `api/livejs/v1/admin/${VITE_API_PATH}/orders/`
    );
    const { orders, message } = response.data;
    renderOrders(orders);
    makePieChart(orders, 'title');
    showToast('success', message);
  } catch (error) {
    showToast('error', error);
    target.disabled = false;
  }
}
getOrders();
function handleOrder(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  const orderId = e.target.closest('tr').firstElementChild.textContent.trim();
  if (e.target.dataset.type === 'edit') {
    const paid = e.target.textContent.trim() === '已處理';
    putOrder(orderId, !paid, e.target);
  } else if (e.target.dataset.type === 'delete') {
    deleteOrder(orderId, e.target);
  }
}

orderTable.addEventListener('click', handleOrder);

function makeConfirmToast() {
  Swal.bindClickHandler();

  Swal.mixin({
    toast: true,
    confirmButtonText: '確定',
    showCancelButton: true,
    confirmButtonColor: 'rgba(48, 30, 95, 1)',
    preConfirm: () => deleteAllOrders(deleteBtn),
  }).bindClickHandler('data-swal-toast-template');
}
makeConfirmToast();
