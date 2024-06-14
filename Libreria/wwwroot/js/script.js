document.addEventListener('DOMContentLoaded', function () {
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];

    function updateStella(bookIsbn) {
        const bott = document.getElementById(`preferiti-${bookIsbn}`);
        if (!bott) return; // Assicurati che l'elemento bott esista nel DOM

        if (carrello.includes(bookIsbn)) {
            bott.textContent = "★";
        } else {
            bott.textContent = "☆";
        }
    }

    function handlePreferitiClick(bookIsbn) {
        const index = carrello.indexOf(bookIsbn);
        if (index !== -1) {
            carrello.splice(index, 1); // Rimuovi l'ISBN dal carrello se presente
        } else {
            carrello.push(bookIsbn); // Aggiungi l'ISBN al carrello se non presente
        }

        localStorage.setItem('carrello', JSON.stringify(carrello));
        updateStella(bookIsbn);
    }

    function initializeStelle() {
        const preferitiButtons = document.querySelectorAll('.bottone-preferiti');
        preferitiButtons.forEach(button => {
            const bookIsbn = button.dataset.isbn;
            updateStella(bookIsbn);
        });
    }

    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target.matches('.bottone-preferiti')) {
            const bookIsbn = target.dataset.isbn;
            handlePreferitiClick(bookIsbn);
        }
    });

    fetch('/api/LibroAPI')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tab = document.getElementById('libri').querySelector('tbody');
            tab.innerHTML = ''; // Clear existing rows before adding new ones
            data.forEach(book => {
                elementi(tab, book);
            });

            initializeStelle(); // Inizializza le stelle dopo aver caricato i dati
        })
        .catch(error => console.error('Error fetching data:', error));

    function elementi(tab, book) {
        const riga = document.createElement('tr');
        const col1 = document.createElement('td');
        const col2 = document.createElement('td');
        const col3 = document.createElement('td');
        const col4 = document.createElement('td');
        const col5 = document.createElement('td');
        const col6 = document.createElement('td');
        const link = document.createElement('a');
        const col7 = document.createElement('td');
        const bott = document.createElement('button');

        link.href = `novita.html?isbn=${book.isbn}`;

        bott.textContent = "☆";
        bott.classList.add('bottone-preferiti');
        bott.dataset.isbn = book.isbn;
        bott.id = `preferiti-${book.isbn}`; // ID unico per ogni bottone dei preferiti


        const imm = document.createElement('img');
        imm.src = book.url;
        imm.alt = book.url;
        imm.title = book.titolo;
        imm.id = 'immagine';
        link.appendChild(imm);

        col7.appendChild(bott);
        col6.appendChild(link);
        col1.textContent = book.titolo;
        col2.textContent = book.genere;
        col3.textContent = book.autore;
        col4.textContent = book.isbn;
        col5.textContent = book.prezzo + " €";
        riga.appendChild(col7);
        riga.appendChild(col6);
        riga.appendChild(col1);
        riga.appendChild(col2);
        riga.appendChild(col3);
        riga.appendChild(col4);
        riga.appendChild(col5);

        tab.appendChild(riga);

        link.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.setItem('selectedBook', JSON.stringify(book.isbn));
            window.location.href = link.href;
        });
    }

    document.getElementById('search-button').addEventListener('click', handleSearch);

    document.getElementById('search-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

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
                tab.innerHTML = '';
                data.forEach(book => {
                    if (book.isbn.toLowerCase() === t ||
                        book.titolo.toLowerCase().includes(t) ||
                        book.autore.toLowerCase().includes(t)) {
                        elementi(tab, book);
                    }
                });

                initializeStelle();
            })
            .catch(error => console.error('Error fetching data:', error));
    }
});
