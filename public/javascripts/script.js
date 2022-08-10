/* https://obfuscator.io/ */

/* fetch json data from server */
function fetch_all_data() {
    fetch('/data')
        .then(response => {
            if (!response.ok)
                throw new Error('Fetch error: ' + response.status)
            else
                return response.json();
        })
        .then(json => load_birds(json))
        .catch(err => console.error('Fetch error: ' + err.message));
}

function load_birds(all_bird_data) {
    // attach button to filter/display action
    const searchBtn = document.querySelector('button');
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        display_birds(all_bird_data)
    } );

    // display all birds by default
    display_birds(all_bird_data);
}

function display_birds(all_bird_data) {
    /* filter data */
    const bird_data = filter_bird_data(
        all_bird_data,
        document.querySelector("#status").value,
        document.querySelector("#searchTerm").value
    );

    // get the container
    const main = document.querySelector('#birds');

    // empty the container
    main.innerHTML = '';

    // add each card to the container
    for (const bird of bird_data) {
        const card = create_element_bird_card(bird);
        main.appendChild(card);
    }

    // display search result count
    document.querySelector("#searchResults").textContent = bird_data.length
}

function filter_bird_data(bird_data, status, search_string) {
    // filter by category
    var filtered = bird_data.filter(bird => status == "All" || status == bird.status)

    // filter by search term
    filtered = filtered.filter(bird => search_string == "" || (
        search_string_match(bird['primary_name'], search_string)
        || search_string_match(bird['english_name'], search_string)
        || search_string_match(bird['order'], search_string)
        || search_string_match(bird['family'], search_string)
        || search_string_match(bird['scientific_name'], search_string)
        || bird['other_names'].forEach(other_name => search_string_match(other_name, search_string))
    ))

    // sort
    var sort_func = (a, b) => 0;
    switch (document.querySelector("#sort").value) {
        case "Alphabetical":
            sort_func = (a, b) => a['primary_name'].normalize('NFC').localeCompare(b['primary_name'].normalize('NFC')); break;
        case "Reverse alphabetical":
            sort_func = (b, a) => a['primary_name'].normalize('NFC').localeCompare(b['primary_name'].normalize('NFC')); break;
        case "Shortest to longest":
            sort_func = (a, b) => a['size']['length']['value'] - b['size']['length']['value']; break;
        case "Longest to shortest":
            sort_func = (b, a) => a['size']['length']['value'] - b['size']['length']['value']; break;
        case "Lightest to heaviest":
            sort_func = (a, b) => a['size']['weight']['value'] - b['size']['weight']['value']; break;
        case "Heaviest to lightest.":
            sort_func = (b, a) => a['size']['weight']['value'] - b['size']['weight']['value']; break;
    }

    return filtered.sort(sort_func);
}

function search_string_match(data_string, search_string) {
    // normalize strings for string matching
    // - lower case
    // - Unicode Normalization Form C (NFC) Canonical Decomposition.
    const d = data_string.toLowerCase().normalize('NFC');
    const s = search_string.toLowerCase().normalize('NFC')
    return d.includes(s)
}

function create_element_bird_card(bird) {
    /* create card */
    const card = document.createElement('section');
    card.className = "card"

    /* container for image */
    const imgContainer = document.createElement('div');
    imgContainer.addEventListener('click', () => {
        location.href = `/bird/${bird.primary_name}`
    }, false);
    imgContainer.className = "card-image";
    card.appendChild(imgContainer);
    //console.log('hello');

    /* container for image title(s) */
    const imgTitleContainer = document.createElement('div');
    imgTitleContainer.className = "card-title";
    imgContainer.appendChild(imgTitleContainer);
    
    /* bird name Te Reo Maori */
    const imgTitleBirdName = document.createElement('p');
    if (bird.primary_name !== "") {
        imgTitleBirdName.textContent = bird.primary_name;
        imgTitleBirdName.setAttribute('lang', 'mi');
    } else {
        imgTitleBirdName.textContent = bird.english_name;
    }
    imgTitleContainer.appendChild(imgTitleBirdName);

    /* photo credit */
    const imgTitleCredit = document.createElement('span');
    imgTitleCredit.textContent = "Photo by " + bird.photo.credit;
    imgTitleContainer.appendChild(imgTitleCredit);

    /* image */
    const img = document.createElement('img');
    img.src = bird.photo.source;
    img.alt = "Photo of " + bird.english_name + " Credit: " + bird.photo.credit;
    imgContainer.appendChild(img);
    
    // conservation status circle
    const circle = document.createElement('div');
    circle.className = `circle ${conservation_color(bird.status)}`;
    imgContainer.appendChild(circle);

    /* card content */
    const cardContent = document.createElement('div');
    cardContent.className = "card-content";
    card.appendChild(cardContent);

    /* card title */
    const cardTitleBirdName = document.createElement('h2');
    cardTitleBirdName.className = "card-title";
    cardTitleBirdName.textContent = bird.english_name;
    cardContent.appendChild(cardTitleBirdName)

    /* bird stats list */
    const listBirdStats = document.createElement('ul');
    cardContent.appendChild(listBirdStats);

    const birdStats = ['scientific_name', 'family', 'order', 'status', 'length', 'weight'];
    for (const stat of birdStats) {
        const listItem = document.createElement('li');
        listBirdStats.appendChild(listItem);

        const statName = document.createElement('b');
        statName.textContent = stat.charAt(0).toUpperCase() + stat.replace('_', ' ').slice(1) + " ";
        listItem.appendChild(statName);

        const statValue = document.createElement('span');
        if (stat == 'length' || stat == 'weight') {
            statValue.textContent = `${bird['size'][stat]['value']} ${bird['size'][stat]['units']}`;
        } else {
            statValue.textContent = bird[stat];
        }
        listItem.appendChild(statValue);
    }

    return card;
}

function conservation_color(status) {
    switch (status) {
        case "Not Threatened": return "status-0";
        case "Not Threatened": return "status-0";
        case "Naturally Uncommon": return "status-1";
        case "Relict": return "status-2";
        case "Recovering": return "status-3";
        case "Declining": return "status-4";
        case "Nationally Increasing": return "status-5";
        case "Nationally Vulnerable": return "status-6";
        case "Nationally Endangered": return "status-7";
        case "Nationally Critical": return "status-8";
        case "Data Deficient": return "status-9";
    }
    return "";
}

fetch_all_data();