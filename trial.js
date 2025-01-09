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

    document.getElementById('years').textContent = years + " " + " :";
    document.getElementById('months').textContent = months + " " + " :";
    document.getElementById('days').textContent = days + " " + " :";
    document.getElementById('hours').textContent = hours + " " + " :";
    document.getElementById('minutes').textContent = minutes + " " + " :";
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateMarsTimer, 1000);












const api_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
      const api_key = "RzpWKf57XPMh7spBdrRZUAa05djtDNtNGfEccSzP";

      const dateInput = document.getElementById("date-input");
      const goButton = document.getElementById("go-button");
      const imageContainer = document.getElementById("image-container");
      const loadingSpinner = document.getElementById("loading-spinner");
      const cameras = document.querySelectorAll(".btn-container .btn");
      const imageModal = document.getElementById("image-modal");
      const modalImage = document.getElementById("modal-image");
      const closeModal = document.getElementById("close-modal");

      let photos = [];

      goButton.addEventListener("click", () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) {
          alert("Please select a date");
          return;
        }
        fetchImages(selectedDate);
      });

      cameras.forEach((btn) => {
        btn.addEventListener("click", () => {
          cameras.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          if (photos.length === 0) {
            alert("No images available. Please fetch images first by selecting a date.");
            return;
          }

          const selectedCamera = btn.id;
          displayImages(selectedCamera);
        });
      });

      function fetchImages(date) {
        const url = `${api_url}?api_key=${api_key}&earth_date=${date}`;
        loadingSpinner.style.display = "block";

        fetch(url)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error. Status: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.photos.length === 0) {
              alert("No images found for the selected date.");
              return;
            }
            photos = data.photos;
            alert("Images fetched successfully!");
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to fetch images. Please try again.");
          })
          .finally(() => {
            loadingSpinner.style.display = "none";
          });
      }

      function displayImages(camera) {
        const filteredPhotos = camera === "all" ? photos : photos.filter((photo) => photo.camera.name === camera);

        imageContainer.innerHTML = "";

        if (filteredPhotos.length === 0) {
          imageContainer.innerHTML = `<p>No images found for the camera "${camera}".</p>`;
          return;
        }

        filteredPhotos.forEach((photo) => {
          const col = document.createElement("div");
          col.className = "column show";
          col.innerHTML = `
            <div class="content">
              <img src="${photo.img_src}" alt="Mars photo" style="width:100%" class="image-clickable">
              <div class="details">
                <p>ID: ${photo.id}</p>
                <p>Sol: ${photo.sol}</p>
                <p>Earth Date: ${photo.earth_date}</p>
                <p>Rover: ${photo.rover.name}</p>
                <p>Camera: ${photo.camera.full_name}</p>
              </div>
            </div>
          `;
          imageContainer.appendChild(col);
        });

        document.querySelectorAll(".image-clickable").forEach((img) => {
          img.addEventListener("click", (e) => {
            modalImage.src = e.target.src;
            imageModal.style.display = "flex";
          });
        });
      }

      closeModal.addEventListener("click", () => {
        imageModal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === imageModal) {
          imageModal.style.display = "none";
        }
      });