import{a as c}from"./config-3c9abc30.js";const{VITE_API_PATH:v}={VITE_API_PATH:"hsinyu",VITE_API_KEY:"hRZMCzzUpvYCLCuIlqiu3h2h9Hx2",VITE_BASE_URL:"https://livejs-api.hexschool.io/",BASE_URL:"/woworoom/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},y=document.querySelector("[data-product-select]"),l=document.querySelector("[data-order-form]"),b=document.querySelector("form[data-order-form] select"),S=document.querySelectorAll("[data-order-form] input"),T=document.querySelector("[data-order-form] button[type=submit]"),C=document.querySelector("[data-product-list]"),g=document.querySelector("[data-cart-list]"),N=document.querySelector("[data-delete-all-cart");let f;const A=Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0,didOpen:t=>{t.addEventListener("mouseenter",Swal.stopTimer),t.addEventListener("mouseleave",Swal.resumeTimer)}});function x(){![...S].every(t=>t.value)||!b.value?T.disabled=!0:T.disabled=!1}function j(){Swal.bindClickHandler(),Swal.mixin({toast:!0,confirmButtonText:"確定",showCancelButton:!0,showLoaderOnConfirm:!0,preConfirm:()=>V(N)}).bindClickHandler("data-swal-toast-template")}j();l.addEventListener("input",x);function I(t){t.preventDefault();const e=[...S].map(d=>d.value),r={data:{user:{name:e[0],tel:e[1],email:e[2],address:e[3],payment:b.value}}};Swal.mixin({toast:!0}).fire({title:"訂單資訊如下",html:`<ul><li>姓名：${e[0]}</li>
    <li>電話：${e[1]}</li>
    <li>email：${e[2]}</li>
    <li>寄送地址：${e[3]}</li>
    <li>交易方式：${b.value}</li>
    `,confirmButtonText:"確定",showCancelButton:!0,showLoaderOnConfirm:!0,confirmButtonColor:"rgba(48, 30, 95, 1)",preConfirm:()=>{R(r),l.reset(),x()}})}l.addEventListener("submit",I);y.addEventListener("change",t=>{y.disabled=!0;const e=t.target.value===""?f:f.filter(r=>r.category===t.target.value);q(e),y.disabled=!1});function P(t){t.target.nodeName!=="INPUT"&&t.target.nodeName!=="SELECT"||(t.target.value?t.target.nextElementSibling.classList.remove("visible"):t.target.nextElementSibling.classList.add("visible"))}l.addEventListener("blur",P,!0);document.addEventListener("DOMContentLoaded",function(){const t=document.querySelector(".recommendation-wall");t.style.cursor="grab";let e={top:0,left:0,x:0,y:0};const r=function(n){t.style.cursor="grabbing",t.style.userSelect="none",e={left:t.scrollLeft,top:t.scrollTop,x:n.clientX,y:n.clientY},document.addEventListener("mousemove",s),document.addEventListener("mouseup",d)},s=function(n){const o=n.clientX-e.x,m=n.clientY-e.y;t.scrollTop=e.top-m,t.scrollLeft=e.left-o},d=function(){t.style.cursor="grab",t.style.removeProperty("user-select"),document.removeEventListener("mousemove",s),document.removeEventListener("mouseup",d)};t.addEventListener("mousedown",r),x()});let _=document.querySelector("[data-menu-toggle]"),i=document.querySelector(".nav-menu");_.addEventListener("click",O);i.addEventListener("click",t=>{t.target.nodeName==="A"&&k()});function O(){i.classList.contains("open-menu")?i.classList.remove("open-menu"):i.classList.add("open-menu")}function k(){i.classList.remove("open-menu")}function u(t){const e=t.toString().split(".");return e[0]=e[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),e.join(".")}function q(t){let e="";t.length?e=`<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${t.map(r=>`
          <li class="relative card-hover" data-product-id=${r.id}>
          <div
            class="absolute top-5 -right-1 bg-black text-white py-2 px-6 z-10"
          >
            新品
          </div>
          <div class="overflow-hidden">
            <img
              class="w-full transition-all"
              src="${r.images}"
              alt="${r.title}"
              height="302"
            />
          </div>

          <button
            type="button"
            class="bg-black w-full text-white text-center py-3 mb-2"
          >
            加入購物車
          </button>
          <h3 class="text-xl mb-2">${r.title}</h3>
          <del class="text-xl">NT$${u(r.origin_price)}</del>
          <p class="text-3xl">NT$${u(r.price)}</p>
        </li>`).join("")}</ul>`:e=`<div class="text-center">
    <h3 class="text-3xl font-medium mb-6 text-secondary-600">無資料</h3>
    
  </div>`,C.innerHTML=e}function p(t){const{carts:e,total:r,finalTotal:s,status:d}=t;let n="";e.length?(n=`<table
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
    </thead><tbody>${e.map(o=>{var m,w,L,$,E;return`
          <tr data-cart-id=${o.id}>
                <th scope="row">
                  <div class="flex">
                    <img
                      src="${(m=o==null?void 0:o.product)==null?void 0:m.images}"
                      alt="${(w=o==null?void 0:o.product)==null?void 0:w.title}"
                      width="80"
                      height="80"
                    />
                    <div class="px-4 py-3 whitespace-normal">
                      <h3>${(L=o==null?void 0:o.product)==null?void 0:L.title}</h3>
                    </div>
                  </div>
                </th>
                <td>NT$${u(($=o==null?void 0:o.product)==null?void 0:$.price)}</td>
                <td>
                <select name="" id="" value=${o.quantity} class="border-secondary-300 focus-within:ring-primary-500 focus-within:border-primary-500 border-primary-500 ring-primary text-secondary-600 rounded disabled:bg-secondary-300">
                ${[...new Array(10)].map((K,h)=>`<option value="${h+1}" ${h+1===o.quantity?"selected":""}>${h+1}</option>`).join("")}
          </select>
                </td>
                <td>NT$${u(((E=o==null?void 0:o.product)==null?void 0:E.price)*o.quantity)}</td>
                <td class="text-end">
                  <button
                    type="button"
                    class="material-icons text-3xl hover:text-primary-400 hover:scale-105 transition-all disabled:opacity-60 disabled:pointer-events-none"
                  >
                    clear
                  </button>
                </td>
              </tr>`}).join("")}</tbody>
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
        <td class="text-3xl text-end">NT$${u(s)}</td>
      </tfoot>
    </table>`,l.classList.remove("max-h-0","overflow-hidden")):(n=`
    <h3 class="text-3xl font-medium mb-6 text-secondary-600 text-center">無加入購物車商品</h3>
  `,l.classList.add("max-h-0","overflow-hidden")),g.innerHTML=n}function a(t,e){A.fire({icon:t,title:e})}async function H(){try{f=(await c.get("/api/livejs/v1/customer/hsinyu/products")).data.products,q(f)}catch(t){a("error",t)}}async function B(){try{const t=await c.get("api/livejs/v1/customer/hsinyu/carts");p(t.data)}catch(t){a("error",t)}}async function D(t){try{const e=await c.post("api/livejs/v1/customer/hsinyu/carts",{data:{productId:t,quantity:1}});p(e.data),a("success","新增購物車成功")}catch(e){a("error",e)}}async function M(t,e,r){try{r.disabled=!0;const s=await c.patch(`api/livejs/v1/customer/${v}/carts`,{data:{id:t,quantity:e}});p(s.data),r.disabled=!1,a("success","修改購物車成功")}catch(s){a("error",s)}}async function U(t,e){try{e.disabled=!0;const r=await c.delete(`api/livejs/v1/customer/${v}/carts/${t}`);p(r.data),e.disabled=!1,a("success","刪除成功")}catch(r){a("error",r)}}async function V(t,e){try{t.disabled=!0;const r=await c.delete(`api/livejs/v1/customer/${v}/carts`);p(r.data),a("success","刪除成功")}catch(r){a("error",r)}finally{t.disabled=!1}}async function R(t){try{const e=await c.post(`api/livejs/v1/customer/${v}/orders`,t);a("success","新增訂單成功"),B()}catch(e){a("error",e)}}H();B();function Y(t){if(t.target.nodeName!=="BUTTON")return;const{productId:e}=t.target.closest("li").dataset;D(e)}function z(t){if(t.target.nodeName!=="SELECT")return;const{cartId:e}=t.target.closest("tr").dataset;M(e,+t.target.value,t.target)}function X(t){if(t.target.nodeName!=="BUTTON"||t.target.dataset.deleteAllCart!==void 0)return;const{cartId:e}=t.target.closest("tr").dataset;U(e,t.target)}C.addEventListener("click",Y);g.addEventListener("change",z);g.addEventListener("click",X);
