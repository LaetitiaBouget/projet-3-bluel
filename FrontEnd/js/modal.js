
//Ouverture et fermeture de la modale

let modal = null

const openModal = function(e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = "block"
    modal = target
    modal.addEventListener ("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function (e){
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.removeEventListener ("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e){
    e.stopPropagation()
}

document.querySelectorAll("a.js-link-modal").forEach (a => {
    a.addEventListener("click", openModal)
})

//Edit travaux depuis la modale

fetch("http://localhost:5678/api/works")
  .then(dataWorks => dataWorks.json())
  .then (jsonlistWorks => {

    const editGallery = document.querySelector(".modal-gallery");

      jsonlistWorks.forEach(work => {

        const removeWork=document.createElement("div");
        removeWork.classList.add("remove-work")

        const img=document.createElement("img");
        img.classList.add("img-modal");
        img.src = work.imageUrl;

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");


        removeWork.appendChild(img);
        removeWork.appendChild(icon);
        editGallery.appendChild(removeWork);

    });

})


.catch(error => {
    console.error("Erreur lors du fetch:", error );
})


//Ajout travaux depuis la modale