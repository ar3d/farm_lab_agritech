window.onload = () => {
    let method = 'dynamic';

    // if you want to statically add places, de-comment following line:
    method = 'static';
    if (method === 'static') {
        let places = staticLoadPlaces();
        return renderPlaces(places);
    }

    if (method !== 'static') {
        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
        {
            name: "Serra",
            location: {
                lat: 40.7400886, // change here latitude if using static data
                lng: 8.5555558, // change here longitude if using static data
            },
			look: "[gps-camera]",
			image: "assets/map-marker.png",
			href: "https://sites.google.com/view/farmlabagritech/farm-lab-agritech/serra",
			sfondo: "assets/sfondi/serra.jpg",
			text: "La serra di 900 mq, in cui sono coltivate specie stagionali, ornamentali ed aromatiche è un vero laboratorio per gli studenti della scuola in cui mettere in pratica le nozioni apprese."
},


		{
            name: "Serra_high_tech",
            location: {
                lat: 40.7399523, // change here latitude if using static data
                lng: 8.5567082, // change here longitude if using static data
            },
			look: "[gps-camera]",
			image: "assets/map-marker.png",
			href: "https://sites.google.com/view/farmlabagritech/farm-lab-agritech/serra-high-tech",
			sfondo: "assets/sfondi/serra_high_tech.jpg",
			text: "La serra di 200 mq, auto sostenibile, iper-tecnologica e gestibile da remoto attraverso una piattaforma digitale, consente di migliorare i livelli di apprendimento dei ragazzi."
},

		{
            name: "Convitto",
            location: {
                lat: 40.7394842, // change here latitude if using static data
                lng: 8.5571081, // change here longitude if using static data
            },
			look: "[gps-camera]",
			image: "assets/map-marker.png",
			href: "https://sites.google.com/view/farmlabagritech/farm-lab-agritech/convitto",
			sfondo: "assets/sfondi/convitto.jpg",
			text: "Lo stabile, prima sede della Regia scuola pratica di agricoltura, accoglie oggi la struttura convittuale, annessa all'Istituto d'istruzione superiore “N. Pellegrini” ed è in grado di accogliere circa 60 ragazzi."
},

		{
            name: "Orto_della_biodiversita",
            location: {
                lat: 40.7401775, // change here latitude if using static data
                lng: 8.5569946, // change here longitude if using static data
            },
			look: "[gps-camera]",
			image: "assets/map-marker.png",
			href: "https://sites.google.com/view/farmlabagritech/farm-lab-agritech/orto-della-biodiversit%C3%A0",
			sfondo: "assets/sfondi/orto.jpg",
			text: "L'orto della biodiversità è dotato di un sistema di controllo tecnologico dell'umidità, della temperatura e della luminosità per monitorare lo stato di salute delle piante."
},
    ];
}

// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: '',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    // NOTE this no longer works - please replace with your own proxy
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        // add place name
        let icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        icon.setAttribute('look-at', place.look);
		icon.setAttribute('name', place.name);
        icon.setAttribute('src', place.image);
        icon.setAttribute('scale', '8 8 8');
		icon.setAttribute('href', place.href);
		icon.setAttribute('sfondo', place.sfondo);
		icon.setAttribute('text', place.text);
		

        
        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));


// this click listener has to be added simply to a click event on an a-entity element
const clickListener = function (ev) {
    ev.stopPropagation();
    ev.preventDefault();

    const name = ev.target.getAttribute('name');
	const link = ev.target.getAttribute('href');
	const testo = ev.target.getAttribute('text');
	const sfondo = ev.target.getAttribute('sfondo');
    const el = ev.detail.intersection && ev.detail.intersection.object.el;
	
    if (el && el === ev.target) {
        // after click, we are adding a label with the name of the place
		const label = document.createElement('span');
        const container = document.createElement('div');
		container.setAttribute('id', 'place-label');
		label.innerHTML = '<a href="'+link+'" target="_blank" class="animated-button1" style="background-image:url('+sfondo+')"><span></span><span></span><span></span><span></span><p class="p1">'+name+'</p><br><p class="p2">'+testo+'</p></a>';
		container.appendChild(label);
		document.body.appendChild(container);
        
		

        setTimeout(() => {
            // that will disappear after less than 6 seconds
            container.parentElement.removeChild(container);
        }, 8000);
     }
 };
icon.addEventListener('click', clickListener);
        scene.appendChild(icon);
    });
}
