let allWorks = [];

fetch("http://localhost:5678/api/works")
  .then(dataWorks => dataWorks.json())
  .then (jsonlistWorks => {

    allWorks = jsonlistWorks;

    const galleryContainer = document.querySelector(".gallery");

      jsonlistWorks.forEach(work => {

        const figure=document.createElement("figure");
        figure.dataset.categoryId = work.category.id
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

    });

})
    .catch(error => {
        console.error("Erreur lors du fetch:", error );
    })
    

fetch("http://localhost:5678/api/categories")
    .then(dataCategories => dataCategories.json())
    .then (jsonlistCategories => {
        
        selectCategoryForm(jsonlistCategories);
        
        const categoriesContainer = document.querySelector("#filters");
        const btnAll = document.createElement("button");
        btnAll.textContent = "Tous";
        btnAll.classList.add("filter-btnAll");

        categoriesContainer.appendChild(btnAll);

        btnAll.addEventListener("click", () => {
            filterGalleryByCategory(null);
        });

    jsonlistCategories.forEach(category => {

        const categoryFilters=document.createElement("button");
        categoryFilters.textContent = category.name;
        categoryFilters.classList.add("filter-btn");

        categoryFilters.dataset.categoryId = category.id;
        categoriesContainer.appendChild(categoryFilters);

        categoryFilters.addEventListener("click", () => {
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
    .catch(error => {
        console.error("Erreur lors du fetch:", error );
    })

