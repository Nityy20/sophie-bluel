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

// ***********************************
// Code pour gérer l'étape 2.2 avec le login
// ***********************************

// Gestion de l'événement pour le formulaire de login
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupération des valeurs des champs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // requête API
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // Si la ce n'est pas ce qui est attendu -> message d'erreur :
        errorMessage.textContent =
          "Erreur dans l’identifiant ou le mot de passe";
        errorMessage.style.display = "block";
        return;
      }

      // Si la connexion est réussie, récupérer le token
      const data = await response.json();
      const token = data.token;

      // Stockage du token dans localStorage
      localStorage.setItem("token", token);

      // Redirection vers la page d'accueil
      window.location.href = "index.html";
    } catch (error) {
      // Affichage d'une erreur générique en cas de problème
      errorMessage.textContent =
        "Une erreur s'est produite. Veuillez réessayer.";
      errorMessage.style.display = "block";
    }
  });
}

// ***********************************
// Code pour gérer l'application
// ***********************************

// Sélection des éléments communs de la modale partagée
const sharedModal = document.getElementById("sharedModal"); // Une seule modale partagée
const closeSharedModal = document.getElementById("closeSharedModal"); // Bouton pour fermer la modale
const editContent = document.getElementById("editContent"); // Contenu de la section "Modifier"
const addPhotoContent = document.getElementById("addPhotoContent"); // Contenu de la section "Ajouter une photo"
const modalGallery = document.querySelector(".modal-gallery"); // Galerie photo
const addPhotoForm = document.getElementById("addPhotoForm"); // Formulaire d'ajout de photo
const photoCategory = document.getElementById("photoCategory"); // Menu déroulant des catégories

// Bouton "Modifier" (ouvre la galerie photo)
editButton.addEventListener("click", () => {
  showEditContent(); // Afficher le contenu pour "Modifier"
  sharedModal.classList.remove("hidden"); // Afficher la modale
  loadModalGallery(); // Charger les projets dans la galerie
});

// Bouton "Ajouter une photo" (ouvre le formulaire d'ajout)
addPhotoButton.addEventListener("click", () => {
  showAddPhotoContent(); // Afficher le contenu pour "Ajouter une photo"
  loadCategories(); // Charger les catégories dans le menu déroulant
});

// Fermer la modale
closeSharedModal.addEventListener("click", () => {
  sharedModal.classList.add("hidden");
});

// Fermer la modale en cliquant en dehors
sharedModal.addEventListener("click", (event) => {
  if (event.target === sharedModal) {
    sharedModal.classList.add("hidden");
  }
});

// ***********************************
// Fonctions pour basculer entre les contenus
// ***********************************

function showEditContent() {
  editContent.classList.remove("hidden"); // Afficher le contenu "Modifier"
  addPhotoContent.classList.add("hidden"); // Masquer le contenu "Ajouter une photo"
}

function showAddPhotoContent() {
  addPhotoContent.classList.remove("hidden"); // Afficher le contenu "Ajouter une photo"
  editContent.classList.add("hidden"); // Masquer le contenu "Modifier"
}

// ***********************************
// Gestion du bouton flèche pour revenir à la galerie photo
// ***********************************

const backToGalleryButton = document.getElementById("backToGallery");

backToGalleryButton.addEventListener("click", () => {
  showEditContent(); // Basculer vers le contenu de la galerie photo
});

// ***********************************
// Charger les projets dans la galerie
// ***********************************

async function loadModalGallery() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets.");
    }

    const projects = await response.json();

    // Vider la galerie avant d'ajouter les projets
    modalGallery.innerHTML = "";

    projects.forEach((project) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = project.imageUrl;
      img.alt = project.title;
      figure.appendChild(img);
      modalGallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur : ", error.message);
  }
}

// ***********************************
// Charger les catégories pour le formulaire
// ***********************************

async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories.");
    }

    const categories = await response.json();

    // Vider les options existantes
    photoCategory.innerHTML =
      '<option value="" disabled selected>Catégorie</option>';

    // Ajouter les catégories
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      photoCategory.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur : ", error.message);
  }
}

// ***********************************
// Gérer la soumission du formulaire d'ajout de photo
// ***********************************

addPhotoForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêcher le rechargement de la page

  const fileInput = document.getElementById("photoUpload");
  const title = document.getElementById("photoTitle").value;
  const categoryId = document.getElementById("photoCategory").value;

  if (!fileInput.files[0]) {
    alert("Veuillez ajouter une photo.");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("title", title);
  formData.append("category", categoryId);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      alert("Photo ajoutée avec succès !");
      sharedModal.classList.add("hidden");
      addPhotoForm.reset();
    } else {
      throw new Error("Erreur lors de l'ajout de la photo.");
    }
  } catch (error) {
    console.error("Erreur : ", error.message);
  }
});
