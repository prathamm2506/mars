const api_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"
const api_key = "RzpWKf57XPMh7spBdrRZUAa05djtDNtNGfEccSzP"

const dateInput = document.querySelector('input[type="date"]');
const goButton = document.querySelector('.date-place button');
const cameras = document.querySelectorAll('.steps .btn');
const imageContainer = document.getElementById('image-container');

let date = ''
let photos = []

goButton.addEventListener('click', () => {
    selectedDate = dateInput.value
    console.log(selectedDate)
    if(!selectedDate){
        alert('Please select a date')
        return
    }

    fetchImages(selectedDate)
})

cameras.forEach(btn => {
    btn.addEventListener('click', () => {
        if (photos.length === 0) {
            alert('No images available. Please fetch images first by selecting a date.');
            return;
        }

        const selectedCamera = btn.id;
        display(selectedCamera)
    })
})

function fetchImages(date) {
    const url = `${api_url}?api_key=${api_key}&earth_date=${date}`;

    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'flex'; 

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error. Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data.photos.length === 0) {
                alert("No images found for the selected date.");
                return;
            }
            alert("Images fetched successfully!");
            photos = data.photos;
            console.log(photos);
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch images. Please try again.");
        })
        .finally(() => {
            loadingSpinner.style.display = 'none';  
        });
}


function display(camera){
    const filteredPhotos = photos.filter(photo => photo.camera.name === camera)

    imageContainer.innerHTML = ''; 

    if (filteredPhotos.length === 0) {
        imageContainer.innerHTML = `<p>No images found for the camera "${camera}".</p>`;
        return;
    }

    filteredPhotos.forEach(photo => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
            <div class="card">
                <img src="${photo.img_src}" class="card-img-top" alt="Mars photo">
                <div class="card-body">
                    <p class="card-text">ID: ${photo.id}</p>
                    <p class="card-text">Sol: ${photo.sol}</p>
                    <p class="card-text">Earth Date: ${photo.earth_date}</p>
                    <p class="card-text">Rover: ${photo.rover.name}</p>
                    <p class="card-text">Camera: ${photo.camera.full_name}</p>
                </div>
            </div>
        `;
        imageContainer.appendChild(col);
    });
}