const btn = document.getElementById("turnBtn");
const frango = document.getElementById("frango");
const counter = document.getElementById("counter");

let years = 0;
let rotation = 0;

btn.addEventListener("click", () => {

  years++;

  rotation += 360;

  // roda o contentor
  frango.style.transform = `rotate(${rotation}deg)`;

  counter.innerHTML = `${years} anos a virar frangos`;

  // MUDA PARA GALINHA
  if(years === 10){

    frango.innerHTML = `
      <img 
        src="../imgs/galinha_animal.png"
        alt="Galinha"
        class="animal"
        draggable="false"
      >
    `;
  }

  // MUDA PARA CHICKEN LITTLE
  if(years === 50){

    counter.innerHTML = "TU ÉS O FRANGO";

    frango.innerHTML = `
      <img 
        src="../imgs/chicken_little.png"
        alt="Chicken Little"
        class="animal"
        draggable="false"
      >
    `;

    document.body.classList.add("insane");
  }

});