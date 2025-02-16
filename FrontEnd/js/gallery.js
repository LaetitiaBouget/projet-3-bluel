let allWorks = [];

fetch("http://localhost:5678/api/works")
  .then(dataWorks => dataWorks.json())
  .then (jsonlistWorks => {
    
    allWorks = jsonlistWorks;
    renderGallery(allWorks, ".gallery");
  })

  .catch(error => {
    console.error("Erreur lors du fetch:", error)
  });

function renderGallery(works, gallerySelector) {
    const gallery = document.querySelector(gallerySelector);
    gallery.innerHTML =""; 

    works.forEach(work => {
        const figure=document.createElement("figure");
        figure.dataset.categoryId = work.categoryId;
        figure.dataset.workId = work.id;

        const img=document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title; 
        img.dataset.workId = work.id;

        const figcaption=document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);

        if (gallerySelector ===".modal-gallery") {
            const removeWork=document.createElement("div");
            removeWork.dataset.workId =work.id;
            removeWork.classList.add("remove-work")

            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-trash-can");

            removeWork.appendChild(icon);
            figure.appendChild(removeWork);

            icon.addEventListener("click", () => removeWorkFromGallery(work));
        }
    });
}

fetch("http://localhost:5678/api/categories")
    .then(dataCategories => dataCategories.json())
    .then (jsonlistCategories => {
        
        selectCategoryForm(jsonlistCategories);
        
        const categoriesContainer = document.querySelector("#filters");
        const btnAll = document.createElement("button");
        btnAll.textContent = "Tous";
        btnAll.classList.add("filter-btnAll","active-tag");

        categoriesContainer.appendChild(btnAll);

        btnAll.addEventListener("click", () => {
            setActiveButton(btnAll);
            filterGalleryByCategory(null);
        });

        jsonlistCategories.forEach(category => {
            const categoryFilters=document.createElement("button");

            categoryFilters.textContent = category.name;
            categoryFilters.classList.add("filter-btn");

            categoryFilters.dataset.categoryId = category.id;
            categoriesContainer.appendChild(categoryFilters);

            categoryFilters.addEventListener("click", () => {
            setActiveButton(categoryFilters);
            filterGalleryByCategory(category.id); 
            });
        }); 
    })
    .catch(error => { 
        console.error("Erreur lors du fetch:", error );
    });


function setActiveButton(selectedButton){
    document.querySelectorAll("#filters button").forEach(btn =>{
        btn.classList.remove("active-tag");
    });
    selectedButton.classList.add("active-tag");
}



function filterGalleryByCategory(categoryId) {
    const galleryItems = document.querySelectorAll(".gallery figure")

    galleryItems.forEach(galleryItem => {
        if (categoryId === null || galleryItem.dataset.categoryId == categoryId){
            galleryItem.style.display = "block";
        } else {
            galleryItem.style.display = "none";
        }
    });
}
