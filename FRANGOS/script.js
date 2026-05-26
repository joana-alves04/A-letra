const btn = document.getElementById("turnBtn");
const frango = document.getElementById("frango");
const counter = document.getElementById("counter");

let years = 0;
let rotation = 0;

let virouFrango = false;

btn.addEventListener("click", () => {

  years++;

  rotation += 360;

  // RODAR
  frango.style.transform = `rotate(${rotation}deg)`;

  // TEXTO NORMAL
  if(years < 50){
    counter.innerHTML = `${years} anos a virar frangos`;
  }

  // PINTO -> GALINHA
  if(years === 15){

    frango.innerHTML = `
      <img 
        src="../imgs/galinha_animal.png"
        alt="Galinha"
        class="animal"
        draggable="false"
      >
    `;
  }

  // CHICKEN LITTLE APENAS UMA VEZ
  if(years >= 50){

    // muda imagem só uma vez
    if(!virouFrango){

      virouFrango = true;

      frango.innerHTML = `
        <img 
          src="../imgs/chicken_little.png"
          alt="Chicken Little"
          class="animal"
          draggable="false"
        >
      `;

      document.body.classList.add("insane");

      frango.style.transition = "transform 0.15s linear";
    }

    // TEXTO FINAL
    counter.innerHTML = `
      <div class="final-text">

        <span class="main">
          VIRASTE UM FRANGO
        </span>

        <span class="years">
          ${years} anos a virar frangos
        </span>

      </div>
    `;
  }

 if(years >= 70 && !document.querySelector(".end-buttons")){

  // ESCONDER ELEMENTOS
  frango.style.display = "none";

  btn.style.display = "none";

  counter.style.display = "none";

  // CRIAR BOTÕES
  const buttons = document.createElement("div");

  buttons.classList.add("end-buttons");

  buttons.innerHTML = `

    <button 
      class="final-btn"
      onclick="window.location.href='sobre_frangos.html'"
    >
      SABER MAIS SOBRE A EXPRESSÃO
    </button>

    <button 
      class="final-btn"
      onclick="window.location.href='../HOMEPAGE/expressoes.html'"
    >
      PÁGINA INICIAL
    </button>

  `;

  document.querySelector(".scene").appendChild(buttons);
}
});