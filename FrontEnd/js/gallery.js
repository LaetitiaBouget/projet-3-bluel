// Fonction pour récupérer les données de l'API
fetch("http://localhost:5678/api/works")
  .then(data => data.json()) // Convertit en json
  .then (jsonlistWorks => {

    const gallery = document.querySelector(".gallery"); // Élement HTML pour afficher les travaux

    //Fonction pour parcourir les travaux

    jsonlistWorks.forEach(work => {

        const figure=document.createElement("figure"); // Crée l'élément figure

        const img=document.createElement("img"); // Crée l'élément img
        img.src = work.imageUrl;
        img.alt = work.title;


        const figcaption=document.createElement("figcaption"); // Crée l'élément figcaption
        figcaption.textContent = work.title;

    // Rattache les élements crées à leurs parents
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);


    });

})

   // Retourne message si erreur
    .catch(error => {
        console.error("Erreur lors du fetch:", error );
    })
    
