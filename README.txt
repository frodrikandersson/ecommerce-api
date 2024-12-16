***URL search querys***

Sök på produktens namn! Ej case sensitive och den hittar även alla produkter med ett snarlikt namn.
Nedanstående exemplet ger Julgran och Julgranskula som resultat
/products?name=julgran

Du kan söka på namn och ObjectId för category. De två exemplen nedanför ger samma resultat
/products?category=jul
/products?category=67587d1b1b92081d71bb9836

Sök med price, ange minPrice(100) följt av ett streck(-) och maxPrice(300).
Detta söker på alla produkter som har ett pris inom den angedda omfånget.
/products?price=100-300

Filtrera med högst eller lägst rating via nedanstående querys.
/products?averageRating=true&ratingSort=desc
/products?averageRating=true&ratingSort=asc

Exempel på en url som använder alla querys.
/products?name=jul&category=67587d1b1b92081d71bb9836&price=1-500&averageRating=true&ratingSort=asc