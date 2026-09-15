/* ============ SENTINEL-ID · single JS file ============ */

// ---------- Mock data ----------
const MOCK = {
  kpis: { scannedToday:4287, flagged:63, verified:4224, avgLatencyMs:812 },
  recentScans: [
    { id:"SC-88214", name:"Rohan Verma",       doc:"Passport · IND", country:"India",   risk:12, status:"cleared", time:"11:42:08" },
    { id:"SC-88213", name:"Aleksei Petrov",    doc:"Passport · RUS", country:"Russia",  risk:87, status:"flagged", time:"11:41:55" },
    { id:"SC-88212", name:"Priya Sharma",      doc:"Aadhaar · IND",  country:"India",   risk:5,  status:"cleared", time:"11:41:22" },
    { id:"SC-88211", name:"Chen Wei",          doc:"Passport · CHN", country:"China",   risk:34, status:"review",  time:"11:40:47" },
    { id:"SC-88210", name:"Mohammed Yusuf",    doc:"Visa · UAE",     country:"UAE",     risk:8,  status:"cleared", time:"11:40:09" },
    { id:"SC-88209", name:"Nguyen Van An",     doc:"Passport · VNM", country:"Vietnam", risk:71, status:"flagged", time:"11:39:31" },
    { id:"SC-88208", name:"Anjali Iyer",       doc:"Passport · IND", country:"India",   risk:3,  status:"cleared", time:"11:38:55" },
    { id:"SC-88207", name:"Robert Fischer",    doc:"Passport · DEU", country:"Germany", risk:19, status:"cleared", time:"11:38:12" },
    { id:"SC-88206", name:"Fatima Al-Zahra",   doc:"Passport · SAU", country:"Saudi",   risk:26, status:"cleared", time:"11:37:44" },
    { id:"SC-88205", name:"UNKNOWN [MASKED]",  doc:"Passport · ???", country:"Unknown", risk:94, status:"flagged", time:"11:37:01" }
  ],
  alerts: [
    { id:"AL-1042", severity:"critical", title:"Blacklist Match — Interpol Red Notice",  subject:"UNKNOWN [MASKED]", checkpoint:"Attari, IND",    time:"2 min ago",  status:"open" },
    { id:"AL-1041", severity:"high",     title:"Facial mismatch: 41% similarity",         subject:"Aleksei Petrov",   checkpoint:"IGI T3, IND",    time:"5 min ago",  status:"open" },
    { id:"AL-1040", severity:"high",     title:"Altered MRZ checksum invalid",            subject:"Nguyen Van An",    checkpoint:"Kolkata Air",    time:"12 min ago", status:"open" },
    { id:"AL-1039", severity:"medium",   title:"Duplicate identity — 3 aliases detected", subject:"Chen Wei",         checkpoint:"IGI T3, IND",    time:"18 min ago", status:"review" },
    { id:"AL-1038", severity:"medium",   title:"Photo tampering signature (ELA)",         subject:"Ibrahim Kone",     checkpoint:"Bengaluru Air",  time:"34 min ago", status:"review" },
    { id:"AL-1037", severity:"low",      title:"Visa expired — 4 days",                   subject:"Hana Kim",         checkpoint:"Chennai Air",    time:"1 hr ago",   status:"closed" },
    { id:"AL-1036", severity:"critical", title:"Blacklist Match — MHA Watchlist",         subject:"[REDACTED-77]",    checkpoint:"Petrapole, IND", time:"1 hr ago",   status:"closed" },
    { id:"AL-1035", severity:"low",      title:"Low-quality scan — retake advised",       subject:"Elena Rossi",      checkpoint:"Mumbai Air",     time:"2 hr ago",   status:"closed" }
  ],
  weekly: [
    { d:"Mon", scans:3410 }, { d:"Tue", scans:3888 }, { d:"Wed", scans:4102 },
    { d:"Thu", scans:3990 }, { d:"Fri", scans:4620 }, { d:"Sat", scans:5140 }, { d:"Sun", scans:4287 }
  ],
  fraudTypes: [
    { label:"Photo tampering",   value:34, color:"#F5A524" },
    { label:"MRZ mismatch",      value:22, color:"#EF4444" },
    { label:"Multi-identity",    value:18, color:"#8B5CF6" },
    { label:"Expired documents", value:14, color:"#3B82F6" },
    { label:"Blacklist match",   value:12, color:"#22C55E" }
  ]
};

// ---------- Toast ----------
function toast(msg, type=""){
  const host = document.getElementById("toastHost");
  const t = document.createElement("div");
  t.className = "toast " + type; t.textContent = msg;
  host.appendChild(t);
  setTimeout(()=>{ t.style.opacity=0; t.style.transform="translateX(20px)"; setTimeout(()=>t.remove(),300); }, 3200);
}

