let modal = null

const imagePreview = document.querySelector("#image-preview");
const imageUploadInput = document.querySelector("#image-upload");
const fileUpload = document.querySelector(".upload");
const submitBtn = document.querySelector("#submit-btn");
const titleInput = document.querySelector("#form-title");
const categorySelect = document.querySelector("#select-category");
const formAddWork = document.querySelector("#add-work-form");
const editGallery = document.querySelector(".modal-gallery");


function openModal (e){
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "block";
    modal = target;

    modal.addEventListener ("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.addEventListener("click", addWorkModal);

    resetModal();
    loadGalleryModal();
}

function closeModal (e){
    if (modal === null) return;
    e.preventDefault();

    modal.style.display = "none";
    modal.removeEventListener ("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    
    modal = null;
}

function resetModal (){
    const modalGallery = modal.querySelector(".modal-gallery");
    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    formAddWork.style.display = "none";
    editGallery.style.display = "flex";
    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.style.display = "block";

    modalGallery.innerHTML = '';
    h3modalWrapper.innerHTML = 'Galerie photo';

    imagePreview.style.display = "none";
    fileUpload.style.display = "flex";
    titleInput.value = "";
    categorySelect.value = "";
    submitBtn.disabled = true;
    submitBtn.classList.remove("ready");
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
    
    allWorks.forEach(work => {
        const figure=document.createElement("figure");
        figure.dataset.categoryId = work.categoryId
        figure.dataset.workId = work.id;

        const img=document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title; 
        img.dataset.workId = work.id;

        const figcaption=document.createElement("figcaption");
        figcaption.textContent = work.title;

        const removeWork=document.createElement("div");
        removeWork.dataset.workId =work.id;
        removeWork.classList.add("remove-work")

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");


        removeWork.appendChild(icon);
        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.appendChild(removeWork);
        editGallery.appendChild(figure);
        
        icon.addEventListener("click", () => {
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
                        
            if (confirmation){
                fetch (`http://localhost:5678/api/works/${work.id}`,{
                    method : 'DELETE',
                    headers : {"Authorization": "Bearer " + authToken}
                })
                .then (response => {
                    if (response.ok) {
                        figure.remove();
                        document.querySelector(`.gallery figure[data-work-id="${work.id}"]`)?.remove();
                        allWorks = allWorks.filter(w => w.id !== work.id);
                        notification("Travail supprimé !");     
                    } else {
                        alert("Erreur lors de la suppression")
                    }
                })
                .catch(error => console.error("Erreur de suppression :", error));
            }    
        })
    })
}

function addWorkModal (){
    editGallery.style.display = "none";
    formAddWork.style.display = "flex";
    submitBtn.style.display = "block";
    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.style.display = "none";

    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    h3modalWrapper.innerHTML = 'Ajout photo';

    document.getElementById('file-select-btn').addEventListener('click', function() {
        document.getElementById('image-upload').click();
    });
}

function selectCategoryForm (jsonlistCategories){
    const emptyOption = document.createElement("option");
    emptyOption.textContent = "";
    emptyOption.value = "";
    emptyOption.selected = true;
    categorySelect.appendChild(emptyOption);
    
    jsonlistCategories.forEach (category =>{
        const selectOption=document.createElement("option");
        selectOption.textContent = category.name;
        selectOption.value = category.id;
        categorySelect.appendChild(selectOption);

    });
}

function uploadImage() {
    imageUploadInput.addEventListener("change", function () {
        const file = this.files[0];
        const allowedTypes = ["image/png", "image/jpeg"];
        const allowedSize = 4 * 1024 * 1024;

        if (file) {
            if (!allowedTypes.includes(file.type) || file.size > allowedSize) {
                alert("Format invalide ou image trop volumineuse.");
                this.value = "";
                imagePreview.style.display = "none";
                return;
            }

            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = "block";
            fileUpload.style.display = "none";

            checkFormValidity();
        }
    });
}

function checkFormValidity() {
    if (imageUploadInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
        submitBtn.disabled = false;
        submitBtn.classList.add("ready");
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove("ready");
    }
}

titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);
imageUploadInput.addEventListener("change", checkFormValidity);

uploadImage();

function addWork(){
    const formAddWork = document.querySelector("#add-work-form");
    formAddWork.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(formAddWork);

        const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + authToken,
                },
                body: formData,
            });
                
        if (response.ok) {
            const work = await response.json();
            allWorks.push(work)
            console.log(work)
            console.log(allWorks)

            const galleryContainer = document.querySelector(".gallery");

            const figure=document.createElement("figure");
            figure.dataset.categoryId = work.categoryId
            figure.dataset.workId = work.id;

            const img=document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title; 
            img.dataset.workId = work.id;

            const figcaption=document.createElement("figcaption");
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            galleryContainer.appendChild(figure);

            notification("Nouveau travail ajouté avec succès !");
            resetModal();
            loadGalleryModal();

        } else {
            alert("Erreur, veuillez réessayer.");
        }            
    });
}
    
addWork();

function notification (message){
    const toast = document.createElement("div");
        toast.classList.add("toast");
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
        toast.remove();
        }, 3000);

}