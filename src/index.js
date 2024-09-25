/*
TO DO
2. Hook up a form that enables users to add new toys. Create an event listener
   so that, when the form is submitted, the new toy is persisted to the database
   and a new card showing the toy is added to the DOM
//add in onwindowload method somehwere
*/

class card {
  constructor(id, name, image, likes) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.likes = likes;
  }
}

let addToy = false;
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toysUrl = 'http://localhost:3000/toys';

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      //render toy
      fetchToys();
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  let toyData =[];
  async function fetchToys() {
    const response = await fetch(toysUrl);
    const toyData = await response.json();
    toyData.forEach(toy => createCard(toy));
  }
  function createCard(toy) {
    // Create a new card with innerHTML to reduce code repetition
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    // Append card to toy-collection div
    document.getElementById('toy-collection').appendChild(card);
  }
});