// ---------- Tab switching ----------
function switchTab(name){
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.id === name));
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.toggle("active", a.dataset.tab === name));
  window.scrollTo({top:0, behavior:"smooth"});
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-tab]");
  if(!a) return;
  e.preventDefault();
  switchTab(a.dataset.tab);
});

// ---------- Dashboard ----------
function renderDashboard(){
  const k = MOCK.kpis;
  document.getElementById("kpis").innerHTML = `
    <div class="kpi amber"><div class="l">Scanned today <div class="ic"><i class="fa-solid fa-id-card"></i></div></div><div class="v">${k.scannedToday.toLocaleString()}</div><div class="d up">▲ 12.4% vs yesterday</div></div>
    <div class="kpi green"><div class="l">Cleared <div class="ic"><i class="fa-solid fa-check"></i></div></div><div class="v">${k.verified.toLocaleString()}</div><div class="d up">▲ 11.9%</div></div>
    <div class="kpi red"><div class="l">Flagged <div class="ic"><i class="fa-solid fa-triangle-exclamation"></i></div></div><div class="v">${k.flagged}</div><div class="d down">▲ 8 vs avg</div></div>
    <div class="kpi blue"><div class="l">Avg latency <div class="ic"><i class="fa-solid fa-bolt"></i></div></div><div class="v">${k.avgLatencyMs}<small style="font-size:1rem; color:var(--muted)">ms</small></div><div class="d up">▼ 68ms faster</div></div>
  `;

  document.getElementById("feedBody").innerHTML = MOCK.recentScans.map(r=>{
    const badge = r.status==="cleared" ? '<span class="pill green"><span class="dot"></span>cleared</span>'
                : r.status==="flagged" ? '<span class="pill red"><span class="dot"></span>flagged</span>'
                : '<span class="pill amber"><span class="dot"></span>review</span>';
    const rc = r.risk>=70?"red":(r.risk>=30?"amber":"green");
    return `<tr>
      <td class="mono" style="color:var(--muted)">${r.id}</td>
      <td>${r.name}</td>
      <td class="mono" style="font-size:.82rem">${r.doc}</td>
      <td>${r.country}</td>
      <td><span class="pill ${rc}">${r.risk}</span></td>
      <td>${badge}</td>
      <td class="mono" style="color:var(--muted)">${r.time}</td>
    </tr>`;
  }).join("");

  const max = Math.max(...MOCK.weekly.map(x=>x.scans));
  document.getElementById("weeklyBars").innerHTML = MOCK.weekly.map(w=>{
    const h = (w.scans/max*100).toFixed(1);
    return `<div class="bar" style="height:${h}%" data-l="${w.d}" data-v="${w.scans}"></div>`;
  }).join("");
}

// ---------- Scan (mock AI) ----------
let currentSample = null;

function setPreview(url, label){
  const imgBox = document.getElementById("imgBox");
  const overlay = document.getElementById("overlay");
  document.getElementById("emptyMsg").style.display = "none";
  let img = imgBox.querySelector("img");
  if(!img){ img = document.createElement("img"); imgBox.insertBefore(img, overlay); }
  img.src = url;
  const dt = document.getElementById("docType");
  dt.textContent = label; dt.className = "pill amber mono";
  document.getElementById("analyzeBtn").disabled = false;
}

