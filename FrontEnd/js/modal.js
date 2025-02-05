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
    addWorkBtn.addEventListener("click", addWorkModal);

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

    fetch("http://localhost:5678/api/works")
    .then(dataWorks => dataWorks.json())
    .then (jsonlistWorks => {
    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = "";

    jsonlistWorks.forEach(work => {
        const figure = document.createElement("figure");
        figure.dataset.categoryId = work.category.id;

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);
    });
})
}

function resetModal (){
    const modalGallery = modal.querySelector(".modal-gallery");
    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    const addWorkBtn = modal.querySelector(".add-work-btn");

    modalGallery.innerHTML = '';
    modalGallery.style.display = 'flex';
    modalGallery.classList.remove("no-border");
    h3modalWrapper.innerHTML = 'Galerie photo';
    addWorkBtn.style.display = 'block';

    const addWorkForm = modal.querySelector("#add-work-form");
    addWorkForm.style.display = 'none';

    const imagePreview = document.querySelector("#image-preview");
    imagePreview.style.display = "none";

    const fileUpload = document.querySelector(".upload");
    fileUpload.style.display = "flex";

    document.querySelector("#form-title").value = "";

    document.querySelector("#select-category").value = "";

    const submitBtn = document.querySelector("#submit-btn");
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

function addWorkModal (){
    const modalGallery = modal.querySelector(".modal-gallery");
    modalGallery.style.display = 'none';
    modalGallery.classList.add("no-border");

    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    h3modalWrapper.innerHTML = 'Ajout photo';

    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.style.display = 'none'; 

    const addWorkForm = modal.querySelector("#add-work-form");
    addWorkForm.style.display = 'flex';

    document.getElementById('file-select-btn').addEventListener('click', function() {
        document.getElementById('image-upload').click();
      });
    
}

fetch("http://localhost:5678/api/categories")
        .then(dataCategories => dataCategories.json())
        .then (jsonlistCategories => {

    const formSelectCategory = document.querySelector("#select-category");

        const emptyOption = document.createElement("option");
        emptyOption.textContent = "";
        emptyOption.value = "";
        emptyOption.selected = true;

        formSelectCategory.appendChild(emptyOption);

        jsonlistCategories.forEach(category => {

        const selectOption=document.createElement("option");
        selectOption.textContent = category.name;
        selectOption.value = category.id;
        formSelectCategory.appendChild(selectOption);

    });
})
;

function uploadImage (){
    
    const imageUploadInput = document.querySelector("#image-upload");
    const imagePreview = document.querySelector("#image-preview");
    const submitBtn = document.querySelector("#submit-btn");


    document.querySelector("#image-upload").addEventListener("change", function () {
    const file = this.files[0];
    const allowedTypes = ["image/png", "image/jpeg"];
    const allowedSize = 4 * 1024 *1024;
    const fileUpload = document.querySelector(".upload");

    if (file){

        if (!allowedTypes.includes(file.type)){
            alert("Veuillez choisir un format d'image valide.");
            this.value = "";
            imagePreview.style.display = "none";
            return;
        }

        if (file.size > allowedSize) {
            alert ("Image trop volumineuse.");
            this.value = "";
            imagePreview.style.display = "none";
            return;
        }

        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";

    }else {
        imagePreview.style.display = "none";
        fileUpload.style.display = "flex";
    }

        fileUpload.style.display = "none";
    }
);

    imagePreview.addEventListener("click", function () {
        imageUploadInput.value = "";
        imagePreview.style.display = "none";
        imageUploadInput.click();
    });
}

function checkFormValidity() {
const imageUploadInput = document.querySelector("#image-upload");
const titleInput = document.querySelector("#form-title");
const categorySelect = document.querySelector("#select-category");
const submitBtn = document.querySelector("#submit-btn");

if (imageUploadInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
    submitBtn.disabled = false;
    submitBtn.classList.add("ready");
} else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("ready");
}

}

["#image-upload", "#form-title", "#select-category"].forEach(selector => {
    document.querySelector(selector).addEventListener("input", checkFormValidity);
});

uploadImage();
checkFormValidity();

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

            const toast = document.createElement("div");
            toast.classList.add("toast");
            toast.textContent = "Nouveau travail ajouté avec succès !";
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
                
            } else {
                alert("Erreur, veuillez réessayer.");
            }            
        });
}
    
addWork();

