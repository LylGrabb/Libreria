document.addEventListener('DOMContentLoaded', function () {
    let t = document.getElementById('immg');
    fetch('/api/LibroAPI')
        .then(response => response.json())
        .then(data => {
            data.forEach(b => {
                let l = document.createElement('a');
                l.href = `pages/novita.html?isbn=${b.isbn}`;  // Pass ISBN via query string
                let m = document.createElement('img');
                m.src = `${b.url}`;
                m.id = "g";
                m.alt = `${b.url}`;
                l.appendChild(m);
                t.appendChild(l);

                l.addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.setItem('selectedBook', JSON.stringify(b.isbn));
                    window.location.href = l.href;
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to handle the search
    function handleSearch() {
        let ing = document.getElementById('search-input').value;
        let t = document.getElementById('immg');
        t.innerHTML = '';
        fetch('/api/LibroAPI')
            .then(r => r.json())
            .then(d => {
                d.forEach(b => {
                    if (b.isbn.toLowerCase() === ing.toLowerCase() || b.titolo.toLowerCase().includes(ing.toLowerCase()) || b.genere.toLowerCase() === ing.toLowerCase() || b.autore.toLowerCase() === ing.toLowerCase()) {
                        let l = document.createElement('a');
                        l.href = `pages/novita.html?isbn=${b.isbn}`;  // Pass ISBN via query string
                        let m = document.createElement('img');
                        m.src = `${b.url}`;
                        m.id = "g";
                        m.alt = `${b.url}`;
                        l.appendChild(m);
                        t.appendChild(l);

                        l.addEventListener('click', function (e) {
                            e.preventDefault();
                            localStorage.setItem('selectedBook', JSON.stringify(b.isbn));
                            window.location.href = l.href;
                        });
                    }
                })
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Add event listener for the search button
    document.getElementById('search-button').addEventListener('click', handleSearch);

    // Add event listener for the Enter key on the search input
    document.getElementById('search-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});
