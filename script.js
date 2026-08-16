/*
  MENDEZ WOOD WORK AND FLOWERS — V3
  EDITA SOLO ESTA ZONA PARA CAMBIAR DATOS COMERCIALES.
*/
const CONFIG = {
  whatsapp: "573000000000", // Reemplazar por: código país + número, sin +, espacios ni guiones.
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/"
};

/*
  Los 8 productos corresponden a las 8 piezas de tu fotografía "Catalogo.jpeg".
  price: null = "Precio por definir".
  Cuando tengas precios, cambia null por un número, por ejemplo 180000.
*/
const products = [
  {id:1,name:"Diseño 01",category:"Madera + flores",price:null,description:"Composición artesanal en madera con diseño floral.",image:"assets/producto-1.jpg"},
  {id:2,name:"Diseño 02",category:"Madera + flores",price:null,description:"Pieza vertical con composición floral y elementos naturales.",image:"assets/producto-2.jpg"},
  {id:3,name:"Diseño 03",category:"Madera + flores",price:null,description:"Composición de carácter contemporáneo elaborada a mano.",image:"assets/producto-3.jpg"},
  {id:4,name:"Diseño 04",category:"Madera + flores",price:null,description:"Diseño natural con flores, ramas y madera.",image:"assets/producto-4.jpg"},
  {id:5,name:"Diseño 05",category:"Madera + flores",price:null,description:"Composición floral de formas orgánicas.",image:"assets/producto-5.jpg"},
  {id:6,name:"Diseño 06",category:"Madera + flores",price:null,description:"Pieza artesanal con composición floral de color.",image:"assets/producto-6.jpg"},
  {id:7,name:"Diseño 07",category:"Madera + flores",price:null,description:"Diseño natural para espacios especiales.",image:"assets/producto-7.jpg"},
  {id:8,name:"Diseño 08",category:"Madera + flores",price:null,description:"Composición exclusiva con madera y flores.",image:"assets/producto-8.jpg"}
];

let cart = JSON.parse(localStorage.getItem("mendezCartV3") || "[]");
let activeCategory = "Todos";
const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

function saveCart(){localStorage.setItem("mendezCartV3",JSON.stringify(cart))}
function renderFilters(){
  const cats=["Todos",...new Set(products.map(p=>p.category))];
  document.getElementById("filters").innerHTML=cats.map(c=>`<button class="filter ${c===activeCategory?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("");
}
function setCategory(c){activeCategory=c;renderFilters();renderProducts()}
function renderProducts(){
  const list=activeCategory==="Todos"?products:products.filter(p=>p.category===activeCategory);
  document.getElementById("productGrid").innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-img" style="background-image:url('${p.image}')"></div>
      <div class="product-info">
        <p class="eyebrow">${p.category}</p><h3>${p.name}</h3>
        <p class="desc">${p.description}</p>
        <div class="price">${p.price===null?"Precio por definir":money(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Agregar al carrito</button>
      </div>
    </article>`).join("");
}
function addToCart(id){
  const found=cart.find(i=>i.id===id);
  if(found)found.qty++;else cart.push({id,qty:1});
  saveCart();renderCart();openCart();
}
function changeQty(id,d){
  const item=cart.find(i=>i.id===id);if(!item)return;
  item.qty+=d;if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart();renderCart();
}
function removeItem(id){cart=cart.filter(i=>i.id!==id);saveCart();renderCart()}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
  const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p);
  document.getElementById("cartItems").innerHTML=items.length?items.map(i=>`
    <div class="cart-item">
      <div class="cart-thumb" style="background-image:url('${i.p.image}')"></div>
      <div><h4>${i.p.name}</h4><p>${i.p.price===null?"Precio por definir":money(i.p.price*i.qty)}</p>
      <div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button><button class="remove" onclick="removeItem(${i.id})">Eliminar</button></div></div>
    </div>`).join(""):`<div style="text-align:center;padding:60px 10px;color:#747a73"><div style="font-size:50px">🛒</div><p>Tu carrito está vacío.</p><a class="text-link" href="#catalogo" onclick="closeCart()">Ver colección</a></div>`;
  const known=items.filter(i=>i.p.price!==null);
  const unknown=items.some(i=>i.p.price===null);
  const total=known.reduce((s,i)=>s+i.p.price*i.qty,0);
  document.getElementById("cartTotal").textContent=unknown?(known.length?`${money(total)} + por confirmar`:"Por definir"):money(total);
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartBackdrop").classList.add("open")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartBackdrop").classList.remove("open")}
function checkout(){if(!cart.length){alert("Agrega al menos un diseño al carrito.");return}document.getElementById("checkoutModal").classList.add("open")}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open")}

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p);
  const lines=items.map(i=>`• ${i.p.name} x${i.qty} — ${i.p.price===null?"Precio por confirmar":money(i.p.price*i.qty)}`).join("\n");
  const known=items.filter(i=>i.p.price!==null).reduce((s,i)=>s+i.p.price*i.qty,0);
  const hasUnknown=items.some(i=>i.p.price===null);
  const total=hasUnknown?(known?money(known)+" + productos por confirmar":"Por confirmar"):money(known);
  const msg=`Hola, MENDEZ WOOD WORK AND FLOWERS. Quiero realizar este pedido:\n\n${lines}\n\nTOTAL: ${total}\n\nDATOS DEL CLIENTE\nNombre: ${data.get("name")}\nTeléfono: ${data.get("phone")}\nCiudad / dirección: ${data.get("address")}\nObservaciones: ${data.get("notes")||"Ninguna"}\n\nQuedo atento(a) a la confirmación.`;
  if(CONFIG.whatsapp==="573000000000"){alert("Antes de recibir pedidos debes reemplazar el número de WhatsApp de demostración en script.js.");return}
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank");
});
document.getElementById("whatsappLink").href=CONFIG.whatsapp==="573000000000"?"#":`https://wa.me/${CONFIG.whatsapp}`;
document.getElementById("instagramLink").href=CONFIG.instagram;
document.getElementById("facebookLink").href=CONFIG.facebook;
document.getElementById("year").textContent=new Date().getFullYear();
renderFilters();renderProducts();renderCart();
