const btn = document.getElementById("sleepBtn");
const zzz = document.getElementById("zzz");

btn.addEventListener("click", () => {

  document.body.classList.add("sleep");

  let level = 0;

  const interval = setInterval(() => {

    level++;

    zzz.style.opacity = level * 0.1;
    zzz.innerHTML += "z";

    document.body.style.transform =
      `translateY(${level}px)`;

    if(level > 8){
      document.body.classList.add("dark");
    }

    if(level > 12){
      clearInterval(interval);

      zzz.innerHTML = "PASSASTE PELAS BRASAS";
      zzz.style.fontSize = "4rem";
      zzz.style.opacity = 1;
    }

  }, 400);

});