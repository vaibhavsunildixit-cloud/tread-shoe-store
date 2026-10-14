// Store logic: filtering, product modal, cart, checkout
const inr=n=>"₹"+n.toLocaleString("en-IN");
const S={cat:"All",q:"",sort:"f",cart:[],promo:"",sel:null};
try{S.cart=JSON.parse(localStorage.getItem("tread-cart")||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem("tread-cart",JSON.stringify(S.cart))}catch(e){}};
const $=s=>document.querySelector(s);

function shade(h,a){const n=parseInt(h.slice(1),16);const f=v=>Math.max(0,Math.min(255,v+a));
return "#"+[(n>>16)&255,(n>>8)&255,n&255].map(v=>f(v).toString(16).padStart(2,"0")).join("")}
function shoe(k,col){
const d=shade(col,-45),l=shade(col,40);
const body={
run:`<path d="M12 74C12 58 28 54 44 52L68 34C78 28 88 34 98 42C114 52 140 50 166 60C184 66 192 72 192 78V82H12Z" fill="${col}"/><path d="M90 46C110 56 140 54 160 62" stroke="${l}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
sne:`<path d="M12 72C12 58 28 54 44 52L66 32C76 26 88 34 98 42C112 50 140 48 164 58C184 64 190 70 190 76V82H12Z" fill="${col}"/><path d="M12 72H190" stroke="${d}" stroke-width="3"/><path d="M72 38L96 50M80 33L102 46" stroke="${l}" stroke-width="3" stroke-linecap="round"/>`,
boot:`<path d="M44 10H92L96 46C108 56 150 52 180 66C192 72 192 80 192 84H34L34 58Z" fill="${col}"/><path d="M44 10H92" stroke="${d}" stroke-width="6"/><path d="M52 26H90M52 38H92" stroke="${l}" stroke-width="3" stroke-linecap="round"/>`,
loaf:`<path d="M12 74C12 62 36 54 66 52C86 44 108 52 130 54C166 56 190 66 190 78V82H12Z" fill="${col}"/><path d="M78 56C96 52 116 58 130 62" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>`}[k];
const sole=k==="boot"?`<path d="M30 82H194V92Q194 96 188 96H36Q30 96 30 92Z" fill="#20252c"/>`:`<path d="M8 80H194V90Q194 96 188 96H14Q8 96 8 90Z" fill="${k==="loaf"?"#20252c":"#f4f4f1"}"/>`;
return `<svg viewBox="0 0 200 100" role="img" aria-label="Shoe illustration">${body}${sole}</svg>`}
const tint=p=>`background:${shade(p.cols[0],95)}33`;

function list(){
let r=P.filter(p=>(S.cat==="All"||p.c===S.cat)&&p.n.toLowerCase().includes(S.q.toLowerCase()));
if(S.sort==="l")r.sort((a,b)=>a.p-b.p);if(S.sort==="h")r.sort((a,b)=>b.p-a.p);if(S.sort==="n")r.sort((a,b)=>a.n.localeCompare(b.n));
$("#grid").innerHTML=r.length?r.map(p=>`<button class="card" data-act="open" data-id="${p.id}"><div class="pic" style="${tint(p)}">${p.o?`<span class="tag">Sale</span>`:""}${shoe(p.k,p.cols[0])}</div><div class="in"><h3>${p.n}</h3><div class="meta">${p.c} · ${p.cols.length} colours</div><div class="price">${inr(p.p)}${p.o?`<s>${inr(p.o)}</s>`:""}</div></div></button>`).join(""):`<div class="empty">No shoes match "${S.q.replace(/</g,"&lt;")}". Clear the search or pick another category.</div>`}
function cats(){$("#cats").innerHTML=CATS.map(c=>`<button class="chip" data-act="cat" data-v="${c}" aria-pressed="${S.cat===c}">${c}</button>`).join(" ")}
function badge(){$("#cc").textContent=S.cart.reduce((a,i)=>a+i.q,0)}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),1800)}
function show(h){const o=$("#ov");o.innerHTML=h;o.classList.add("on")}
function hide(){$("#ov").classList.remove("on");$("#ov").innerHTML=""}

function open_(id){
const p=P.find(x=>x.id===id);S.sel={id,ci:S.sel&&S.sel.id===id?S.sel.ci:0,size:null};paint()}
function paint(){
const p=P.find(x=>x.id===S.sel.id),s=S.sel;
show(`<div class="modal" role="dialog" aria-modal="true" aria-label="${p.n}" style="position:relative"><button class="x" data-act="close" aria-label="Close">✕</button>
<div class="big" style="${tint(p)}">${shoe(p.k,p.cols[s.ci])}</div>
<div class="det"><div class="meta">${p.c}</div><h2>${p.n}</h2><div class="price" style="font-size:20px">${inr(p.p)}${p.o?`<s>${inr(p.o)}</s>`:""}</div><p class="meta" style="margin-top:10px">${p.d}</p>
<div class="lbl">Colour</div><div class="sw">${p.cols.map((c,i)=>`<button data-act="col" data-i="${i}" style="background:${c}" aria-label="Colour ${i+1}" aria-pressed="${i===s.ci}"></button>`).join("")}</div>
<div class="lbl">Size (UK)</div><div class="sz">${SIZES.map(z=>`<button data-act="size" data-v="${z}" aria-pressed="${s.size===z}">${z}</button>`).join("")}</div>
<button class="pri" data-act="add" ${s.size?"":"disabled"}>${s.size?"Add to cart":"Select a size"}</button></div></div>`)}

