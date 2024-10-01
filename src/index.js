/*
3. Create an event listener that gives users the ability to click a button to
   "like" a toy. When the button is clicked, the number of likes should be
   updated in the database and the updated information should be rendered to the
   DOMd

patchLikes() seems like a good plan? or 
is it possible to add the like button event listener and PATCH request inside the
other event listeners?
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

  // Fetch and render toys on page load
  fetchToys();
  patchLikes();
  //refresh page

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
          id: Date.now(),
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
      toys.forEach(toy => createCard(toy));
    } catch (error) {
      console.error('Error fetching toys:', error);
    }
  }
  async function patchLikes() {
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('like-btn')) { // Check if the clicked element is a like button
        
        
        const button = event.target;
        const toyId = button.id; // Retrieve the toy ID from the button
        
        
        //find de wei to calc da like
        const likesParagraph = button.previousElementSibling;
        let newNumberOfLikes = parseInt(likesParagraph, 10);
        

        console.log(`Toy ID: ${toyId}`);
        console.log(`Current Likes: ${newNumberOfLikes.textContent}`);
      }
    
    });
  }
});