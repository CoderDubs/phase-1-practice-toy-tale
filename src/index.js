/*
TO DO
2. Hook up a form that enables users to add new toys. Create an event listener
   so that, when the form is submitted, the new toy is persisted to the database
   and a new card showing the toy is added to the DOM

   //add in onwindowload method somehwere to render cards on loadup
*/
//const { create } = require("jsdom/lib/jsdom/living/generated/Blob");

class card {
  constructor(id, name, image, likes) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.likes = likes;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let addToy = false;
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toysUrl = 'http://localhost:3000/toys';
  const toyCollection = document.getElementById('toy-collection');

  //fix↓
  addBtn.addEventListener("click", () => {
    // Toggle form visibility
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";

    // Only add the event listener once, when the form is first shown
    if (addToy && !toyFormContainer.dataset.listenerAdded) {
      const toyForm = document.getElementsByClassName('add-toy-form');
      const toyNameInput = document.querySelector('#toy-name');
      const toyImageInput = document.querySelector('#toy-image');
      
      // Add the submit event listener once
      toyForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload
        const newToy = {
          name: toyNameInput.value,
          image: toyImageInput.value,
          likes: 0 // new toys will start with 0 likes
        };

        try {
          const response = await fetch(toysUrl, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(newToy)
          });

          const toy = await response.json();
          // Add the new toy to the DOM using the createCard function
          createCard(toy);

          // Clear the form fields after submission
          toyNameInput.value = '';
          toyImageInput.value = '';
        } catch (error) {
          console.error('Error adding new toy:', error);
        }
      });
    }
  });

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
    toyCollection.appendChild(card);
  }
});