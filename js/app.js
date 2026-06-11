document.addEventListener("DOMContentLoaded", () => {
  let noHovers = 0;
  let isFixed;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let sobel = new Audio("snd/sobel.mp3")

  const warning = document.getElementById("mobile-warning");
  const content = document.getElementById("card");
  const sadRatDiv = document.getElementById("sad_rat_div");

  if (isMobile) {
    content.style.display = "none";

    // small delay makes animation feel smoother
    setTimeout(() => {
      warning.classList.add("show");
    }, 50);
  } else {
    warning.style.display = "none";
    content.style.display = "block";
  }

  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementsByClassName("neon-btn").item(0);
  console.log(yesBtn)

  noBtn.addEventListener("mouseenter", moveButton);
  noBtn.addEventListener("click", moveButton);
  yesBtn.addEventListener("click", onClickedYes);// for mobile/taps
  const yesScreen = document.getElementById("yes-screen");

  noBtn.style.left = "50%";
  noBtn.style.top = "60%";

  function moveButton() {
    if (isFixed) {

    }
    noHovers = noHovers + 1;
    const padding = 20;

    const rect = noBtn.getBoundingClientRect();

    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    if (!isFixed) {
      noBtn.style.display = "none"

      // zapamiętaj aktualną pozycję zanim zmienisz layout
      noBtn.style.left = rect.left + "px";
      noBtn.style.top = rect.top + "px";

      noBtn.style.position = "fixed";

      // 🔥 2. wymuś render (kluczowy trick)
      noBtn.offsetHeight;

      isFixed = true;
      noBtn.style.display = "block"
    }

    if (noHovers > 3) {
      sadRatDiv.style.opacity = "1";
    }

    if (noHovers > 6) {
      noBtn.style.display = "none"
      yesBtn.classList.add('slower')
      yesBtn.style.width = "100%"
    }
  }

  function onClickedYes() {
    sadRatDiv.classList.add('notransition')
    noBtn.classList.add('notransition')
    sadRatDiv.style.opacity = 0;
    noBtn.style.display = "none";
    yesScreen.classList.add('show')

    sobel.play()
  }
});
