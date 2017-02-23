window.addEventListener("load", sidenVises);

function sidenVises() {
    console.log("Siden vises");


    // læs produktliste
    $.getJSON("http://petlatkea.dk/2017/dui/api/productlist?callback=?", visProduktListe);
}

function visProduktListe(listen) {
    console.table(listen);
    listen.forEach(visProdukt);

}

function visProdukt(produkt) {
    console.log(produkt);
    //klon produkt_template
    var klon = document.querySelector("#produkt_template").content.cloneNode(true);

    //indsæt data ind i klonen

    //append klon til .produkt_liste
    document.querySelector(".produkt_liste").appendChild(klon);
}
