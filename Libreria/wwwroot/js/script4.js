document.addEventListener('DOMContentLoaded', function () {
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    let carrelloBody = document.getElementById('carrello2');

    function aggiornaCarrello(isbn) {
        carrello = carrello.filter(item => item !== isbn);
        localStorage.setItem('carrello', JSON.stringify(carrello));
    }

    function svuotaCarrello() {
        carrello = [];
        localStorage.setItem('carrello', JSON.stringify(carrello));
        carrelloBody.innerHTML = '<tr id="par"><td colspan="6"><p>Nessun Libro Presente</p></td></tr>';
        noBooksMessage.style.display = 'block';
    }

    carrello.forEach(isbn => {
        if (isbn != null && isbn !== "") {
            fetch(`/api/LibroAPI/isbn/${isbn}`)
                .then(response => response.json())
                .then(data => {
                    let riga = document.createElement('tr');
                    let col1 = document.createElement('td');
                    let col2 = document.createElement('td');
                    let col3 = document.createElement('td');
                    let col4 = document.createElement('td');
                    let col5 = document.createElement('td');
                    let col6 = document.createElement('td');

                    let img1 = document.createElement('img');
                    img1.id = "img";
                    img1.src = data.url;
                    col1.appendChild(img1);

                    let bt = document.createElement('button');
                    bt.textContent = "Rimuovi dai preferiti";
                    bt.addEventListener('click', function () {
                        aggiornaCarrello(data.isbn);
                        carrelloBody.removeChild(riga);
                    });

                    col2.textContent = data.titolo;
                    col3.textContent = data.autore;
                    col4.textContent = data.isbn;
                    col5.textContent = `${data.prezzo}€`;
                    col6.appendChild(bt);

                    riga.appendChild(col1);
                    riga.appendChild(col2);
                    riga.appendChild(col3);
                    riga.appendChild(col4);
                    riga.appendChild(col5);
                    riga.appendChild(col6);

                    carrelloBody.appendChild(riga);
                })
                .catch(error => console.error('Error fetching book details:', error));
        }
    });

    const clearButton = document.getElementById('clear');
    const carrelloTable = document.getElementById('carrello-table');
    const noBooksMessage = document.getElementById('noBooksMessage');
    

    clearButton.addEventListener('click', function () {
        carrelloTable.style.display = 'none';
        noBooksMessage.style.display = 'block';
        svuotaCarrello();
    });
});
