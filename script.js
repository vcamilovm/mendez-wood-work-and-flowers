/*
  MENDEZ WOOD WORK AND FLOWERS
  CONFIGURA AQUÍ WhatsApp y redes sociales.
*/
const CONFIG = {
  whatsapp: "573000000000", // Cambia por tu número: código país + número, sin + ni espacios.
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/"
};

// Catálogo temporal. Reemplaza nombre, precio, categoría, descripción y foto cuando los definas.
const products = [
  {id:1,name:"Diseño Botánico 01",price:45000,category:"Flores",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-1.jpg"},
  {id:2,name:"Pieza Artesanal 02",price:65000,category:"Madera",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-2.jpg"},
  {id:3,name:"Detalle Especial 03",price:85000,category:"Regalos",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-3.jpg"},
  {id:4,name:"Decoración Natural 04",price:95000,category:"Decoración",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-4.jpg"},
  {id:5,name:"Diseño Floral 05",price:55000,category:"Flores",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-5.jpg"},
  {id:6,name:"Madera con Encanto 06",price:75000,category:"Madera",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-6.jpg"},
  {id:7,name:"Regalo Artesanal 07",price:110000,category:"Regalos",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-7.jpg"},
  {id:8,name:"Composición 08",price:125000,category:"Decoración",description:"Producto de demostración para reemplazar por tu diseño.",image:"assets/producto-8.jpg"}
];

let cart = JSON.parse(localStorage.getItem("mendezCart") || "[]");
let activeCategory = "Todos";

const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

function saveCart(){ localStorage.setItem("mendezCart",JSON.stringify(cart)); }

function renderFilters(){
  const categories = ["Todos", ...new Set(products.map(p=>p.category))];
  document.getElementById("filters").innerHTML = categories.map(c =>
    `<button class="filter ${c===activeCategory?"active":""}" onclick="setCategory('${c}')">${c}</button>`
  ).join("");
}
function setCategory(category){ activeCategory=category; renderFilters(); renderProducts(); }

function renderProducts(){
  const list = activeCategory==="Todos" ? products : products.filter(p=>p.category===activeCategory);
  document.getElementById("productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-img" style="background-image:url('${p.image}')"><span>🌿</span></div>
      <div class="product-info">
        <p class="eyebrow">${p.category}</p>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">${money(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Agregar al carrito</button>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart(); renderCart(); openCart();
}

function changeQty(id,delta){
  const item=cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
  saveCart(); renderCart();
}

function removeItem(id){ cart=cart.filter(i=>i.id!==id); saveCart(); renderCart(); }

function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartCount").textContent=count;
  const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p);
  document.getElementById("cartItems").innerHTML = items.length ? items.map(i=>`
    <div class="cart-item">
      <div class="cart-thumb" style="background-image:url('${i.p.image}')">🌿</div>
      <div>
        <h4>${i.p.name}</h4>
        <p>${money(i.p.price*i.qty)}</p>
        <div class="qty">
          <button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button>
          <button class="remove" onclick="removeItem(${i.id})">Eliminar</button>
        </div>
      </div>
    </div>`).join("") : `<div style="text-align:center;padding:60px 10px;color:#747a73"><div style="font-size:50px">🛒</div><p>Tu carrito está vacío.</p><a class="text-link" href="#catalogo" onclick="closeCart()">Ver catálogo</a></div>`;
  const total=items.reduce((s,i)=>s+i.p.price*i.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
}

function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartBackdrop").classList.add("open")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartBackdrop").classList.remove("open")}

function checkout(){
  if(!cart.length){alert("Agrega al menos un producto al carrito.");return}
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open")}

document.getElementById("checkoutForm").addEventListener("submit", e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p);
  const total=items.reduce((s,i)=>s+i.p.price*i.qty,0);
  const lines=items.map(i=>`• ${i.p.name} x${i.qty} — ${money(i.p.price*i.qty)}`).join("\n");
  const msg=`Hola, MENDEZ WOOD WORK AND FLOWERS. Quiero realizar este pedido:\n\n${lines}\n\nTOTAL: ${money(total)}\n\nDATOS DEL CLIENTE\nNombre: ${data.get("name")}\nTeléfono: ${data.get("phone")}\nDirección/Ciudad: ${data.get("address")}\nObservaciones: ${data.get("notes") || "Ninguna"}\n\nQuedo atento(a) a la confirmación.`;
  const url=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url,"_blank");
});

document.getElementById("whatsappLink").href=`https://wa.me/${CONFIG.whatsapp}`;
document.getElementById("instagramLink").href=CONFIG.instagram;
document.getElementById("facebookLink").href=CONFIG.facebook;
document.getElementById("year").textContent=new Date().getFullYear();

renderFilters();renderProducts();renderCart();
