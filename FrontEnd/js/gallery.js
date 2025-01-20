// Fonction pour récupérer les données de l'API
fetch("http://localhost:5678/api/works")
  .then(dataWorks => dataWorks.json()) // Convertit en json
  .then (jsonlistWorks => {

    const galleryContainer = document.querySelector(".gallery"); // Élement HTML pour afficher les travaux

    //Fonction pour parcourir les travaux

    jsonlistWorks.forEach(work => {

        const figure=document.createElement("figure"); // Crée l'élément figure
        figure.dataset.categoryId = work.category.id // Ajoute l'ID de la catégorie à l'élément

        const img=document.createElement("img"); // Crée l'élément img
        img.src = work.imageUrl;
        img.alt = work.title;


        const figcaption=document.createElement("figcaption"); // Crée l'élément figcaption
        figcaption.textContent = work.title;

        // Rattache les élements crées à leurs parents
        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);

    });

})

    // Retourne message si erreur
    .catch(error => {
        console.error("Erreur lors du fetch:", error );
    })
    

    // Fonction pour filtrer les travaux

    fetch("http://localhost:5678/api/categories")
        .then(data => data.json()) // Convertit en json
        .then (jsonlistCategories => {

    const categoriesContainer = document.querySelector("#filters"); // Élement HTML pour afficher les catégories à filtrer

    //Création d'un bouton "tous"

    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btn");

    
    //Ajout du bouton "tous" au DOM

    categoriesContainer.appendChild(btnAll);

    //Ajout eventListener click bouton "tous"

    btnAll.addEventListener("click", () => {
        filterGalleryByCategory(null); // pas de choix d'id, montrer tous les travaux
    });

    //Fonction pour parcourir les catégories

    jsonlistCategories.forEach(category => {

        const btnFilters=document.createElement("button"); // Crée l'élément bouton
        btnFilters.textContent = category.name;
        btnFilters.classList.add("filter-btn");
        btnFilters.dataset.categoryId = category.id // Ajoute l'ID de la catégorie à l'élément

        // Ajoute les boutons filtres au DOM

        categoriesContainer.appendChild(btnFilters);


        //Ajout eventListener click bouton filtre

        btnFilters.addEventListener("click", () => {
            filterGalleryByCategory(category.id); // pas de choix d'id, montrer tous les travaux
            });


    });

    //Fonction pour filtrer les catégories

    function filterGalleryByCategory(categoryId) {

    const galleryItems = document.querySelectorAll(".gallery figure")

    galleryItems.forEach(item => {
        if (categoryId === null || item.dataset.categoryId == categoryId){
                item.style.display = "block"; // Affiche l'élément
        } else {
            item.style.display = "none"; // Cache l'élément
        }

    });

    }
})

