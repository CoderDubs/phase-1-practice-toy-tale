/**
 * Toy Management App
 * This script dynamically manages toy cards by fetching, adding, and updating likes.
 * Key features:
 * - Fetch and render toy cards from the server on page load.
 * - Toggle toy form visibility and handle new toy submissions.
 * - Map all toys using their unique ID for efficient lookups and updates.
 * - Update toy likes dynamically both on the page and server-side.
 */
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
  const toysMap = new Map();
  // Fetch and render toys on page load
  fetchToys();
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
    // Only add the event listener once, when the form is first shown
    if (addToy && !toyFormContainer.dataset.listenerAdded) {
      const toyForm = document.getElementsByClassName('add-toy-form')[0];
      const toyNameInput = document.querySelector('input[name="name"]');
      const toyImageInput = document.querySelector('input[name="image"]');
      // Add the submit event listener once
      toyForm.addEventListener('submit', async (e) => {   
        e.preventDefault(); // Prevent page reload
        const newToy = {
          id: String(Date.now()),
          //change in order to access last id easier?
          name: toyNameInput.value,
          image: toyImageInput.value,
          likes: 0 // new toys will start with 0 likes
        }; try {
          const response = await fetch(toysUrl, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(newToy)
          });
          const toy = await response.json();
          //map each card before creation
          toysMap.set(toy.id, toy);
          console.log(toysMap);
          createCard(toy);
          toyForm.reset();
        } catch (error) {
          console.error('Error adding new toy:', error);
        }
      });
      toyFormContainer.dataset.listenerAdded = true;
    }
  });

  // Function to create toy cards
  function createCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
  }

  // Fetch toys from server and render them on the page
  async function fetchToys() {
    try {
      const response = await fetch(toysUrl);
      if (!response.ok) { // Check if the response status is in the 200-299 range
        const message = `Error: ${response.status}`;
        throw new Error(message);
      }
      const toys = await response.json();
      toys.forEach(toy => {
        toysMap.set(toy.id, toy);
        createCard(toy);
      });
    } catch (error) {
      console.error('Error fetching toys:', error);
    }
  }
  async function patchLikes() {
    document.addEventListener('click', async function(event) {
      if (event.target.classList.contains('like-btn')) {
        const button = event.target;
        const toyId = button.id;
        const toyCard = toysMap.get(toyId);
        if (toyCard) {
          toyCard.likes += 1;
          const likesParagraph = button.previousElementSibling;
          likesParagraph.textContent = `${toyCard.likes} Likes`;
          //debugging
          //console.log(`Toy ID: ${toyId}`);
          //console.log(`Current Likes: ${toyCard.likes}`);
          try {
            const response = await fetch(`http://localhost:3000/toys/${toyId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                "likes": toyCard.likes })
            });
            if (!response.ok) {
              throw new Error(`Failed to update likes for Toy ID ${toyId}`);
            }

            console.log(`Successfully updated likes for Toy ID ${toyId} on the server.`);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error(`Toy with ID ${toyId} not found.`);
        }
      }
    });
  }
  patchLikes();
});