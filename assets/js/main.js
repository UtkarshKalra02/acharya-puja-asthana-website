/* Spirit Stars — interactions. No libraries. */
(function(){
  "use strict";
  var WA = "917573912655";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document.documentElement;

  /* ---------- Loader ---------- */
  function loaded(){ doc.classList.add("loaded"); }
  window.addEventListener("load", function(){ setTimeout(loaded, 350); });
  setTimeout(loaded, 2500);

  /* ---------- Starfield ---------- */
  var c = document.getElementById("sky");
  if (c && c.getContext){
    var x = c.getContext("2d"), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), stars = [], shoot = null, mouse = {x:-999,y:-999};
    function size(){
      W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
      var n = Math.round(innerWidth * innerHeight / 5200);
      stars = [];
      for (var i = 0; i < n; i++) stars.push({
        x: Math.random()*W, y: Math.random()*H, r: (Math.random()*1.3 + .25)*dpr,
        a: Math.random(), s: Math.random()*.015 + .003, gold: Math.random() < .14, z: Math.random()*.6 + .2
      });
    }
    size(); addEventListener("resize", size);
    addEventListener("mousemove", function(e){ mouse.x = e.clientX*dpr; mouse.y = e.clientY*dpr; });
    var scrollY0 = 0;
    function frame(){
      x.clearRect(0,0,W,H);
      var sy = (window.scrollY || 0) * dpr;
      var near = [];
      for (var i = 0; i < stars.length; i++){
        var s = stars[i];
        s.a += s.s; var tw = .45 + Math.sin(s.a*3)*.4;
        var py = ((s.y - sy*s.z*.15) % H + H) % H;
        x.beginPath(); x.arc(s.x, py, s.r, 0, 6.283);
        x.fillStyle = s.gold ? "rgba(230,199,122,"+tw+")" : "rgba(246,240,228,"+(tw*.85)+")";
        x.fill();
        var dx = s.x - mouse.x, dy = py - mouse.y;
        if (dx*dx + dy*dy < (150*dpr)*(150*dpr)) near.push([s.x, py]);
      }
      /* constellation lines near the cursor */
      if (near.length > 1){
        x.lineWidth = .6*dpr;
        for (var a = 0; a < near.length; a++) for (var b = a+1; b < near.length; b++){
          var ddx = near[a][0]-near[b][0], ddy = near[a][1]-near[b][1], d = Math.sqrt(ddx*ddx+ddy*ddy);
          if (d < 90*dpr){ x.strokeStyle = "rgba(230,199,122,"+(.35*(1-d/(90*dpr)))+")"; x.beginPath(); x.moveTo(near[a][0],near[a][1]); x.lineTo(near[b][0],near[b][1]); x.stroke(); }
        }
      }
      /* shooting star */
      if (!shoot && Math.random() < .004) shoot = {x: Math.random()*W*.8, y: Math.random()*H*.4, l: 0, v: (8+Math.random()*6)*dpr};
      if (shoot){
        shoot.l += 1; var len = 120*dpr, sx = shoot.x + shoot.l*shoot.v, sy2 = shoot.y + shoot.l*shoot.v*.45;
        var g = x.createLinearGradient(sx, sy2, sx-len, sy2-len*.45);
        g.addColorStop(0,"rgba(255,243,207,.9)"); g.addColorStop(1,"rgba(255,243,207,0)");
        x.strokeStyle = g; x.lineWidth = 1.4*dpr; x.beginPath(); x.moveTo(sx,sy2); x.lineTo(sx-len, sy2-len*.45); x.stroke();
        if (shoot.l > 60) shoot = null;
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------- Zodiac wheel (SVG drawn here to keep HTML light) ---------- */
  var signs = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  var names = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
  var grahas = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
  function wheel(el){
    var ns = "http://www.w3.org/2000/svg", s = '<svg viewBox="0 0 400 400" xmlns="'+ns+'" aria-hidden="true"><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8812f"/><stop offset=".5" stop-color="#e6c77a"/><stop offset="1" stop-color="#c9a24b"/></linearGradient></defs>';
    s += '<circle cx="200" cy="200" r="196" fill="none" stroke="url(#gg)" stroke-width=".8"/>';
    s += '<circle cx="200" cy="200" r="182" fill="none" stroke="url(#gg)" stroke-width=".5" opacity=".7"/>';
    s += '<circle cx="200" cy="200" r="148" fill="none" stroke="url(#gg)" stroke-width=".6"/>';
    for (var i = 0; i < 72; i++){
      var a = i*5*Math.PI/180, r1 = 182, r2 = i%6===0 ? 170 : 177;
      s += '<line x1="'+(200+r1*Math.cos(a)).toFixed(1)+'" y1="'+(200+r1*Math.sin(a)).toFixed(1)+'" x2="'+(200+r2*Math.cos(a)).toFixed(1)+'" y2="'+(200+r2*Math.sin(a)).toFixed(1)+'" stroke="#c9a24b" stroke-width="'+(i%6===0?.8:.4)+'" opacity=".8"/>';
    }
    for (var k = 0; k < 12; k++){
      var b = (k*30 - 90)*Math.PI/180, bm = (k*30 - 75)*Math.PI/180;
      s += '<line x1="'+(200+148*Math.cos(b)).toFixed(1)+'" y1="'+(200+148*Math.sin(b)).toFixed(1)+'" x2="'+(200+170*Math.cos(b)).toFixed(1)+'" y2="'+(200+170*Math.sin(b)).toFixed(1)+'" stroke="#c9a24b" stroke-width=".6"/>';
      s += '<text x="'+(200+159*Math.cos(bm)).toFixed(1)+'" y="'+(200+159*Math.sin(bm)).toFixed(1)+'" fill="#e6c77a" font-size="15" text-anchor="middle" dominant-baseline="central" font-family="serif">'+signs[k]+'︎</text>';
      s += '<text x="'+(200+189*Math.cos(bm)).toFixed(1)+'" y="'+(200+189*Math.sin(bm)).toFixed(1)+'" fill="#f6f0e4" opacity=".55" font-size="5.6" letter-spacing="1" text-anchor="middle" dominant-baseline="central" font-family="Jost,sans-serif" transform="rotate('+(k*30-75+90)+' '+(200+189*Math.cos(bm)).toFixed(1)+' '+(200+189*Math.sin(bm)).toFixed(1)+')">'+names[k].toUpperCase()+'</text>';
    }
    s += '</svg>';
    el.innerHTML = s;
  }
  function inner(el){
    var s = '<svg viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="196" fill="none" stroke="#c9a24b" stroke-width=".6" stroke-dasharray="2 6" opacity=".8"/>';
    for (var i = 0; i < grahas.length; i++){
      var a = (i*40 - 90)*Math.PI/180;
      s += '<circle cx="'+(200+196*Math.cos(a)).toFixed(1)+'" cy="'+(200+196*Math.sin(a)).toFixed(1)+'" r="13" fill="#0e1838" stroke="#c9a24b" stroke-width=".7"/>';
      s += '<text x="'+(200+196*Math.cos(a)).toFixed(1)+'" y="'+(200+196*Math.sin(a)).toFixed(1)+'" fill="#e6c77a" font-size="13" text-anchor="middle" dominant-baseline="central" font-family="serif">'+grahas[i]+'︎</text>';
    }
    /* star of 12 lines (house chart feel) */
    for (var j = 0; j < 6; j++){
      var p = j*30*Math.PI/180;
      s += '<line x1="'+(200+150*Math.cos(p)).toFixed(1)+'" y1="'+(200+150*Math.sin(p)).toFixed(1)+'" x2="'+(200-150*Math.cos(p)).toFixed(1)+'" y2="'+(200-150*Math.sin(p)).toFixed(1)+'" stroke="#c9a24b" stroke-width=".35" opacity=".45"/>';
    }
    el.innerHTML = s + '</svg>';
  }
  document.querySelectorAll(".wheel").forEach(wheel);
  document.querySelectorAll(".wheel-inner").forEach(inner);

  /* ---------- Header + menu ---------- */
  var header = document.querySelector(".site-header");
  function onScroll(){ if (header) header.classList.toggle("scrolled", (window.scrollY||0) > 30); }
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
  var burger = document.querySelector(".burger");
  if (burger) burger.addEventListener("click", function(){
    var open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".menu a").forEach(function(a){ a.addEventListener("click", function(){ document.body.classList.remove("nav-open"); }); });

  /* ---------- Split headline words ---------- */
  document.querySelectorAll(".split-text").forEach(function(h){
    var html = h.innerHTML, out = "", parts = html.split(/(<[^>]+>|\s+)/);
    var gold = false;
    parts.forEach(function(p){
      if (!p) return;
      if (/^<span class="gold">$/.test(p)){ gold = true; return; }
      if (gold && p === "</span>"){ gold = false; return; }
      if (p.charAt(0) === "<"){ out += p; return; }
      if (/^\s+$/.test(p)){ out += " "; return; }
      out += '<span class="w"><span' + (gold ? ' class="gold"' : '') + '>' + p + '</span></span>';
    });
    h.innerHTML = out;
    h.querySelectorAll(".w>span").forEach(function(s, i){ s.style.transitionDelay = (0.15 + i*0.06) + "s"; });
  });

  /* ---------- Reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.14, rootMargin:"0px 0px -40px 0px"}) : null;
  document.querySelectorAll(".rv,.split-text").forEach(function(el){ io ? io.observe(el) : el.classList.add("in"); });

  /* ---------- Card tilt + cursor glow (desktop only) ---------- */
  var fine = window.matchMedia && matchMedia("(pointer:fine)").matches;
  if (fine && !reduce){
    document.querySelectorAll(".card").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect(), px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
        card.style.transform = "perspective(900px) rotateY("+(px*6)+"deg) rotateX("+(-py*6)+"deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
    });
    var glow = document.querySelector(".cursor-glow");
    if (glow) addEventListener("mousemove", function(e){ glow.style.left = e.clientX+"px"; glow.style.top = e.clientY+"px"; });
  }

  /* ---------- WhatsApp helpers ---------- */
  function waLink(text){ return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }
  document.querySelectorAll("[data-wa]").forEach(function(a){
    a.setAttribute("href", waLink(a.getAttribute("data-wa") || "Namaste, I would like to book a consultation with Spirit Stars."));
    a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener");
    a.addEventListener("click", function(){ track("whatsapp_click", a.getAttribute("data-wa")); });
  });
  var fab = document.querySelector(".fab.wa");
  if (fab){ setTimeout(function(){ fab.classList.add("hint"); setTimeout(function(){ fab.classList.remove("hint"); }, 5000); }, 6000); }

  /* Analytics hook: fires GA4 / Meta Pixel events once those tags are added in <head> */
  function track(name, label){
    try{ if (window.gtag) gtag("event", name, {event_label: label || ""}); }catch(e){}
    try{ if (window.fbq) fbq("track", "Contact"); }catch(e){}
  }
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){ a.addEventListener("click", function(){ track("call_click"); }); });

  /* ---------- Booking form -> WhatsApp (no server needed) ---------- */
  document.querySelectorAll("form.book").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var d = new FormData(f), name = (d.get("name")||"").toString().trim(), phone = (d.get("phone")||"").toString().trim();
      var msg = f.querySelector(".form-msg");
      if (!name || !/^[0-9+\s-]{8,15}$/.test(phone)){ msg.textContent = "Please enter your name and a valid phone number."; return; }
      var t = "Namaste Acharya Puja ji, I would like to book a consultation.\n\nName: " + name + "\nPhone: " + phone + "\nService: " + (d.get("service")||"");
      if (d.get("dob")) t += "\nDate of birth: " + d.get("dob");
      if (d.get("tob")) t += "\nTime of birth: " + d.get("tob");
      if (d.get("pob")) t += "\nPlace of birth: " + d.get("pob");
      if (d.get("note")) t += "\nQuery: " + d.get("note");
      var url = waLink(t);
      track("generate_lead", d.get("service"));
      msg.innerHTML = 'Opening WhatsApp… If it does not open, <a href="'+url+'" target="_blank" rel="noopener" style="text-decoration:underline">tap here to send your details</a>.';
      var w = null; try{ w = window.open(url, "_blank", "noopener"); }catch(err){}
    });
  });

  /* ---------- Exit-intent pop-up (once per visit) ---------- */
  var modal = document.querySelector(".modal");
  if (modal){
    var shown = false;
    try{ shown = sessionStorage.getItem("ss_exit") === "1"; }catch(e){}
    function openM(){
      if (shown) return; shown = true;
      try{ sessionStorage.setItem("ss_exit","1"); }catch(e){}
      modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
      var b = modal.querySelector(".modal-x"); if (b) b.focus();
    }
    function closeM(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
    document.addEventListener("mouseout", function(e){ if (!e.relatedTarget && e.clientY < 8) openM(); });
    setTimeout(function(){ if ((window.scrollY||0) > innerHeight*1.5) openM(); }, 45000); /* mobile fallback */
    modal.addEventListener("click", function(e){ if (e.target === modal || e.target.closest(".modal-x")) closeM(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeM(); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function(s){ s.textContent = new Date().getFullYear(); });
})();
