const authToken = sessionStorage.getItem('authToken');
const body = document.querySelector('body'); 
const navLogin = document.getElementById("nav-login");
const header = document.querySelector("header");
const h2 = document.querySelector("#portfolio h2");


function createBannerEdit(){
    const bannerEdit = document.createElement("div");
    bannerEdit.classList.add("bandeau-edit")
    header.insertAdjacentElement("beforebegin", bannerEdit);
    const textBannerEdit = document.createElement("p");
    textBannerEdit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mode Édition`
    bannerEdit.appendChild(textBannerEdit);
    return bannerEdit
}

function createWorksEdit(){
    const worksEdit = document.createElement("p");
    worksEdit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> <a href="#modal" class="js-link-modal">Modifier</a>`
    worksEdit.classList.add("travaux-edit");
    h2.insertAdjacentElement("afterend", worksEdit);
    return worksEdit
}

function modeEdit(bannerEdit, worksEdit){
    if (authToken !== null) {
        body.classList.add('mode-edition');
        navLogin.innerText = "logout";
        navLogin.setAttribute("href", "#");
        bannerEdit.style.display = "block";
        worksEdit.style.display = "inline-block";

    }  else {

        body.classList.remove('mode-edition');
        navLogin.innerText = "login";
        navLogin.setAttribute("href", "login.html");
        bannerEdit.style.display = "none";
        worksEdit.style.display = "none";
    }
}

function logout(){
    navLogin.addEventListener("click", function (event) {
        if (authToken !== null) {
            sessionStorage.clear(); 
            window.location.href = "./index.html";
        }
    });
}

modeEdit(createBannerEdit (), createWorksEdit())
logout();