function makePassportSVG(kind){
  const forged = kind === "forged";
  const name = forged ? "PETROV, ALEKSEI" : "VERMA, ROHAN";
  const no   = "M4820174";
  const dob  = forged ? "14 MAR 1988" : "14 MAR 1992";
  const nat  = forged ? "RUS" : "IND";
  const bg   = forged ? "#1E1A2A" : "#1A2138";
  const stripe = forged ? "#8B5CF6" : "#F5A524";
  const country = forged ? "RUSSIA" : "INDIA";
  const smudge = forged ? '<rect x="60" y="120" width="120" height="18" fill="#EF4444" opacity="0.25"/>' : "";
  const mrzColor = forged ? "#EF4444" : "#E8EEF7";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#0F1524"/></linearGradient></defs>
    <rect width="640" height="420" fill="url(#g)"/>
    <rect width="640" height="42" fill="${stripe}" opacity=".85"/>
    <text x="20" y="28" font-family="monospace" font-size="16" fill="#0A0E1A" font-weight="700">REPUBLIC OF ${country}</text>
    <text x="500" y="28" font-family="monospace" font-size="14" fill="#0A0E1A">PASSPORT</text>
    <rect x="30" y="90" width="140" height="180" rx="6" fill="#2A3550"/>
    <circle cx="100" cy="150" r="30" fill="#4A5878"/>
    <ellipse cx="100" cy="230" rx="45" ry="30" fill="#3A4568"/>
    ${smudge}
    <g font-family="monospace" fill="#E8EEF7">
      <text x="200" y="105" font-size="10" fill="#8291A8">SURNAME / GIVEN NAMES</text>
      <text x="200" y="128" font-size="18" font-weight="600">${name}</text>
      <text x="200" y="160" font-size="10" fill="#8291A8">PASSPORT NO.</text>
      <text x="200" y="180" font-size="16">${no}</text>
      <text x="400" y="160" font-size="10" fill="#8291A8">NATIONALITY</text>
      <text x="400" y="180" font-size="16">${nat}</text>
      <text x="200" y="215" font-size="10" fill="#8291A8">DATE OF BIRTH</text>
      <text x="200" y="235" font-size="16">${dob}</text>
      <text x="400" y="215" font-size="10" fill="#8291A8">SEX</text>
      <text x="400" y="235" font-size="16">M</text>
    </g>
    <rect x="20" y="320" width="600" height="80" fill="#0A0E1A" opacity=".6" rx="4"/>
    <text x="30" y="352" font-family="monospace" font-size="14" fill="${mrzColor}">P&lt;${nat}${name.replace(", ","&lt;&lt;").replace(/ /g,"&lt;")}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
    <text x="30" y="378" font-family="monospace" font-size="14" fill="${mrzColor}">${no}${forged?"2":"3"}${nat}${forged?"8803148":"9203148"}M2803152&lt;&lt;&lt;&lt;&lt;&lt;0${forged?"1":"6"}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function mkOCR(name, no, nat, dob, sex, issue, expiry){
  return `<div><span class="k">SURNAME/NAMES</span> · <span class="v">${name}</span></div>
    <div><span class="k">PASSPORT NO.</span> · <span class="v">${no}</span></div>
    <div><span class="k">NATIONALITY</span> · <span class="v">${nat}</span></div>
    <div><span class="k">DOB</span> · <span class="v">${dob}</span> &nbsp; <span class="k">SEX</span> · <span class="v">${sex}</span></div>
    <div><span class="k">ISSUE</span> · <span class="v">${issue}</span> &nbsp; <span class="k">EXPIRY</span> · <span class="v">${expiry}</span></div>`;
}

function renderResults(risk, checks, ocr, verdictLabel, verdictClass){
  document.getElementById("results").style.display = "block";
  document.getElementById("waitCard").style.display = "none";
  document.getElementById("riskFill").style.width = risk + "%";
  document.getElementById("riskVal").textContent = risk;
  const vp = document.getElementById("verdictPill");
  vp.textContent = verdictLabel;
  vp.className = "pill mono " + verdictClass;
  document.getElementById("checks").innerHTML = checks.map(c=>`
    <div class="check-row">
      <div class="l"><i class="fa-solid ${c.ok?'fa-circle-check':'fa-circle-xmark'}" style="color:${c.ok?'var(--green)':'var(--red)'}"></i> ${c.l}</div>
      <span class="mono" style="color:${c.ok?'var(--muted)':'var(--red)'}">${c.v}</span>
    </div>`).join("");
  document.getElementById("ocr").innerHTML = ocr;
}

function runScreening(){
  const overlay = document.getElementById("overlay");
  const btn = document.getElementById("analyzeBtn");
  overlay.classList.add("active");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analysing…';

  setTimeout(()=>{
    overlay.classList.remove("active");
    let risk, checks, ocr, label, cls;

    if(currentSample === "forged"){
      risk = 87;
      checks = [
        {l:"OCR field extraction", v:"OK", ok:true},
        {l:"MRZ checksum (ICAO 9303)", v:"FAIL — digit 8 invalid", ok:false},
        {l:"Photo tampering (ELA)", v:"HIGH — cluster @ 62,148", ok:false},
        {l:"Hologram signature", v:"MISSING", ok:false},
        {l:"Face quality", v:"OK", ok:true},
        {l:"Watchlist (Interpol)", v:"1 match · 82% conf.", ok:false},
        {l:"Multi-identity graph", v:"3 aliases across 2 checkpoints", ok:false},
        {l:"Document age vs. issue", v:"WARN — paper age <3yr, style pre-2018", ok:false}
      ];
      ocr = mkOCR("PETROV, ALEKSEI","M4820174","RUS","14 MAR 1988","M","15 MAR 2025","14 MAR 2035");
      label = "FLAGGED · HIGH RISK"; cls = "red";
    } else if(currentSample === "genuine"){
      risk = 8;
      checks = [
        {l:"OCR field extraction", v:"OK", ok:true},
        {l:"MRZ checksum (ICAO 9303)", v:"OK — all digits match", ok:true},
        {l:"Photo tampering (ELA)", v:"clean", ok:true},
        {l:"Hologram signature", v:"OK · IND-2018 emblem", ok:true},
        {l:"Face quality", v:"OK · sharp, centered", ok:true},
        {l:"Watchlist match", v:"no match", ok:true},
        {l:"Multi-identity graph", v:"unique identity", ok:true},
        {l:"Document age vs. issue", v:"consistent", ok:true}
      ];
      ocr = mkOCR("VERMA, ROHAN","M4820174","IND","14 MAR 1992","M","22 JUN 2022","21 JUN 2032");
      label = "CLEARED"; cls = "green";
    } else {
      risk = Math.floor(Math.random()*60)+10;
      const bad = risk > 40;
      checks = [
        {l:"OCR field extraction", v:"OK", ok:true},
        {l:"MRZ checksum (ICAO 9303)", v: bad?"WARN — 1 digit low confidence":"OK", ok:!bad},
        {l:"Photo tampering (ELA)", v: bad?"MEDIUM — minor artefacts":"clean", ok:!bad},
        {l:"Hologram signature", v:"OK", ok:true},
        {l:"Face quality", v:"OK", ok:true},
        {l:"Watchlist match", v:"no match", ok:true},
        {l:"Multi-identity graph", v:"unique identity", ok:true},
        {l:"Document age vs. issue", v:"consistent", ok:true}
      ];
      ocr = mkOCR("UNKNOWN, USER","X0000000","???","01 JAN 1990","?","—","—");
      label = bad ? "REVIEW" : "LIKELY CLEAR"; cls = bad ? "amber" : "green";
    }
    renderResults(risk, checks, ocr, label, cls);
    btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Re-analyse';
    btn.disabled = false;
  }, 1800);
}

function bindScan(){
  const dz = document.getElementById("dz");
  const fileIn = document.getElementById("fileIn");

  document.getElementById("loadGenuine").addEventListener("click", ()=>{
    currentSample = "genuine";
    setPreview(makePassportSVG("genuine"), "Sample · Indian Passport");
    toast("Loaded genuine sample passport");
  });
  document.getElementById("loadForged").addEventListener("click", ()=>{
    currentSample = "forged";
    setPreview(makePassportSVG("forged"), "Sample · Forged Passport");
    toast("Loaded suspected-forgery sample");
  });

  fileIn.addEventListener("change", e=>{
    const f = e.target.files[0]; if(!f) return;
    currentSample = "custom";
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result, f.name);
    reader.readAsDataURL(f);
  });

  ["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev, e=>{ e.preventDefault(); dz.classList.add("drag") }));
  ["dragleave","drop"].forEach(ev=>dz.addEventListener(ev, e=>{ e.preventDefault(); dz.classList.remove("drag") }));
  dz.addEventListener("drop", e=>{
    const f = e.dataTransfer.files[0]; if(!f) return;
    currentSample = "custom";
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result, f.name);
    reader.readAsDataURL(f);
  });

  document.getElementById("analyzeBtn").addEventListener("click", runScreening);
  document.getElementById("clearBtn").addEventListener("click", ()=>toast("Passenger cleared. Logged to shift record.","green"));
  document.getElementById("flagBtn").addEventListener("click", ()=>toast("Escalation raised. Alert AL-1044 dispatched.","red"));
}

