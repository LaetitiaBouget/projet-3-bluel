fetch("http://localhost:5678/api/works")
  .then(dataWorks => dataWorks.json())
  .then (jsonlistWorks => {

    const galleryContainer = document.querySelector(".gallery");

      jsonlistWorks.forEach(work => {

        const figure=document.createElement("figure");
        figure.dataset.categoryId = work.category.id

        const img=document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title; 

        const figcaption=document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);

    });

})
    .catch(error => {
        console.error("Erreur lors du fetch:", error );
    })
    

    fetch("http://localhost:5678/api/categories")
        .then(dataCategories => dataCategories.json())
        .then (jsonlistCategories => {

    const categoriesContainer = document.querySelector("#filters");

    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btnAll");

    categoriesContainer.appendChild(btnAll);

    btnAll.addEventListener("click", () => {
        filterGalleryByCategory(null);
    });

    jsonlistCategories.forEach(category => {

        const btnFilters=document.createElement("button");
        btnFilters.textContent = category.name;
        btnFilters.classList.add("filter-btn");

        categoriesContainer.appendChild(btnFilters);

        btnFilters.addEventListener("click", () => {
            filterGalleryByCategory(category.id); 
            });
    });

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
})

