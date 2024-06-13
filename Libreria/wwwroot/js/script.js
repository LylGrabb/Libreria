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
});

document.getElementById('search-button').addEventListener('click', function () {
    const t = document.getElementById('search-input').value;
    fetch('/api/LibroAPI')
        .then(r => r.json())
        .then(d => {
            const tab = document.getElementById('libri').querySelector('tbody');
            tab.innerHTML = '';
            d.forEach(b => {
                if (b.isbn.toLowerCase() === t.toLowerCase()) {
                    elementi(tab, b);
                } else if (b.titolo.toLowerCase().includes(t.toLowerCase())) {
                    elementi(tab, b);
                } else if (b.autore.toLowerCase().includes(t.toLowerCase())) {
                    elementi(tab, b);
                }
            })

        })
        .catch (error => console.error('Error fetching data:', error));
})

function elementi(tab, book) {
    const riga = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    const col3 = document.createElement('td');
    const col4 = document.createElement('td');

    col1.textContent = book.titolo;
    col2.textContent = book.genere;
    col3.textContent = book.autore;
    col4.textContent = book.isbn;
    riga.appendChild(col1);
    riga.appendChild(col2);
    riga.appendChild(col3);
    riga.appendChild(col4);

    tab.appendChild(riga);
}
