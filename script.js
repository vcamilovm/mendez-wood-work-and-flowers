const CONFIG={
  whatsapp:"573000000000", // CAMBIA ESTE NÚMERO
  instagram:"https://www.instagram.com/", // CAMBIA ESTE ENLACE
  facebook:"https://www.facebook.com/" // CAMBIA ESTE ENLACE
};

const products=[
 {id:1,name:"Diseño Floral 01",price:0,category:"Colección",description:"Pieza artesanal. Precio por definir.",image:"assets/producto-1.jpeg"},
 {id:2,name:"Diseño Floral 02",price:0,category:"Colección",description:"Pieza artesanal. Precio por definir.",image:"assets/producto-2.jpeg"},
 {id:3,name:"Diseño Floral 03",price:0,category:"Colección",description:"Pieza artesanal. Precio por definir.",image:"assets/producto-3.jpeg"},
 {id:4,name:"Diseño Floral 04",price:0,category:"Colección",description:"Pieza artesanal. Precio por definir.",image:"assets/producto-4.jpeg"}
];
let cart=JSON.parse(localStorage.getItem("mendezCart")||"[]"),activeCategory="Todos";
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

function renderFilters(){document.getElementById("filters").innerHTML=["Todos",...new Set(products.map(p=>p.category))].map(c=>`<button class="filter ${c===activeCategory?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("")}
function setCategory(c){activeCategory=c;renderFilters();renderProducts()}
function renderProducts(){
 const list=activeCategory==="Todos"?products:products.filter(p=>p.category===activeCategory);
 document.getElementById("productGrid").innerHTML=list.map(p=>`
 <article class="product-card"><div class="product-img" style="background-image:url('${p.image}')"></div>
 <div class="product-info"><p class="eyebrow">${p.category}</p><h3>${p.name}</h3><p class="desc">${p.description}</p>
 <div class="price">${p.price?money(p.price):"Precio por definir"}</div>
 <button class="add" onclick="addToCart(${p.id})">Agregar al carrito</button></div></article>`).join("")
}
function save(){localStorage.setItem("mendezCart",JSON.stringify(cart))}
function addToCart(id){let x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});save();renderCart();openCart()}
function changeQty(id,d){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function removeItem(id){cart=cart.filter(i=>i.id!==id);save();renderCart()}
function renderCart(){
 document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p);
 document.getElementById("cartItems").innerHTML=items.length?items.map(i=>`
 <div class="cart-item"><div class="cart-thumb" style="background-image:url('${i.p.image}')"></div><div><h4>${i.p.name}</h4><p>${i.p.price?money(i.p.price*i.qty):"Precio por confirmar"}</p>
 <div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button><button class="remove" onclick="removeItem(${i.id})">Eliminar</button></div></div></div>`).join(""):`<div style="text-align:center;padding:55px 10px;color:#777">🛒<p>Tu carrito está vacío.</p></div>`;
 const total=items.reduce((s,i)=>s+i.p.price*i.qty,0);document.getElementById("cartTotal").textContent=money(total)
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartBackdrop").classList.add("open")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartBackdrop").classList.remove("open")}
function checkout(){if(!cart.length){alert("Agrega un producto al carrito.");return}document.getElementById("checkoutModal").classList.add("open")}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open")}
document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();const d=new FormData(e.target),items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p);
 const total=items.reduce((s,i)=>s+i.p.price*i.qty,0);
 const lines=items.map(i=>`• ${i.p.name} x${i.qty} — ${i.p.price?money(i.p.price*i.qty):"precio por confirmar"}`).join("\n");
 const msg=`Hola, MENDEZ WOOD WORK AND FLOWERS. Quiero realizar este pedido:\n\n${lines}\n\nTOTAL: ${total?money(total):"Por confirmar"}\n\nNombre: ${d.get("name")}\nTeléfono: ${d.get("phone")}\nDirección/Ciudad: ${d.get("address")}\nObservaciones: ${d.get("notes")||"Ninguna"}\n\nQuedo atento(a) a la confirmación.`;
 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank")
});
document.getElementById("whatsappLink").href=`https://wa.me/${CONFIG.whatsapp}`;
document.getElementById("instagramLink").href=CONFIG.instagram;
document.getElementById("facebookLink").href=CONFIG.facebook;
document.getElementById("year").textContent=new Date().getFullYear();
renderFilters();renderProducts();renderCart();