// ---------- Verify ----------
function bindVerify(){
  document.getElementById("startBtn").addEventListener("click", ()=>{
    const btn = document.getElementById("startBtn");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying…';
    document.getElementById("liveTxt").innerHTML = '<i class="fa-solid fa-video" style="color:var(--amber)"></i> streaming…';
    document.getElementById("matchPill").textContent = "processing";
    document.getElementById("matchPill").className = "pill amber mono";

    const setCheck = (id, ok, msg) => {
      const row = document.getElementById(id);
      const i = row.querySelector("i");
      i.className = "fa-solid " + (ok?"fa-circle-check":"fa-circle-xmark");
      i.style.color = ok?"var(--green)":"var(--red)";
      const sp = row.querySelector("span");
      sp.textContent = msg; sp.style.color = ok?"var(--muted)":"var(--red)";
    };
    setTimeout(()=>setCheck("c1",true,"1 face @ 0.94 conf."), 400);
    setTimeout(()=>setCheck("c2",true,"genuine · 3D depth OK"), 900);
    setTimeout(()=>setCheck("c3",true,"cos-dist 0.31"), 1400);
    setTimeout(()=>setCheck("c4",true,"e-visa · match"), 1900);
    setTimeout(()=>setCheck("c5",true,"no NCRB hit"), 2300);

    let sim = 0;
    const iv = setInterval(()=>{
      sim += 3; if(sim>=96){ sim=96; clearInterval(iv); }
      document.getElementById("simFill").style.width = sim+"%";
      document.getElementById("simVal").textContent = sim;
    }, 60);

    setTimeout(()=>{
      document.getElementById("matchPill").textContent = "MATCH · 96%";
      document.getElementById("matchPill").className = "pill green mono";
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Verification complete';
      toast("Passenger biometric match confirmed.","green");
    }, 2600);
  });
}

