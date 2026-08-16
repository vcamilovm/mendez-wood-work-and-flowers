/*
 MENDEZ WOOD WORK AND FLOWERS — V4
 Cambia SOLO CONFIG cuando tengas tus datos comerciales.
*/
const CONFIG={
  whatsapp:"573000000000", // Código de país + número, sin +, espacios ni guiones.
  instagram:"https://www.instagram.com/mendezwoodflowers/",
  facebook:"https://www.facebook.com/"
};

const products=[
 {id:1,name:"Diseño 01",price:null,image:"assets/producto-1.jpg"},
 {id:2,name:"Diseño 02",price:null,image:"assets/producto-2.jpg"},
 {id:3,name:"Diseño 03",price:null,image:"assets/producto-3.jpg"},
 {id:4,name:"Diseño 04",price:null,image:"assets/producto-4.jpg"},
 {id:5,name:"Diseño 05",price:null,image:"assets/producto-5.jpg"},
 {id:6,name:"Diseño 06",price:null,image:"assets/producto-6.jpg"},
 {id:7,name:"Diseño 07",price:null,image:"assets/producto-7.jpg"},
 {id:8,name:"Diseño 08",price:null,image:"assets/producto-8.jpg"}
];

let cart=JSON.parse(localStorage.getItem("mendezCartV4")||"[]");
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
const findProduct=id=>products.find(p=>p.id===Number(id));
function save(){localStorage.setItem("mendezCartV4",JSON.stringify(cart));}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartCount").textContent=count;
  const box=document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML='<div style="text-align:center;padding:60px 10px;color:#747a73"><div style="font-size:50px">🛒</div><p>Tu carrito está vacío.</p></div>';
    document.getElementById("cartTotal").textContent="Por definir";
    return;
  }
  box.innerHTML=cart.map(i=>{
    const p=findProduct(i.id);
    if(!p)return "";
    return `<div class="cart-item">
      <img class="cart-thumb" src="${p.image}" alt="${p.name}">
      <div><h4>${p.name}</h4><p>Precio por definir</p>
      <div class="qty"><button type="button" onclick="changeQty(${p.id},-1)">−</button><span>${i.qty}</span><button type="button" onclick="changeQty(${p.id},1)">+</button><button class="remove" type="button" onclick="removeItem(${p.id})">Eliminar</button></div></div>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent="Por definir";
}
function addToCart(id){
  id=Number(id);
  const found=cart.find(i=>i.id===id);
  if(found)found.qty++;else cart.push({id,qty:1});
  save();renderCart();openCart();
}
function changeQty(id,d){
  const item=cart.find(i=>i.id===Number(id));
  if(!item)return;
  item.qty+=d;
  if(item.qty<=0)cart=cart.filter(i=>i.id!==Number(id));
  save();renderCart();
}
function removeItem(id){cart=cart.filter(i=>i.id!==Number(id));save();renderCart();}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartBackdrop").classList.add("open");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartBackdrop").classList.remove("open");}
function checkout(){
  if(!cart.length){alert("Agrega al menos un diseño al carrito.");return;}
  document.getElementById("checkoutModal").classList.add("open");
  document.getElementById("checkoutModal").setAttribute("aria-hidden","false");
}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open");document.getElementById("checkoutModal").setAttribute("aria-hidden","true");}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.add)));
  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const filter=btn.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card=>card.hidden=filter!=="all"&&card.dataset.category!==filter);
  }));
  document.getElementById("whatsappLink").href=CONFIG.whatsapp==="573000000000"?"#":`https://wa.me/${CONFIG.whatsapp}`;
  document.getElementById("instagramLink").href=CONFIG.instagram;
  document.getElementById("facebookLink").href=CONFIG.facebook;
  document.getElementById("year").textContent=new Date().getFullYear();
  document.getElementById("checkoutForm").addEventListener("submit",e=>{
    e.preventDefault();
    if(CONFIG.whatsapp==="573000000000"){alert("El número de WhatsApp todavía es de demostración. Cámbialo en CONFIG dentro de script.js.");return;}
    const data=new FormData(e.target);
    const items=cart.map(i=>({i,p:findProduct(i.id)})).filter(x=>x.p);
    const lines=items.map(x=>`• ${x.p.name} x${x.i.qty} — Precio por confirmar`).join("\n");
    const msg=`Hola, MENDEZ WOOD WORK AND FLOWERS. Quiero realizar este pedido:\n\n${lines}\n\nDATOS DEL CLIENTE\nNombre: ${data.get("name")}\nTeléfono: ${data.get("phone")}\nCiudad / dirección: ${data.get("address")}\nObservaciones: ${data.get("notes")||"Ninguna"}\n\nQuedo atento(a) a la confirmación.`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank");
  });
  renderCart();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeCheckout();}});
