document.addEventListener('DOMContentLoaded', function () {
    let divContenitore = document.getElementById("scaffali");
    fetch('/api/LibroAPI')
        .then(response => response.json())
        .then(data => {
            data.forEach(b => {
                let genereId = b.genere.toLowerCase().split(" ").pop();

                let div = document.getElementById(genereId);
                if (div === null) {
                    // div principale
                    let div1 = document.createElement('div');
                    div1.id = genereId;

                    // titoletto
                    let titolo = document.createElement('h2');
                    titolo.textContent = b.genere;

                    // div secondario, contiene div immagine
                    let div2 = document.createElement('div');
                    div2.className = 'slick-carousel text-center';
                    div2.id = genereId + "ContenitoreImmagine";

                    // div immagine
                    let divI = document.createElement('div');
                    divI.className = "d-flex justify-content-center align-items-center";

                    // link e immagine
                    let link = document.createElement('a');
                    link.href = `novita.html?isbn=${b.isbn}`;
                    let img = document.createElement('img');
                    img.src = b.url;
                    img.alt = b.url;

                    link.appendChild(img);
                    divI.appendChild(link);
                    div2.appendChild(divI);
                    div1.appendChild(titolo);
                    div1.appendChild(div2);

                    // aggiunta div al contenitore principale
                    divContenitore.appendChild(div1);

                    // carosello
                    $(div2).slick({
                        centerMode: false,
                        centerPadding: '60px',
                        slidesToShow: 4,
                        arrows: true,
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    centerMode: true,
                                    centerPadding: '40px',
                                    slidesToShow: 3
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    arrows: false,
                                    centerMode: true,
                                    centerPadding: '40px',
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });

                    // evento link
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.setItem('selectedBook', JSON.stringify(b.isbn));
                        window.location.href = link.href;
                    });
                } else {
                    console.log("Div già esistente");
                    // recupera div dalla classe
                    let slickCarouselDiv = div.querySelector('.slick-carousel');

                    if (slickCarouselDiv) {
                        // crea div contenente div immagine
                        let divE = document.createElement('div');
                        divE.className = "d-flex justify-content-center align-items-center";

                        // crea link e immagine
                        let link = document.createElement('a');
                        link.href = `novita.html?isbn=${b.isbn}`;
                        let img = document.createElement('img');
                        img.src = b.url;
                        img.alt = b.url;

                        link.appendChild(img);
                        divE.appendChild(link);
                        slickCarouselDiv.appendChild(divE);

                        // evento link
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            localStorage.setItem('selectedBook', JSON.stringify(b.isbn));
                            window.location.href = link.href;
                        });

                        // aggiorna carosello
                        $(slickCarouselDiv).slick('slickAdd', divE);
                    } else {
                        console.error("Div con classe 'slick-carousel' non trovato dentro il div con ID:", genereId);
                    }
                }

            });
        })
        .catch(error => console.error('Error fetching data:', error));
});