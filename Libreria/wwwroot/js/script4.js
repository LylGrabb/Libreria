let isbn = JSON.parse(localStorage.getItem('selectedBook'));
document.addEventListener('DOMContentLoaded', function () {
    let div1 = document.getElementById('carrello1')
    if (isbn != null && isbn !== "") {
        fetch(`/api/LibroAPI/isbn/${isbn}`)
            .then(response => response.json())
            .then(data => {
                let riga = document.createElement('tr');
                let col1 = document.createElement('td');
                let col2 = document.createElement('td');
                let img1 = document.createElement('img');
                let p1 = document.createElement('p');
                let p2 = document.createElement('p');

                p1.innerHTML = data.titolo;
                p2.innerHTML = data.autore;
                img1.src = data.url;
                col1.appendChild(img1);
                riga.appendChild(col1);
                col2.appendChild(p1);
                riga.appendChild(col2);
                div1.appendChild(riga);
            })
            .catch(error => console.error('Error fetching book details:', error));
    } else {
        document.getElementById('book-details').innerText = 'Nessun ISBN fornito';
    }
});