function loadHeader() {
    // Determine the base path based on the current location
    let basePath = '';
    if (window.location.pathname.includes('/pages/')) {
        basePath = '../';  // Adjust the path based on the file's location
    } else {
        basePath = './';   // Default path for root directory files
    }

    // Fetch the header HTML
    fetch(basePath + 'pages/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // headerPlaceholder.style.visibility = 'show'; // Show header once loaded
        })
        .catch(error => console.error('Error loading header:', error));
}

document.addEventListener('DOMContentLoaded', loadHeader);
