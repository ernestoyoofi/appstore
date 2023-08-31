const url_jsonhome  = "https://serv-fc.vercel.app/storeapp/list"
const url_details   = "https://serv-fc.vercel.app/storeapp/detail/{{package}}"
const url_infoapp   = "https://serv-fc.vercel.app/storeapp/app-file/{{package}}"
const url_inforeq   = "https://serv-fc.vercel.app/storeapp/permission/{{package}}"
const url_basefile  = "https://github.com/ernestoyoofi/appstore/releases/download/{{package}}/{{filename}}"

function SearchBar() {
  const ip = document.querySelector('input[name="search-query"]')
  ip.addEventListener("input", (e) => {
    if(!ip.value) {
      document.querySelectorAll('.list-app .list-item .list-card').forEach((a) => {
        a.style.display = "flex"
      })
      return 
    }
    document.querySelectorAll('.list-app .list-item .list-card').forEach((a) => {
      if(a.innerText.toLowerCase().match(ip.value.toLowerCase().trim())) {
        a.style.display = "flex"
      } else {
        a.style.display = "none"
      }
    })
  })
}
async function StartAppContent() {
  try {
    const a = await (await fetch(url_jsonhome)).json()
    let p = ""
    for(let z of a) {
      p += `<div class="list-card" pkg="${z.package}" onclick="OpenApp('${z.package}')"><div class="icon"><img src="${url_basefile.replace("{{package}}", z.package).replace("{{filename}}", "icon.png")}" /></div><div class="info"><b>${z.name}</b><p>${z.about.length > 23? z.about.slice(0, 20)+"...":z.about}</p></div></div>`
    }
    document.querySelector('.list-item').innerHTML += p
    // Search Bar Active
    SearchBar()
  } catch(err) {
    console.error(err)
    alert(`Error StartAppContent:\n\n${err.stack}`)
  }
}
async function openSheetDownload() {
  try {
    let textBef = ""
    textBef = document.querySelector('.download-btn').innerText
    document.querySelector('.download-btn').innerText = "Membuka..."
    document.querySelector('.download-btn').setAttribute("open-btn", "1")
    const pkg = document.querySelector('.download-btn').getAttribute("pkg")
    const data = await (await fetch(url_infoapp.replace("{{package}}", pkg))).json()
    if(data.error) {
      document.querySelector('.bottomsheet-app .content-item').innerHTML = `<h4>${data.error.message}</h4><pre>${JSON.stringify(data.error)}</pre>`
      openSheet("Kesalahan pada client")
      return ;
    }
    let as = `<h4>Update Terakhir</h4><ul class="download-app"><li><a href="${url_basefile.replace("{{package}}",pkg).replace("{{filename}}",data[0].file)}">${data[0].file} (${data[0].size})</a></li></ul><h4>File Tersedia</h4>`
    let dls = ""
    for(let a of data) {
      dls += `<li><a href="${url_basefile.replace("{{package}}",pkg).replace("{{filename}}",a.file)}">${a.file} (${a.size})</a></li>`
    }
    document.querySelector('.bottomsheet-app .content-item').innerHTML = as+`<ul class="download-app">${dls}</ul>`
    openSheet("Unduh Aplikasi")
    document.querySelector('.download-btn').removeAttribute("open-btn")
    document.querySelector('.download-btn').innerText = textBef
  } catch(err) {
    document.querySelector('.bottomsheet-app .content-item').innerHTML = `<pre>${err.stack}</pre>`
    openSheet("Kesalahan pada client")
  }
}
async function RequireApp() {
  try {
    let textBef = ""
    const a = document.querySelector('.clickinfoapp')
    textBef = a.innerText
    a.innerText = "Memuat..."
    a.setAttribute("open-btn", "1")
    const pkg = a.getAttribute("pkg")
    const data = await (await fetch(url_inforeq.replace("{{package}}", pkg))).json()
    console.log(data)
    if(data.error) {
      document.querySelector('.bottomsheet-app .content-item').innerHTML = `<h4>${data.error.message}</h4><pre>${JSON.stringify(data.error)}</pre>`
      openSheet("Kesalahan pada client")
      return ;
    }
    let af = ""
    for(let c of data) {
      af += `<li><h4>${c.name}</h4><p>${c.desc}</p></li>`
    }
    document.querySelector('.bottomsheet-app .content-item').innerHTML = `<ul class="resepected">${af}</ul>`
    openSheet("Keamanan data dan permintaan data")
    a.removeAttribute("open-btn")
    a.innerText = textBef
  } catch(err) {
    document.querySelector('.bottomsheet-app .content-item').innerHTML = `<pre>${err.stack}</pre>`
    openSheet("Kesalahan pada client")
  }
}
async function OpenApp(package) {
  try {
    const data = await (await fetch(url_details.replace("{{package}}", package))).json()
    if(data.error) {
      document.querySelector('.bottomsheet-app .content-item').innerHTML = `<h4>${data.error.message}</h4><pre>${JSON.stringify(data.error)}</pre>`
      openSheet("Kesalahan pada client")
      return ;
    }
    document.querySelector('.list-app').style.display = "none"
    document.querySelector('.detail-app').style.display = "block"
    let nativeLibrary = ""
    let screenshotList = ""
    let updateNote = ""
    for(let c of data.screenshot) {
      screenshotList += `<img src=${url_basefile.replace("{{package}}",package).replace("{{filename}}",c)}/>`
    }
    for(let c of data.basic_lib) {
      nativeLibrary += `<li>${c}</li>`
    }
    for(let c of Array.isArray(data.note_update)? data.note_update : []) {
      updateNote += `<li>${c}</li>`
    }
    document.getElementById("appcontent").innerHTML = `<div class="header-content"><div class="icon"><img src="${url_basefile.replace("{{package}}",package).replace("{{filename}}","icon.png")}"/></div><div class="info"><b>${data.name}</b></div></div><main><button class="download-btn" pkg="${data.package}" onclick="openSheetDownload()">Unduh Aplikasi</button><h3>Tentang</h3><p comps="desc">${data.about}</p><div class="scroll-img">${screenshotList}</div><div class="info-app"><h4 style="margin-bottom: 2px;">Catatan pembaruan</h4><ul>${updateNote}</ul></div><div class="info-app"><h4 style="margin-bottom: 2px;">Package</h4><p style="margin: 0;">${data.package}</p></div><div class="info-app"><h4 style="margin-bottom: 2px;">Native Library</h4><ul>${nativeLibrary}</ul></div><div class="require-app"><h4>Keamanan data dan permintaan data</h4><div class="box-require"><p>Kamu tau beberapa aplikasi meminta izin untuk akses data ke perangkat, disini sebagai pengembang memberikan informasi detail aplikasi dan hanya menerima beberapa informasi seperti laporan bug.</p><button class="clickinfoapp" onclick="RequireApp()" pkg="${data.package}">Lihat permintaan</button></div></div></main>`
  } catch(err) {
    document.querySelector('.bottomsheet-app .content-item').innerHTML = `<pre>${err.stack}</pre>`
    openSheet("Kesalahan pada client")
  }
}
function openSheet(title) {
  // document.body.style.overflow = "hidden"
  document.querySelector('.bottomsheet-app').style.display = "block"
  setTimeout(() => {
    document.querySelector('.bottomsheet-app header b').innerText = title || "Open Sheet..."
    document.querySelector('.bottomsheet-app').setAttribute("active-view", "1")
  }, 300)
}
document.getElementById("closeapp")
.addEventListener("click", (e) => {
  document.querySelector('.list-app').style.display = "block"
  document.querySelector('.detail-app').style.display = "none"
  document.getElementById("appcontent").innerHTML = ""
})
document.getElementById("backtimesheet")
.addEventListener("click", (e) => {
  if(!document.querySelector('.bottomsheet-app').getAttribute("active-view")) return;
  document.querySelector('.bottomsheet-app').setAttribute("active-view", "2")
  setTimeout(() => {
    // document.body.style.overflow = ""
    document.querySelector('.bottomsheet-app').removeAttribute("active-view")
    setTimeout(() => {
      document.querySelector('.bottomsheet-app').style.display = "none"
      document.querySelector('.bottomsheet-app .content-item').innerHTML = ""
    }, 300)
  }, 300)
})
if(new URLSearchParams(location.search).get("app")) {
  OpenApp(new URLSearchParams(location.search).get("app"))
}
StartAppContent()
