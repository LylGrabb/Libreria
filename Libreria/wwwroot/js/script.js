document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/LibroAPI')
        .then(response => response.json())
        .then(data => {
            const tab = document.getElementById('libri').querySelector('tbody');
            tab.innerHTML = ''; // Clear existing rows before adding new ones
            data.forEach(book => {
                elementi(tab, book);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    function handleSearch() {
        const t = document.getElementById('search-input').value.trim().toLowerCase();
        fetch('/api/LibroAPI')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const tab = document.getElementById('libri').querySelector('tbody');
                tab.innerHTML = ''; // Clear existing rows
                data.forEach(book => {
                    if (book.isbn.toLowerCase() === t ||
                        book.titolo.toLowerCase().includes(t) ||
                        book.autore.toLowerCase().includes(t)) {
                        elementi(tab, book);
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    document.getElementById('search-button').addEventListener('click', handleSearch);

    document.getElementById('search-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
});



function elementi(tab, book) {
    const riga = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    const col3 = document.createElement('td');
    const col4 = document.createElement('td');
    const col5 = document.createElement('td');

    col1.textContent = book.titolo;
    col2.textContent = book.genere;
    col3.textContent = book.autore;
    col4.textContent = book.isbn;
    col5.textContent = book.prezzo + " €";
    riga.appendChild(col1);
    riga.appendChild(col2);
    riga.appendChild(col3);
    riga.appendChild(col4);
    riga.appendChild(col5);

    tab.appendChild(riga);
}
