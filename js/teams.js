function loadContent(tabId, contentId) {
    fetch('content/' + tabId + '.txt')
        .then(response => response.text())
        .then(data => {
            document.getElementById(contentId).innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

function showTab(tabId) {
    var contents = document.getElementsByClassName('tab-content');
    var tabs = document.getElementsByClassName('tab');

    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }

    for (var j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove('active');
    }

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
    document.getElementById(tabId + '-content').classList.add('active');
    loadContent(tabId, tabId + '-content');
}

document.addEventListener('DOMContentLoaded', function () {
    let startTab = 'overview';
    loadContent(startTab, startTab + '-content');  // Load the initial tab content
});