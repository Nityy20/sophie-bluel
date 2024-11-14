async function getData() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    i = 0;
    while (json[i]) {
      figure = document.createElement("figure"); //création balise
      image = document.createElement("image");
      image.innerHTML = json[i].imageUrl;
      document.getElementsByClassName("figure")[0].appendChild(image);
      figcaption = document.createElement("figcaption"); //création du figcaption
      figcaption.innerHTML = json[i].title; //concaténation on ajoute la valeur du compteur i à la chaine de caractères toto
      figure.appendChild(figcaption);
      document.getElementsByClassName("gallery")[0].appendChild(figure); //ajoute figure en enfant à gallery
      i++;
    }
    /* image=document.createElement("image");
      image.innerHTML=json[i].imageUrl;
      document.getElementsByClassName("gallery ou figure")[0].appendChild(image);
      i++ */
  } catch (error) {
    console.error(error.message);
  }
}
getData();
