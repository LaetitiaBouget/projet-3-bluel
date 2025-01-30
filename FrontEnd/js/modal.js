
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

//Suppresion travaux depuis la modale

fetch("http://localhost:5678/api/works")
  .then(dataWorks => dataWorks.json())
  .then (jsonlistWorks => {

    const editGallery = document.querySelector(".modal-gallery");

      jsonlistWorks.forEach(work => {

        const removeWork=document.createElement("div");
        removeWork.dataset.workId = work.id
        removeWork.classList.add("remove-work")

        const img=document.createElement("img");
        img.classList.add("img-modal");
        img.src = work.imageUrl;

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");

        removeWork.appendChild(img);
        removeWork.appendChild(icon);
        editGallery.appendChild(removeWork);


icon.addEventListener("click", () => {

    const workId = work.id;
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
        
        if (confirmation){
            fetch (`http://localhost:5678/api/works/${work.id}`,{
                method : 'DELETE',
                headers : {
                "Authorization": "Bearer " + authToken,
                }
            })
            
        .then (response => {
            if (response.ok) {
                removeWork.remove();
            }
            else {
                alert("Erreur lors de la suppression")
            }
        })
    }

    });

});

})

.catch(error => {
    console.error("Erreur lors du fetch:", error );
})


//Ajout travaux depuis la modale

const addWork = document.querySelector("add-work-btn");

addWork.addEventListener("click", () => {

    


})