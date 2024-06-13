document.getElementById('invio').addEventListener('click', function () {
    const t = document.getElementById('titolo').value;
    const i = document.getElementById('isbn').value;
    const g = document.getElementById('genere').value;
    const a = document.getElementById('autore').value;
    const pa = parseInt(document.getElementById('pagine').value);
    const pr = parseFloat(document.getElementById('prezzo').value);
    const d = document.getElementById('descrizione').value;
    const u = document.getElementById('url').value;

    fetch(`/api/LibroAPI/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            titolo: t,
            genere: g,
            autore: a,
            isbn: i,
            pagine: pa,
            url: u,
            prezzo: pr,
            descrizione: d,
            scaffaleid: 0
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message); });
            }
            return response.json();
        })
        .then(data => {
            console.log('Data sent successfully:', data);
            var gif = document.getElementById('success-gif');
            gif.classList.remove('hidden');

            // Nascondi la GIF dopo 3 secondi
            setTimeout(function () {
                gif.classList.add('hidden');
            }, 3000);
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });

});
