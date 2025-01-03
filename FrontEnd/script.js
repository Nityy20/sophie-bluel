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
      figure = document.createElement("figure");
      figure.dataset.id = json[i].id; // Ajout de l'ID du projet comme data attribute
      image = document.createElement("img");
      image.setAttribute("src", json[i].imageUrl);
      image.setAttribute("alt", json[i].title);
      figure.appendChild(image);

      figcaption = document.createElement("figcaption");
      figcaption.innerHTML = json[i].title;
      figure.appendChild(figcaption);

      figure.dataset.category = json[i].categoryId;

      document.getElementsByClassName("gallery")[0].appendChild(figure);
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

function checkLoginStatus() {
  const token = sessionStorage.getItem("token"); // Récupère le token
  const editButton = document.getElementById("editButton"); // Bouton Modifier

  if (!editButton) {
    console.warn("Le bouton Modifier n'existe pas dans le DOM.");
    return; // Arrêter la fonction si le bouton n'est pas trouvé
  }

  if (token) {
    editButton.style.display = "inline-block"; // Affiche le bouton si connecté
  } else {
    editButton.style.display = "none"; // Cache le bouton sinon
  }
}

// bouton connexion en haut
function updateLoginPage() {
  const loginPage = document.getElementById("loginPage"); // Bouton Login

  if (!loginPage) {
    console.warn("Le bouton Login n'existe pas dans le DOM.");
    return;
  }

  const token = sessionStorage.getItem("token"); // Vérifie si un token est présent

  if (token) {
    loginPage.textContent = "Logout"; // Change le texte du bouton
    loginPage.href = "#"; // Empêche la redirection vers la page de login
    loginPage.addEventListener("click", handleLogout); // Associe l'événement de déconnexion
  } else {
    loginPage.textContent = "Login"; // Remet le texte à "Login"
    loginPage.href = "login.html"; // Redirige vers la page de login
    loginPage.removeEventListener("click", handleLogout); // Supprime l'événement logout
  }
}

// Gérer la déconnexion
function handleLogout(event) {
  event.preventDefault(); // Empêche la redirection vers la page login
  sessionStorage.removeItem("token"); // Supprime le token
  alert("Vous avez été déconnecté.");
  updateLoginPage(); // Met à jour le bouton
  window.location.reload(); // Recharge la page pour actualiser l'état
}

// fonction pour la préview des photos dans la modale
function setupPhotoPreview() {
  const fileInput = document.getElementById("photoUpload");
  const photoPreview = document.getElementById("photoPreview");

  if (fileInput) {
    // détecte le changement quand j'ajoute une image
    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];

      if (file) {
        const reader = new FileReader();
        // quand j'ajoute une image je la charge sur le background de ma photo preview
        reader.onload = function (event) {
          photoPreview.style.backgroundImage = `url(${event.target.result})`;
          photoPreview.style.display = "block"; // Affiche la prévisualisation
        };

        reader.readAsDataURL(file); // Lit le fichier comme URL
      } else {
        photoPreview.style.backgroundImage = "none";
        photoPreview.style.display = "none"; // Masque la prévisualisation
      }
    });
  }
}

// Appels dans l'ordre logique
getCategories(); // Charger les catégories
getData(); // Charger les projets
checkLoginStatus(); // Vérifie l'état de connexion
updateLoginPage(); // Mettre à jour le bouton Login/Logout
setupPhotoPreview(); // Configurer la prévisualisation des photos

// ***********************************
// Étape 2.2 avec le login
// ***********************************

// Gestion de l'événement pour le formulaire de login
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");