const keyOf=i=>i.id+"|"+i.ci+"|"+i.size;
function add(){const s=S.sel,k=keyOf({id:s.id,ci:s.ci,size:s.size});
const f=S.cart.find(i=>keyOf(i)===k);f?f.q++:S.cart.push({id:s.id,ci:s.ci,size:s.size,q:1});
save();badge();hide();toast("Added to cart")}
function totals(){
const sub=S.cart.reduce((a,i)=>a+P.find(p=>p.id===i.id).p*i.q,0);
const disc=S.promo==="STRIDE10"?Math.round(sub*.1):0;
const ship=sub-disc>=5000||!sub?0:149;
return{sub,disc,ship,tot:sub-disc+ship}}
function cart(){
const t=totals();
show(`<aside class="drawer" role="dialog" aria-modal="true" aria-label="Cart"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Your cart</h2><button class="ib" data-act="close">Close</button></div>
${S.cart.length?S.cart.map((i,x)=>{const p=P.find(q=>q.id===i.id);return `<div class="line"><div class="t" style="${tint(p)}">${shoe(p.k,p.cols[i.ci])}</div><div><b>${p.n}</b><div class="meta">UK ${i.size} · ${inr(p.p)}</div><div class="qty"><button data-act="dec" data-x="${x}" aria-label="Decrease">−</button>${i.q}<button data-act="inc" data-x="${x}" aria-label="Increase">+</button> <button class="rm" data-act="del" data-x="${x}">Remove</button></div></div><b>${inr(p.p*i.q)}</b></div>`}).join(""):`<p class="meta" style="padding:30px 0">Your cart is empty. Pick a pair to get started.</p>`}
${S.cart.length?`<div class="sum"><div class="promo"><input id="pc" placeholder="Promo code (try STRIDE10)" value="${S.promo}" aria-label="Promo code"><button data-act="promo">Apply</button></div>
<div><span>Subtotal</span><span>${inr(t.sub)}</span></div>${t.disc?`<div><span>Promo −10%</span><span>−${inr(t.disc)}</span></div>`:""}<div><span>Delivery</span><span>${t.ship?inr(t.ship):"Free"}</span></div><div class="tot"><span>Total</span><span>${inr(t.tot)}</span></div>
<button class="pri" data-act="checkout">Checkout</button></div>`:""}</aside>`)}
function checkout(){
const t=totals();
show(`<aside class="drawer" role="dialog" aria-modal="true" aria-label="Checkout"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Checkout</h2><button class="ib" data-act="cart">Back</button></div>
<form class="co" id="co" novalidate><label>Full name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email"></label><label>Address<input name="addr" autocomplete="street-address"></label>
<div class="two"><label>City<input name="city"></label><label>PIN code<input name="pin" inputmode="numeric" maxlength="6"></label></div>
<label>Card number (demo)<input name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="19"></label>
<div class="err" id="err" role="alert"></div>
<button class="pri" type="submit" style="margin-top:6px">Pay ${inr(t.tot)}</button></form></aside>`)}
function place(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),er=$("#err");
if(f.name.trim().length<2)return er.textContent="Enter your full name.";
if(!/^\S+@\S+\.\S+$/.test(f.email))return er.textContent="Enter a valid email address.";
if(f.addr.trim().length<5||!f.city.trim())return er.textContent="Enter your address and city.";
if(!/^\d{6}$/.test(f.pin))return er.textContent="PIN code must be 6 digits.";
if(f.card.replace(/\s/g,"").length<12)return er.textContent="Enter a valid card number.";
const id="TRD-"+Math.random().toString(36).slice(2,8).toUpperCase(),t=totals();
S.cart=[];S.promo="";save();badge();
show(`<aside class="drawer" role="dialog" aria-modal="true" aria-label="Order placed"><div class="done"><div class="ck">✓</div><h2>Order placed</h2><p>Thanks, ${f.name.split(" ")[0].replace(/</g,"")}. Order <b>${id}</b> for ${inr(t.tot)} is confirmed. A receipt goes to ${f.email.replace(/</g,"")}.</p><button class="pri" data-act="close">Keep shopping</button></div></aside>`)}

document.addEventListener("click",e=>{
const b=e.target.closest("[data-act]");
if(!b){if(e.target.id==="ov")hide();return}
const a=b.dataset.act,x=+b.dataset.x;
if(a==="cat"){S.cat=b.dataset.v;cats();list()}
else if(a==="open")open_(+b.dataset.id);
else if(a==="col"){S.sel.ci=+b.dataset.i;paint()}
else if(a==="size"){S.sel.size=+b.dataset.v;paint()}
else if(a==="add")add();
else if(a==="close")hide();
else if(a==="cart")cart();
else if(a==="inc"){S.cart[x].q++;save();badge();cart()}
else if(a==="dec"){S.cart[x].q>1?S.cart[x].q--:S.cart.splice(x,1);save();badge();cart()}
else if(a==="del"){S.cart.splice(x,1);save();badge();cart()}
else if(a==="promo"){const v=$("#pc").value.trim().toUpperCase();S.promo=v==="STRIDE10"?v:"";cart();toast(S.promo?"Promo applied":"Code not valid")}
else if(a==="checkout")checkout();
});
document.addEventListener("submit",e=>{if(e.target.id==="co")place(e)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")hide()});
$("#q").addEventListener("input",e=>{S.q=e.target.value;list()});
$("#sort").addEventListener("change",e=>{S.sort=e.target.value;list()});
cats();list();badge();
