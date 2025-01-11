function updateMarsTimer() {
    const launchDate = new Date('2012-05-26T00:00:00Z');
    const now = new Date();
    const diff = now - launchDate;
  
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
    document.getElementById('years').textContent = years + " ";
    document.getElementById('months').textContent = months + " ";
    document.getElementById('days').textContent = days + " ";
    document.getElementById('hours').textContent = hours + " ";
    document.getElementById('minutes').textContent = minutes + " ";
    document.getElementById('seconds').textContent = seconds;
  }
  
  setInterval(updateMarsTimer, 1000);
  
  
  
  
  
  
  
  
  
  
  
  
  const api_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
  const api_key = "RzpWKf57XPMh7spBdrRZUAa05djtDNtNGfEccSzP";
  
  // Selecting necessary elements
  const dateInput = document.getElementById("date-input");
  const goButton = document.getElementById("go-button");
  const gsubdiv = document.querySelector(".gsubdiv");
  const filterButtons = document.querySelectorAll(".btn");
  const preloader = document.getElementById("preloader");
  
  // Store fetched images
  let allPhotos = [];
  
  // Store the selected filter type
  let imageType = "ALL";
  
  // Event listener for the filter buttons
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Update the selected button's active state
      setActiveButton(button);
      
      // Set the filter type based on the button ID
      imageType = button.id === "all" ? "ALL" : button.id;
      filterImages();
    });
  });
  
  // Event listener for the date input
  goButton.addEventListener("click", () => {
    fetchImages();
  });
  
  // Function to set the active button
  function setActiveButton(selectedButton) {
    // Remove 'active' class from all buttons
    filterButtons.forEach(button => button.classList.remove("active"));
    
    // Add 'active' class to the selected button
    selectedButton.classList.add("active");
  }
  
  // Show preloader
  function showPreloader() {
    preloader.style.display = "flex";
  }
  
  // Hide preloader
  function hidePreloader() {
    preloader.style.display = "none";
  }
  
  // Fetch images from the API
  async function fetchImages() {
    const selectedDate = dateInput.value;
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }
  
    // Show preloader
    showPreloader();
  
    // Construct the API URL
    const url = `${api_url}?earth_date=${selectedDate}&api_key=${api_key}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      allPhotos = data.photos; // Store all fetched photos
      
      // Hide preloader after images are fetched
      hidePreloader();
      
      // Show gsubdiv once images are fetched
      gsubdiv.style.display = "flex";
      
      // Display images
      displayImages(allPhotos);
    } catch (error) {
      console.error("Error fetching images:", error);
      hidePreloader(); // Hide preloader in case of error
    }
  }
  
  // Display images inside the gsubdiv
  function displayImages(photos) {
    gsubdiv.innerHTML = "";
  
    if (photos.length === 0) {
      gsubdiv.innerHTML = "<p>No images found for the selected date or camera.</p>";
      return;
    }
  
    photos.forEach(photo => {
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("imgtext");
      imgDiv.innerHTML = ` 
        <img src="${photo.img_src}" alt="Mars Rover Image" />
        <p>ID: ${photo.id}</p>
        <p>Sol: ${photo.sol}</p>
        <p>Earth Date: ${photo.earth_date}</p>
        <p>Rover: ${photo.rover.name}</p>
        <p>Camera: ${photo.camera.full_name}</p>
      `;
      gsubdiv.appendChild(imgDiv);
    });
  }
  
  // Filter images based on the selected type
  function filterImages() {
    // Show preloader when filtering
    showPreloader();
  
    let filteredPhotos = allPhotos;
  
    if (imageType !== "ALL") {
      filteredPhotos = allPhotos.filter(photo => photo.camera.name === imageType);
    }
  
    // Display filtered images and hide preloader after filtering
    displayImages(filteredPhotos);
    hidePreloader();
  }
  