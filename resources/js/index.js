function getRssFeed(magazines) {
    magazines.forEach((item, i) => {
        async function getFeeds() {
            try{
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${item}`);
                if (response.status === 200) {
                    const data = await response.json();
                    renderAccordion(data, i);
                    addCarouselToDOM(data, i);
                    return data;
                } else {
                    throw error;
                }
            } catch (err) {
                console.log(err);
            }
        }
        getFeeds();
    });
}

// To render accordion to DOM
function renderAccordion(data, i) {
    const accordionSection = document.querySelector('#accordionSection');
    const {feed} = data;
    const divAccordionItem = `<div class="accordion-item">
                                <h2 class="accordion-header" id="${i}">
                                    <button class="accordion-button ${i === 0 ? "" : "collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                                    ${feed.title}
                                    </button>
                                </h2>
                                <div id="collapse${i}" class="accordion-collapse collapse ${i=== 0 ? "show": ""}" aria-labelledby="${i}" data-bs-parent="#accordionSection">
                                    <div class="accordion-body">
                                        <div id="carouselExampleIndicators-${i}" class="carousel slide pointer-event" data-ride="carousel">
                                        <div class="carousel-inner-${i}">
                                        </div>
                                    </div>
                                    </div>
                                </div>
                              </div>`;
    console.log("i", i)
    accordionSection.innerHTML += divAccordionItem;
   
}

// TO render Carousel within accordion body
function addCarouselToDOM(data, index) {
    const {items} = data;
    const carouselExampleIndicators = document.querySelector(`#carouselExampleIndicators-${index}`);
    const carouselInner = document.querySelector(`.carousel-inner-${index}`);
    console.log(items);

    items.forEach((el, i) => {
        const divCarouselItem = document.createElement('div');
        divCarouselItem.setAttribute('class', 'carousel-item');

        if (i === 0) {
            divCarouselItem.classList.add('active');
        }
        let cardTemplate = `<img class="d-block w-100 img img-responsive" src=${el.enclosure.link} alt="${el.guid}">
                            <a href="${el.link}" class="card-link" target="_blank">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${el.title}</h5>
                                    <p class="card-author">${el.author} <span class="ellipse"></span> ${new Date(el.pubDate).toLocaleDateString()}</p>
                                    <p class="card-text">${el.description}</p>
                                </div>
                            </div>
                            </a>
                            `;
        divCarouselItem.innerHTML += cardTemplate;

        carouselInner.appendChild(divCarouselItem);
    })
    
//   creating carousel control prev button
  let carouselControlPrevious = document.createElement('a');

  carouselControlPrevious.setAttribute('class', 'carousel-control-prev');
  carouselControlPrevious.setAttribute('href', `#carouselExampleIndicators-${index}`);
  carouselControlPrevious.setAttribute('role', 'button');
  carouselControlPrevious.setAttribute('data-slide', 'prev');

  carouselControlPrevious.innerHTML = ` <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>`;

  carouselExampleIndicators.appendChild(carouselControlPrevious);

  //creating carousel control next button
  let carouselControlNext = document.createElement('a');
  carouselControlNext.setAttribute('class', 'carousel-control-next');
  carouselControlNext.setAttribute('href', `#carouselExampleIndicators-${index}`);
  carouselControlNext.setAttribute('role', 'button');
  carouselControlNext.setAttribute('data-slide', 'next');   
  
  carouselControlNext.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span>
                                   <span class="sr-only">Next</span>`;

  carouselExampleIndicators.appendChild(carouselControlNext);

    // console.log(carouselIndicators);
    console.log(carouselInner);
}

export {getRssFeed}




/* // CRIO_SOLUTION_START_MODULE_XBOARD
let ID = () => Math.random().toString(36).substr(2, 9);

let createCard = (item) =>
  $(
    `<div class="card d-block">
  <img class="card-img-top img-fluid" src="${item["enclosure"]["link"]}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${item["title"]}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${item["author"]}</h6>
    <p class="card-subtitle text-secondary">${item["pubDate"]}</p>
    <p class="card-text">${item["description"]}</p>
    <a href="${item["link"]}" class="stretched-link" target="_blank"></a>
  </div>
  </div>`
  );

let createAccordion = (title, id) =>
  $(
    `<button class="btn btn-outline-secondary btn-block my-2" data-toggle="collapse" data-target="#${id}">${title}</button>
  <div id="${id}" class="collapse show">
  </div>`
  );

let createCarouselOuter = (id, innerId) =>
  $(
    `<div id="${id}" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner" id="${innerId}">
  </div>
  <a class="carousel-control-prev" href="#${id}" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#${id}" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
  </div>`
  );

let createCarouselInner = (id, active) =>
  $(
    `<div class="carousel-item ${active ? "active" : ""}" id="${id}">
  </div>`
  );

for (i in magazines) {
  let url = magazines[i];
  fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURI(url)}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Create accordion
      let accordionId = ID();
      let accordion = createAccordion(data["feed"]["title"], accordionId);
      $("#feedData").append(accordion);

      // Create carousel
      let carouselId = ID();
      let carouselInnerId = ID();
      let carousel = createCarouselOuter(carouselId, carouselInnerId);
      $(`#${accordionId}`).append(carousel);

      // Add the cards in the carousel
      let items = data["items"];
      for (j in items) {
        let card = createCard(items[j]);
        let innerCarouselCardId = ID();
        let innerCarouselCard = createCarouselInner(
          innerCarouselCardId,
          j == 0
        );
        $(`#${carouselInnerId}`).append(innerCarouselCard);
        $(`#${innerCarouselCardId}`).append(card);
      }
    });
}
// CRIO_SOLUTION_END_MODULE_XBOARD
*/