// ---------- Alerts ----------
function renderAlerts(){
  const sev = document.getElementById("fSev").value;
  const st  = document.getElementById("fStat").value;
  const q   = document.getElementById("fSearch").value.trim().toLowerCase();
  const rows = MOCK.alerts.filter(a=>{
    if(sev && a.severity!==sev) return false;
    if(st && a.status!==st) return false;
    if(q && !(a.subject.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.title.toLowerCase().includes(q))) return false;
    return true;
  });
  const sevClass = s => s==="critical"?"red":s==="high"?"red":s==="medium"?"amber":"blue";
  const statClass= s => s==="open"?"red":s==="review"?"amber":"green";
  document.getElementById("alertsBody").innerHTML = rows.length ? rows.map(a=>`
    <tr>
      <td>
        <div style="font-weight:500">${a.title}</div>
        <div class="mono" style="color:var(--muted); font-size:.72rem">${a.id}</div>
      </td>
      <td><span class="pill ${sevClass(a.severity)}">${a.severity}</span></td>
      <td>${a.subject}</td>
      <td>${a.checkpoint}</td>
      <td class="mono" style="color:var(--muted); font-size:.82rem">${a.time}</td>
      <td><span class="pill ${statClass(a.status)}"><span class="dot"></span>${a.status}</span></td>
      <td><button class="btn btn-ghost btn-sm">Review →</button></td>
    </tr>`).join("") : `<tr><td colspan="7" style="text-align:center; color:var(--muted); padding:40px">No alerts match your filters.</td></tr>`;
}

function bindAlerts(){
  ["fSev","fStat","fSearch"].forEach(id => document.getElementById(id).addEventListener("input", renderAlerts));
  renderAlerts();
}

// ---------- Analytics ----------
function renderAnalytics(){
  const totalScans = MOCK.weekly.reduce((a,w)=>a+w.scans,0);
  const totalFlags = MOCK.fraudTypes.reduce((a,f)=>a+f.value,0);
  document.getElementById("wkScans").textContent = totalScans.toLocaleString();
  document.getElementById("wkFlags").textContent = totalFlags;
  document.getElementById("wkRate").textContent  = ((totalFlags/totalScans*100).toFixed(2))+"%";

  const max = Math.max(...MOCK.weekly.map(x=>x.scans));
  document.getElementById("bars2").innerHTML = MOCK.weekly.map(w=>{
    const h = (w.scans/max*100).toFixed(1);
    return `<div class="bar" style="height:${h}%" data-l="${w.d}" data-v="${w.scans}"></div>`;
  }).join("");

  document.getElementById("donutTotal").textContent = totalFlags;
  const donut = document.getElementById("donut");
  // clean any old segments
  donut.querySelectorAll("circle:not(:first-child)").forEach(n=>n.remove());
  const C = 2*Math.PI*40;
  let offset = 0;
  MOCK.fraudTypes.forEach(f=>{
    const len = (f.value/totalFlags)*C;
    const c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx",50); c.setAttribute("cy",50); c.setAttribute("r",40);
    c.setAttribute("fill","none"); c.setAttribute("stroke",f.color); c.setAttribute("stroke-width",14);
    c.setAttribute("stroke-dasharray", `${len} ${C-len}`);
    c.setAttribute("stroke-dashoffset", -offset);
    donut.appendChild(c);
    offset += len;
  });

  document.getElementById("legend").innerHTML = MOCK.fraudTypes.map(f=>`
    <div class="row"><div class="lb"><span class="swatch" style="background:${f.color}"></span>${f.label}</div><span class="mono" style="color:var(--muted)">${((f.value/totalFlags)*100).toFixed(0)}%</span></div>
  `).join("");
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  bindScan();
  bindVerify();
  bindAlerts();
  renderAnalytics();
});