// bouton se connecter
if (loginButton) {
  loginButton.addEventListener("click", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    // Récupération des valeurs des champs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // requête API
      // test avec : alert("toto");
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
      } else {
        // Si la connexion est réussie, récupérer le token
        const data = await response.json();
        const token = data.token;
        console.log(data);
        console.log(token);

        // Stockage du token dans sessionStorage
        sessionStorage.setItem("token", token);
        console.log(sessionStorage.getItem("token"));

        // Redirection vers la page d'accueil
        window.location.href = "index.html";
      }
    } catch (error) {
      // erreur générique en cas de problème
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
const editButton = document.getElementById("editButton"); // Bouton Modifier
const addPhotoButton = document.getElementById("addPhotoButton");

// Bouton "Modifier" (ouvre la galerie photo)
if (editButton) {
  editButton.addEventListener("click", () => {
    showEditContent(); // Afficher le contenu pour "Modifier"
    sharedModal.classList.remove("hidden"); // Afficher la modale
    loadModalGallery(); // Charger les projets dans la galerie
  });
}

// Bouton "Ajouter une photo" (ouvre le formulaire d'ajout)
if (addPhotoButton) {
  addPhotoButton.addEventListener("click", () => {
    showAddPhotoContent(); // Afficher le contenu pour "Ajouter une photo"
    loadCategories(); // Charger les catégories dans le menu déroulant
  });
}

// Fermer la modale
if (closeSharedModal) {
  closeSharedModal.addEventListener("click", () => {
    sharedModal.classList.add("hidden");
  });
}

// Fermer la modale en cliquant en dehors
if (sharedModal) {
  sharedModal.addEventListener("click", (event) => {
    if (event.target === sharedModal) {
      sharedModal.classList.add("hidden");
    }
  });
}

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

if (backToGalleryButton) {
  backToGalleryButton.addEventListener("click", () => {
    showEditContent(); // Basculer vers le contenu de la galerie photo
  });
}

// ***********************************
// Charger les projets dans la galerie
// ***********************************
function deletePhotoFromGallery(photoId) {
  // Suppression dans la modale
  const modalItem = document.querySelector(
    `.modal-gallery .photo-item[data-id="${photoId}"]`
  );
  if (modalItem) {
    modalItem.remove();
  }

  // Suppression dans la page index
  const indexItem = document.querySelector(
    `.gallery figure[data-id="${photoId}"]`
  );
  if (indexItem) {
    indexItem.remove();
  }
}

async function loadModalGallery() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets.");
    }

    const projects = await response.json();

    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""; // Vider la galerie avant de la remplir

    projects.forEach((project) => {
      const photoItem = document.createElement("div");
      photoItem.classList.add("photo-item");
      photoItem.dataset.id = project.id; // Ajoute l'ID du projet pour la suppression

      const image = document.createElement("img");
      image.src = project.imageUrl;
      image.alt = project.title;

      // Bouton de suppression
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-photo");
      deleteButton.dataset.id = project.id;
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

      deleteButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        const photoId = event.target.closest(".delete-photo").dataset.id;
        const confirmDelete = confirm(
          "Êtes-vous sûr de vouloir supprimer cette photo ?"
        );
        if (confirmDelete) {
          try {
            const response = await fetch(
              `http://localhost:5678/api/works/${photoId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );
            if (response.ok) {
              deletePhotoFromGallery(photoId);
              alert("Photo supprimée avec succès !");
            } else {
              throw new Error("Erreur lors de la suppression de la photo.");
            }
          } catch (error) {
            console.error("Erreur lors de la suppression :", error.message);
            alert("Impossible de supprimer la photo. Veuillez réessayer.");
          }
        }
      });

      photoItem.appendChild(image);
      photoItem.appendChild(deleteButton);
      modalGallery.appendChild(photoItem);
    });
  } catch (error) {
    console.error("Erreur :", error.message);
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

    photoCategory.innerHTML =
      '<option value="" disabled selected>Catégorie</option>';

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

if (addPhotoForm) {
  const fileInput = document.getElementById("photoUpload");
  const titleInput = document.getElementById("photoTitle");
  const categoryInput = document.getElementById("photoCategory");
  const submitButton = document.querySelector("#submitButton");

  // Il faut que tous les champs soient remplis pour que le bouton valider s'active
  const updateButtonState = () => {
    const isFileSelected = fileInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categoryInput.value.trim() !== "";

    if (isFileSelected && isTitleFilled && isCategorySelected) {
      submitButton.disabled = false;
      submitButton.removeAttribute("title");
    } else {
      submitButton.disabled = true;
      submitButton.title =
        "⚠️ Veuillez remplir tous les champs pour activer ce bouton.";
    }
  };

  fileInput.addEventListener("change", updateButtonState);
  titleInput.addEventListener("input", updateButtonState);
  categoryInput.addEventListener("input", updateButtonState);

  updateButtonState();

  addPhotoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    const title = titleInput.value;
    const categoryId = categoryInput.value;

    if (!file) {
      alert("Veuillez ajouter une photo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const newProject = await response.json();
        alert("Photo ajoutée avec succès !");

        const gallery = document.querySelector(".gallery");
        const newFigure = document.createElement("figure");
        newFigure.dataset.id = newProject.id;
        const image = document.createElement("img");
        image.src = newProject.imageUrl;
        image.alt = newProject.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = newProject.title;

        newFigure.appendChild(image);
        newFigure.appendChild(figcaption);
        newFigure.dataset.category = newProject.categoryId;

        gallery.appendChild(newFigure);

        sharedModal.classList.add("hidden");
        addPhotoForm.reset();
        updateButtonState();
      } else {
        throw new Error("Erreur lors de l'ajout de la photo.");
      }
    } catch (error) {
      console.error("Erreur : ", error.message);
    }
  });
}
