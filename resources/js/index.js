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