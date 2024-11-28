async function getCategories() {
  const url = "http://localhost:5678/api/categories"; // URL de l'API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categories = await response.json();

    // Appel d'une fonction pour afficher dynamiquement le menu
    displayCategories(categories);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories :",
      error.message
    );
  }
}

function displayCategories(categories) {
  const menu = document.getElementById("categoryMenu"); // je récupère le menu que j'ai crée dans le HMTL
  if (!menu) {
    console.warn("L'élément categoryMenu est introuvable dans le HTML.");
    return;
  }

  // je viens ajouter une option "Tous"
  const allOption = document.createElement("li");
  allOption.innerHTML = "Tous"; // Le texte de l'option donc "Tous"
  allOption.dataset.category = "all"; // Identifiant pour "Tous"
  allOption.addEventListener("click", () => filterWorks("all")); // addEventListener dont m'a pas parlé Julien : donc au clic filtre les éléments
  menu.appendChild(allOption);

  // je mets toutes les autres catégories
  categories.forEach((category) => {
    // Parcourt la liste des catégories
    const categoryOption = document.createElement("li"); // fais une catégorie pour chaque éléments li
    categoryOption.innerHTML = category.name; // la on prend le nom de la catégorie
    categoryOption.dataset.category = category.id; // Associer l'ID pour filtrer
    categoryOption.addEventListener("click", () => filterWorks(category.id));
    menu.appendChild(categoryOption);
  });
}

async function getData() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    i = 0;
    while (json[i]) {
      figure = document.createElement("figure"); //création balise
      image = document.createElement("img");
      image.setAttribute("src", json[i].imageUrl);
      image.setAttribute("alt", json[i].title);
      figure.appendChild(image);

      figcaption = document.createElement("figcaption"); //création du figcaption
      figcaption.innerHTML = json[i].title; //concaténation on ajoute la valeur du compteur i à la chaine de caractères toto
      figure.appendChild(figcaption);

      figure.dataset.category = json[i].categoryId; // Récupère l'ID pour filtrer les éléments plus tard

      document.getElementsByClassName("gallery")[0].appendChild(figure); //ajoute figure en enfant à gallery
      i++;
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Filtrage des éléments faut que je fasse une fonction
function filterWorks(categoryId) {
  // Appeler setActiveCategory pour gérer le bouton sélectionné
  setActiveCategory(categoryId);

  const allFigures = document.querySelectorAll(".gallery figure");

  allFigures.forEach((figure) => {
    if (
      categoryId === "all" ||
      figure.dataset.category === String(categoryId) //si l'ID correspond à la catégorie du /works
    ) {
      figure.style.display = "block"; // Affiche le travail
    } else {
      figure.style.display = "none"; // Cache le travail
    }
  });
}

// Gestion de la classe active pour les boutons de catégorie
function setActiveCategory(categoryId) {
  const categoryButtons = document.querySelectorAll("#categoryMenu li");

  // Supprimer la classe active de tous les boutons
  categoryButtons.forEach((button) => button.classList.remove("active"));

  // Ajouter la classe active au bouton correspondant
  const activeButton = document.querySelector(
    `#categoryMenu li[data-category="${categoryId}"]`
  );
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// Appels dans l'ordre logique
getCategories(); // Charger et afficher les catégories d'abord
getData(); // Charger les travaux ensuite
