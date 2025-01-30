let modal = null

function openModal (e){
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "block";
    modal = target;

    modal.addEventListener ("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.addEventListener("click", addWork);

    loadGalleryModal();
}

function closeModal (e){
    if (modal === null) return;
    e.preventDefault();

    resetModal();

    modal.style.display = "none";
    modal.removeEventListener ("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    
    modal = null;
}

function resetModal (){
    const modalGallery = modal.querySelector(".modal-gallery");
    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    const addWorkBtn = modal.querySelector(".add-work-btn");

    modalGallery.innerHTML = '';
    modalGallery.classList.remove("no-border");
    h3modalWrapper.innerHTML = 'Galerie photo';
    addWorkBtn.style.display = 'block';
}

function stopPropagation (e){
    e.stopPropagation()
}

function createModal (){
    document.querySelectorAll("a.js-link-modal").forEach (a => {
        a.addEventListener("click", openModal);
    })
}

createModal();

function loadGalleryModal (){
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
        
        })
    })
})
}

function addWork (){
    const modalGallery = modal.querySelector(".modal-gallery");
    modalGallery.innerHTML = '';
    modalGallery.classList.add("no-border");

    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    h3modalWrapper.innerHTML = 'Ajout photo';

    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.style.display = 'none'; 
}

