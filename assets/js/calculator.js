/* Spirit Stars — free numerology calculator (all maths runs in the browser; nothing is sent anywhere) */
(function(){
  "use strict";
  var LIMIT = 3, KEY = "ss_calc_" + new Date().toISOString().slice(0,10);
  var WA = "917573912655";
  var PAGE = "https://utkarshkalra02.github.io/acharya-puja-asthana-website/free-numerology-calculator.html"; // keep in sync with the live domain

  var N = {
    1:{p:"Sun (Surya)",t:"Leadership, independence and drive. You like to start things and be seen; watch for ego and impatience."},
    2:{p:"Moon (Chandra)",t:"Sensitivity, intuition and care. A natural partner and peacemaker; guard against mood swings and over-thinking."},
    3:{p:"Jupiter (Guru)",t:"Wisdom, optimism and a teaching nature. Respected for knowledge; avoid over-commitment and preaching."},
    4:{p:"Rahu",t:"Hard work, structure and unconventional thinking. Sudden turns in life; patience and discipline bring results."},
    5:{p:"Mercury (Budh)",t:"Communication, business sense and adaptability. Quick and witty; needs focus to avoid scattered energy."},
    6:{p:"Venus (Shukra)",t:"Beauty, love, comfort and creativity. Family-minded and artistic; balance indulgence with responsibility."},
    7:{p:"Ketu",t:"Spirituality, research and inner insight. A deep thinker; may feel detached — grounding routines help."},
    8:{p:"Saturn (Shani)",t:"Patience, justice and long-term success. Rewards come late but last; avoid pessimism and isolation."},
    9:{p:"Mars (Mangal)",t:"Courage, energy and protectiveness. A fighter for causes; channel anger into action."}
  };
  /* Planetary friendships (Parashari naisargika maitri); Rahu treated like Saturn, Ketu like Mars */
  var FRIEND = {1:[2,3,9],2:[1,5],3:[1,2,9],4:[5,6,8],5:[1,6],6:[5,8,4],7:[1,3,9],8:[5,6,4],9:[1,2,3,7]};
  var ENEMY  = {1:[6,8,4],2:[],3:[5,6],4:[1,2,9],5:[2],6:[1,2],7:[5,2],8:[1,2,9],9:[5]};
  var CHAL = {a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,s:3,t:4,u:6,v:6,w:6,x:5,y:1,z:7};
  var LOSHU = [4,9,2,3,5,7,8,1,6];

  function reduce(n){ while (n > 9) n = String(n).split("").reduce(function(a,d){return a + +d;},0); return n; }
  function digitSum(s){ return String(s).replace(/\D/g,"").split("").reduce(function(a,d){return a + +d;},0); }

  function used(){ try{ return +localStorage.getItem(KEY) || 0; }catch(e){ return 0; } }
  function bump(){ try{ localStorage.setItem(KEY, used()+1); }catch(e){} }
  function left(){ return Math.max(0, LIMIT - used()); }
  function paintLeft(){ document.querySelectorAll("[data-left]").forEach(function(el){ el.textContent = left(); }); }

  function wa(text){ return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }
  function share(text){ return "https://wa.me/?text=" + encodeURIComponent(text + "\n\nFind yours free: " + PAGE); }

  /* Free readings used up: send the visitor straight to WhatsApp with their details pre-filled */
  function toWhatsApp(box, text){
    var url = wa(text + "\n\n(I have used today's 3 free readings on the website calculator.)");
    track("calculator_limit_whatsapp");
    box.hidden = false;
    box.innerHTML = '<p class="calc-left">Today\u2019s free readings are used up — opening WhatsApp so Acharya Puja Asthana can give you the full reading. ' +
      '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--gold-2);text-decoration:underline">Tap here if it didn\u2019t open</a>.</p>';
    var w = null;
    try{ w = window.open(url, "_blank"); if (w) w.opener = null; }catch(e){}
    if (!w){  /* pop-up blocked: go there in this tab */ try{ window.location.href = url; }catch(e){} }
  }
  function gate(box, text){
    if (left() <= 0){ toWhatsApp(box, text); return false; }
    bump(); paintLeft(); track("calculator_use"); return true;
  }
  function track(n){ try{ if (window.gtag) gtag("event", n); }catch(e){} }

  function numBlock(label, n, sub){
    return '<div class="calc-num"><span>' + label + '</span><b>' + n + '</b><small>' + (sub || N[n].p) + '</small></div>';
  }
  function show(box, html, shareText, waText){
    box.innerHTML = html +
      '<div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + wa(waText) + '">Unlock full reading</a>' +
      '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + share(shareText) + '">Share my result</a></div>' +
      '<p class="calc-left">Free readings left today: <b data-left>' + left() + '</b> of ' + LIMIT + '</p>';
    box.hidden = false;
    box.classList.remove("pop"); void box.offsetWidth; box.classList.add("pop");
    box.scrollIntoView({behavior:"smooth", block:"nearest"});
  }

  /* ---- 1. Mulank, Bhagyank & Lo Shu grid ---- */
  var f1 = document.getElementById("calc-dob");
  if (f1) f1.addEventListener("submit", function(e){
    e.preventDefault();
    var box = document.getElementById("out-dob"), v = f1.dob.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)){ box.hidden = false; box.innerHTML = '<p class="calc-err">Please choose your full date of birth.</p>'; return; }
    if (!gate(box, "Namaste, I would like a numerology consultation. My date of birth is " + v.split("-").reverse().join("-") + ".")) return;
    var p = v.split("-"), day = +p[2], mul = reduce(day), bha = reduce(digitSum(v));
    var digits = (p[2] + p[1] + p[0]).replace(/0/g,"").split("").map(Number);
    if (day > 9) digits.push(mul);   /* common practice: add Mulank when the birth day is two digits */
    digits.push(bha);
    var count = {}; digits.forEach(function(d){ count[d] = (count[d]||0) + 1; });
    var missing = [], grid = "";
    LOSHU.forEach(function(n){
      var c = count[n] || 0; if (!c) missing.push(n);
      grid += '<div class="' + (c ? "on" : "off") + '">' + (c ? String(n).repeat(c) : "") + '<i>' + n + '</i></div>';
    });
    var rel = FRIEND[mul].indexOf(bha) > -1 || mul === bha ? "supportive" : (ENEMY[mul].indexOf(bha) > -1 ? "challenging — remedies help" : "neutral");
    var html = '<div class="calc-nums">' + numBlock("Mulank · Driver", mul) + numBlock("Bhagyank · Conductor", bha) + '</div>' +
      '<p><b>Mulank ' + mul + ' — ' + N[mul].p + ':</b> ' + N[mul].t + '</p>' +
      '<p><b>Bhagyank ' + bha + ' — ' + N[bha].p + ':</b> ' + N[bha].t + '</p>' +
      '<p><b>Mulank–Bhagyank combination:</b> ' + rel + '.</p>' +
      '<h4>Your Lo Shu grid</h4><div class="loshu">' + grid + '</div>' +
      '<p>' + (missing.length ? '<b>Missing numbers:</b> ' + missing.sort().join(", ") + '. Missing numbers point to energies you may need to build consciously.' : 'No missing numbers — a well-balanced grid.') + '</p>' +
      '<div class="calc-locked"><div class="blur">Remedies for each missing number · colours and days that suit you · lucky years ahead · career and relationship pointers</div>' +
      '<span>Remedies are part of the DOB analysis (₹1,400)</span></div>';
    show(box, html, "My Mulank is " + mul + " (" + N[mul].p + ") and Bhagyank is " + bha + " (" + N[bha].p + ")" + (missing.length ? ", missing numbers " + missing.join(", ") : "") + ".",
      "Namaste, I used the free calculator. My DOB is " + v.split("-").reverse().join("-") + " (Mulank " + mul + ", Bhagyank " + bha + ", missing " + (missing.join(", ") || "none") + "). I would like the DOB analysis with remedies (₹1,400).");
  });

  /* ---- 2. Name number (Chaldean) ---- */
  var f2 = document.getElementById("calc-name");
  if (f2) f2.addEventListener("submit", function(e){
    e.preventDefault();
    var box = document.getElementById("out-name"), name = f2.fullname.value.trim(), letters = name.toLowerCase().replace(/[^a-z]/g,"");
    if (letters.length < 2){ box.hidden = false; box.innerHTML = '<p class="calc-err">Please type your name in English letters.</p>'; return; }
    if (!gate(box, "Namaste, I would like a numerology consultation for my name: " + name + ".")) return;
    var total = letters.split("").reduce(function(a,c){ return a + CHAL[c]; },0), n = reduce(total);
    var html = '<div class="calc-nums">' + numBlock("Name number", n) + numBlock("Compound", total, "before reduction") + '</div>' +
      '<p><b>' + esc(name) + '</b> vibrates to <b>' + n + '</b> — ' + N[n].p + '. ' + N[n].t + '</p>' +
      '<div class="calc-locked"><div class="blur">Does this name support your Mulank and Bhagyank? · suggested spelling changes · lucky name number for your business</div>' +
      '<span>Name correction with Acharya ji — ₹905</span></div>';
    show(box, html, "My name number is " + n + " (" + N[n].p + ").", "Namaste, I used the free calculator. My name '" + name + "' gives name number " + n + ". I would like a name correction consultation (₹905).");
  });

  /* ---- 3. Mobile number check ---- */
  var f3 = document.getElementById("calc-mobile");
  if (f3) f3.addEventListener("submit", function(e){
    e.preventDefault();
    var box = document.getElementById("out-mobile"), mob = f3.mobile.value.replace(/\D/g,"").slice(-10), d = +f3.day.value;
    if (mob.length !== 10 || !(d >= 1 && d <= 31)){ box.hidden = false; box.innerHTML = '<p class="calc-err">Enter a 10-digit mobile number and your day of birth (1–31).</p>'; return; }
    if (!gate(box, "Namaste, I would like to check if my mobile number " + mob + " suits me. My day of birth is " + d + ".")) return;
    var mn = reduce(digitSum(mob)), mul = reduce(d);
    var verdict = mn === mul || FRIEND[mul].indexOf(mn) > -1 ? ["Supportive","This number is friendly to your Mulank."]
      : ENEMY[mul].indexOf(mn) > -1 ? ["Not ideal","This number clashes with your Mulank — worth reviewing before your next SIM change."]
      : ["Neutral","Neither strongly supportive nor against your Mulank."];
    var html = '<div class="calc-nums">' + numBlock("Mobile number total", mn) + numBlock("Your Mulank", mul) + '</div>' +
      '<p class="calc-verdict"><b>' + verdict[0] + '.</b> ' + verdict[1] + '</p>' +
      '<div class="calc-locked"><div class="blur">Digit-pair analysis · repeating and missing digits · a shortlist of lucky number patterns for you</div>' +
      '<span>Number suggestions with Acharya ji — ₹905</span></div>';
    show(box, html, "My mobile number is " + verdict[0].toLowerCase() + " for my Mulank " + mul + ".", "Namaste, I used the free calculator: my mobile number total is " + mn + " and my Mulank is " + mul + " (" + verdict[0] + "). I would like lucky mobile number suggestions (₹905).");
  });

  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

  /* ---- tabs ---- */
  var tabs = document.querySelectorAll("[role=tab]");
  tabs.forEach(function(t){
    t.addEventListener("click", function(){
      tabs.forEach(function(x){ x.setAttribute("aria-selected", x === t ? "true" : "false"); document.getElementById(x.getAttribute("aria-controls")).hidden = x !== t; });
      try{ history.replaceState(null, "", "#" + t.id.replace("tab-","")); }catch(e){}
    });
  });
  var h = (location.hash || "").slice(1);
  if (h){ var tt = document.getElementById("tab-" + h); if (tt) tt.click(); }
  paintLeft();
})();
