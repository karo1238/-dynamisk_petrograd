window.addEventListener("load", sidenVises);

function sidenVises() {
    console.log("Siden vises");

    // læs produktliste
    $.getJSON("http://petlatkea.dk/2017/dui/api/productlist?callback=?", visProduktListe);

    document.querySelector(".filterknap_vegetar").addEventListener("click", filterVegetar);
    document.querySelector(".filterknap_ikkevegetar").addEventListener("click", filterIkkeVegetar);
    document.querySelector(".filterknap_tilbud").addEventListener("click", filterTilbud);
    document.querySelector(".filterknap_alkohol").addEventListener("click", filterAlkohol);

}


// filter knapper
function filterVegetar(event) {
    console.log("Klik på vegetar-filter");

    //find alle ikke-vegetar-produkter
    var liste = document.querySelectorAll(".produkt:not(.vegetar)");

    //skjul dem - tilføj klassen "hide"
    liste.forEach(div => div.classList.toggle("hide"))

    event.preventDefault();
}

function filterIkkeVegetar(event) {
    console.log("Klik på ikke vegetar-filter");

    //find alle vegetar-produkter
    var liste = document.querySelectorAll(".produkt.vegetar");

    //skjul dem - tilføj klassen "hide"
    liste.forEach(div => div.classList.toggle("hide"))

    event.preventDefault();
}


function filterTilbud(event) {
    console.log("Klik på tilbud-filter");

    //find alle tilbud-produkter
    var liste = document.querySelectorAll(".produkt:not(.tilbud)");

    //skjul dem - tilføj klassen "hide"
    liste.forEach(div => div.classList.toggle("hide"))

    event.preventDefault();
}

function filterAlkohol(event) {
    console.log("Klik på alkohol-filter");

    //find alle alkohol-produkter
    var liste = document.querySelectorAll(".produkt:not(.alkohol)");

    //skjul dem - tilføj klassen "hide"
    liste.forEach(div => div.classList.toggle("hide"))

    event.preventDefault();
}
// filter knapper slut


function visProduktListe(listen) {
    console.table(listen);

    // TODO: filtrer udsolgte produkter fra ...
    listen = listen.filter(produkt => !produkt.udsolgt);

    listen.forEach(visProdukt);
}

function visProdukt(produkt) {
    console.log(produkt);
    //klon produkt_template
    var klon = document.querySelector("#produkt_template").content.cloneNode(true);

    //indsæt data ind i klonen
    klon.querySelector(".data_navn").innerHTML = produkt.navn;
    klon.querySelector(".data_pris").innerHTML = produkt.pris;


    // regn rabatpris
    var rabatpris = Math.ceil(produkt.pris - (produkt.pris * produkt.rabatsats / 100));
    klon.querySelector(".data_rabatpris").innerHTML = rabatpris;


    // skift billede
    klon.querySelector(".data_billede").src = "/images/small/" + produkt.billede + "-sm.jpg";

    // udsolgt produkt - at fjerne teksten hvis retten ikke er udsolgt
    if (produkt.udsolgt == false) {
        //produktet er ikke udsolgt
        //udsolgttekst skal fjernes
        var udsolgttekst = klon.querySelector(".udsolgttekst");
        udsolgttekst.parentNode.removeChild(udsolgttekst);
    } else {
        //sæt streg over prisen, når produktet er udsolgt
        var pris = klon.querySelector(".pris");
        pris.parentNode.removeChild(pris);
    }

    // fjern rabatpris hvis der ikke er rabt
    if (produkt.udsolgt == true || produkt.rabatsats == 0) {
        // der er ikke rabat og rabatprisen skal derfor fjernes
        var rabatpris = klon.querySelector(".rabatpris");
        rabatpris.parentNode.removeChild(rabatpris);
    } else {
        //streg i orignalpris ved rabat
        klon.querySelector(".pris").classList.add("rabat");
    }


    // tilføj klasser til produkt

    if (produkt.vegetar == true) {
        klon.querySelector(".produkt").classList.add("vegetar");
    }
    if (produkt.udsolgt) {
        klon.querySelector(".produkt").classList.add("udsolgt");
    }
    if (produkt.rabatsats > 0) {
        klon.querySelector(".produkt").classList.add("tilbud");
    }

    if (produkt.alkoholprocent > 0) {
        klon.querySelector(".produkt").classList.add("alkohol");
    }



    // tilføj produkt-id til modalknap
    klon.querySelector(".modalknap").dataset.produkt = produkt.id;

    // modalboks  - registrer klik på modalknap
    klon.querySelector(".modalknap").addEventListener("click", modalKnaplKlik);

    //append klon til .produkt_liste
    document.querySelector(".produkt_liste").appendChild(klon);
}

function modalKnaplKlik(event) {
    console.log("knapklik", event);

    // find det produkt id hvis knap blev trykket på
    var produktId = event.target.dataset.produkt;
    console.log("klik på produkt", produktId);

    $.getJSON("http://petlatkea.dk/2017/dui/api/product?callback=?", {
        id: produktId
    }, visModalProdukt);
}

function visModalProdukt(produkt) {
    console.log("vis modal for", produkt);

    //find modal_template - klon den
    var klon = document.querySelector("#modal_template").content.cloneNode(true);

    // put data i klon
    klon.querySelector(".data_navn").innerHTML = produkt.navn;
    klon.querySelector(".data_billede").src = "/images/small/" + produkt.billede + "-sm.jpg";
    klon.querySelector(".data_region").innerHTML = produkt.oprindelsesregion;
    klon.querySelector(".data_langbeskrivelse").innerHTML = produkt.langbeskrivelse;
    klon.querySelector(".data_kategori").innerHTML = produkt.kategori;
    klon.querySelector(".data_pris").innerHTML = produkt.pris;

    // udsolgt produkt - at fjerne teksten hvis retten ikke er udsolgt
    if (produkt.udsolgt == false) {
        //produktet er ikke udsolgt
        //udsolgttekst skal fjernes
        var udsolgttekst = klon.querySelector(".udsolgttekst");
        udsolgttekst.parentNode.removeChild(udsolgttekst);
    } else {
        //sæt streg over prisen, når produktet er udsolgt
        var pris = klon.querySelector(".pris");
        pris.parentNode.removeChild(pris);
    }


    // regn rabatpris
    var rabatpris = Math.ceil(produkt.pris - (produkt.pris * produkt.rabatsats / 100));
    klon.querySelector(".data_rabatpris").innerHTML = rabatpris;

    // fjern rabatpris hvis der ikke er rabt
    if (produkt.udsolgt == true || produkt.rabatsats == 0) {
        // der er ikke rabat og rabatprisen skal derfor fjernes
        var rabatpris = klon.querySelector(".rabatpris");
        rabatpris.parentNode.removeChild(rabatpris);
    } else {
        //streg i orignalpris ved rabat
        klon.querySelector(".pris").classList.add("rabat");
    }



    // sletter det der stod i modal-content
    document.querySelector(".modal-content").innerHTML = "";

    // append klonen til modal-content
    document.querySelector(".modal-content").appendChild(klon);
}
