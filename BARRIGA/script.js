const clock = document.getElementById("clock");
const title = document.getElementById("title");

let hunger = 0;

window.addEventListener("wheel", () => {

  hunger++;

  const hour = document.getElementById("hour");
  const minute = document.getElementById("minute");

  hour.style.transform = `translateX(-50%) rotate(${hunger * 8}deg)`;
  minute.style.transform = `translateX(-50%) rotate(${hunger * 20}deg)`;

  if(hunger > 10){
    clock.classList.add("hungry");
    title.innerHTML = "A barriga está a dar horas...";
  }

  if(hunger > 25){
    document.body.style.background = "#2b0000";
    title.innerHTML = "🍔🍕🍟";
  }

  if(hunger > 40){
    title.innerHTML = "BARRIGA A DAR HORAS";
    title.style.fontSize = "5rem";
  }

});