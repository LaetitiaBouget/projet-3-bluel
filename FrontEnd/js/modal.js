let modal = null

const imagePreview = document.querySelector("#image-preview");
const imageUploadInput = document.querySelector("#image-upload");
const fileUpload = document.querySelector(".upload");
const submitBtn = document.querySelector("#submit-btn");
const titleInput = document.querySelector("#form-title");
const categorySelect = document.querySelector("#select-category");
const formAddWork = document.querySelector("#add-work-form");

function openModal (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    toggleDisplay([target], "block");
    modal = target;

    modal.addEventListener ("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
 
    resetModal();
    loadGalleryModal();
}

function closeModal (e) {
    if (modal === null) return;
    e.preventDefault();

    toggleDisplay([modal], "none");
    modal.removeEventListener ("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
}

function resetModal () {
    const modalGallery = modal.querySelector(".modal-gallery");
    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    const addWorkBtn = modal.querySelector(".add-work-btn"); 
    const backArrow = modal.querySelector(".js-back-arrow");
    
    toggleDisplay([formAddWork, imagePreview, backArrow], "none");
    toggleDisplay([addWorkBtn], "block"); 
    toggleDisplay([fileUpload, modalGallery], "flex"); 

    modalGallery.innerHTML = '';
    h3modalWrapper.innerHTML = 'Galerie photo';
    titleInput.value = "";
    categorySelect.value = "";

    submitBtn.disabled = true;
    submitBtn.classList.remove("ready");
}

function stopPropagation (e) {
    e.stopPropagation()
}

function createModal () {
    document.querySelectorAll("a.js-link-modal").forEach (a => {
        a.addEventListener("click", openModal);
    })
}

createModal();

function loadGalleryModal() {
    renderGallery(allWorks, ".modal-gallery");

    const addWorkBtn = modal.querySelector(".add-work-btn");
    addWorkBtn.addEventListener("click", openAddWorkModal);
}    

function removeWorkFromGallery(work) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
    if (!confirmation) return;

    fetch (`http://localhost:5678/api/works/${work.id}`, {
        method : 'DELETE',
        headers : { "Authorization": "Bearer " + authToken }
    })
    .then(response => {
        if (response.ok) {
            const index = allWorks.findIndex(w => w.id === work.id);
            if (index !== -1){
                allWorks.splice(index, 1);
            }
            renderGallery(allWorks, ".gallery");
            renderGallery(allWorks, ".modal-gallery");

            showToast("Travail supprimé !", "success");

        } else {
            showToast("Erreur lors de la suppression", "error");
        }
    })
    .catch(error => console.error("Erreur de suppression :", error));
}

function openAddWorkModal () {
    const modalGallery = modal.querySelector(".modal-gallery");
    const addWorkBtn = modal.querySelector(".add-work-btn");
    const h3modalWrapper = modal.querySelector(".modal-wrapper h3");
    const backArrow = modal.querySelector(".js-back-arrow");
    h3modalWrapper.innerHTML = 'Ajout photo';

    toggleDisplay([modalGallery, addWorkBtn], "none");
    toggleDisplay([submitBtn, backArrow], "block"); 
    toggleDisplay([formAddWork], "flex"); 

    modal.querySelector(".js-back-arrow").addEventListener("click", () => {
        resetModal ();
        loadGalleryModal();
    });

    document.getElementById('file-select-btn').addEventListener('click', function() {
        document.getElementById('image-upload').click();
    });

    uploadImage(); 
}




function uploadImage() {
    imageUploadInput.addEventListener("change", function () {
        const file = this.files[0];
        const allowedTypes = ["image/png", "image/jpeg"];
        const allowedSize = 4 * 1024 * 1024; //4Mo

        if (!allowedTypes.includes(file.type) || file.size > allowedSize) {
            showToast("Format invalide ou image trop volumineuse", "error")
            this.value = "";
            toggleDisplay([imagePreview], "none");
            return;
        }

        imagePreview.src = URL.createObjectURL(file);
        toggleDisplay([fileUpload], "none");
        toggleDisplay([imagePreview], "block"); 

        checkFormValidity();
    });
}

function selectCategoryForm (jsonlistCategories) {
    const emptyOption = document.createElement("option");

    emptyOption.textContent = "";
    emptyOption.value = "";
    emptyOption.selected = true;
    categorySelect.appendChild(emptyOption);
    
    jsonlistCategories.forEach (category =>{
        const selectOption = document.createElement("option");
        selectOption.textContent = category.name;
        selectOption.value = category.id;
        categorySelect.appendChild(selectOption);
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

function initializeFormValidation() {
    titleInput.addEventListener("input", checkFormValidity);
    categorySelect.addEventListener("change", checkFormValidity);
    imageUploadInput.addEventListener("change", checkFormValidity);
}

initializeFormValidation();

function addWork() {
    formAddWork.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(formAddWork);

        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: { "Authorization": "Bearer " + authToken, },
            body: formData,
        });
                
        if (response.ok) {
            const work = await response.json();
            allWorks.push(work)

            renderGallery(allWorks, ".gallery");
            renderGallery(allWorks, ".modal-gallery");

            showToast("Nouveau travail ajouté avec succès !", "success");
            resetModal();
            loadGalleryModal();

        } else {
            showToast("Erreur lors de l'ajout", "error");
        }            
    });
}
    
addWork();

function showToast (message, messageType) {
    const toast = document.createElement("div");

    toast.classList.add("toast", messageType);
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
    toast.remove();
    }, 3000);
}

function toggleDisplay(elements, displayType) {

    elements.forEach(element => {
        if (element) {
            element.style.display = displayType;
        }
    });
}