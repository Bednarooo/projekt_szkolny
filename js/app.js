document.addEventListener("DOMContentLoaded", () => {
  let noHovers = 0;
  let isFixed;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let sobel = new Audio("snd/sobel.mp3")

  const warning = document.getElementById("mobile-warning");
  const content = document.getElementById("card");
  const sadRatDiv = document.getElementById("sad_rat_div");
  const main = document.getElementById("main");

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

  noBtn.addEventListener("mouseenter", moveButton);
  noBtn.addEventListener("click", moveButton);
  yesBtn.addEventListener("click", onClickedYes);
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
    main.style.display = "none"

    sobel.play()
  }

  const choices = document.querySelectorAll('.choice');
  const dateSection = document.getElementById('date-section');

  const partyChoice = document.querySelector('[data-choice="food"]');
  const img = partyChoice.querySelector("img");
  const label = partyChoice.querySelector(".label");
  const hoverMsg = partyChoice.querySelector(".hover-msg");

  let converted = false;

  partyChoice.addEventListener("mouseenter", () => {

    if (converted) return;
    converted = true;
    hoverMsg.style.opacity = "1";


    // 1. fade out
    setTimeout(() => {
      partyChoice.classList.add("fade-out");
      setTimeout(() => {
        // 2. change content while invisible
        img.src = "img/food.jpg";
        label.innerText = "Jedzenie 🍕";

        // 3. fade in
        partyChoice.classList.remove("fade-out");
      }, 2000);
    }, 2000)
  });

  partyChoice.addEventListener("mouseleave", () => {
    hoverMsg.style.opacity = "0";
  });

  choices.forEach(choice => {
    choice.addEventListener('click', () => {

      choices.forEach(c => c.classList.remove('selected'));

      choice.classList.add('selected');

      dateSection.classList.add('show');
    });
  });

  flatpickr("#datePicker", {
    locale: "pl",
    minDate: "2026-06-17",
    dateFormat: "d.m.Y",
  });

  const confirmBtn = document.getElementById("confirmDateBtn");

  const finalScreen = document.getElementById("final-screen");
  const summaryText = document.getElementById("summaryText");
  const countdownEl = document.getElementById("countdown");
  const calendarDate = document.getElementById("calendarDate");

  function launchConfetti() {
    confetti({
      particleCount: 300,
      spread: 180,
      origin: { y: 0.6 }
    });
  }

  function startCountdown(dateStr) {
    const [day, month, year] = dateStr.split(".").map(Number);
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    const heart = document.getElementById("heart");

    function pulseHeart() {
      heart.classList.remove("pulse");
      void heart.offsetWidth; // reset animacji
      heart.classList.add("pulse");
    }

    function update() {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        countdownEl.innerHTML = "💖 DZISIAJ!";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      countdownEl.innerHTML = `
      <div class="time-box">
        <div class="time-value">${days}</div>
        <div class="time-label">dni</div>
      </div>

      <div class="time-box">
        <div class="time-value">${hours}</div>
        <div class="time-label">godz</div>
      </div>

      <div class="time-box">
        <div class="time-value">${minutes}</div>
        <div class="time-label">min</div>
      </div>

      <div class="time-box">
        <div class="time-value">${seconds}</div>
        <div class="time-label">sek</div>
      </div>
    `;
      pulseHeart()
    }

    update();
    setInterval(update, 1000);
  }

  confirmBtn.addEventListener("click", () => {

    const date =
      document.getElementById("datePicker").value;

    if (!date) {
      alert("Najpierw wybierz datę ❤️");
      return;
    }

    let selectedChoice
    choices.forEach(choice => {
      if (choice.classList.contains('selected')) {
        selectedChoice = choice;
      }
    })

    console.log("Wybrana data:", date, "Wybor randki: ", selectedChoice);

    const label = selectedChoice?.querySelector("p")?.innerText;

    fetch("https://formspree.io/f/mzdqjnyd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date,
        choice: label
      })
    });

    // 1. podsumowanie
    summaryText.innerText = `Zaznacz sobie w kalendarzyku! 📅\n${date} • ${label} z Kacprem!`;

    // 3. show screen
    finalScreen.classList.add("show");

    // 4. confetti
    launchConfetti();
    setTimeout(launchConfetti, 500);
    setTimeout(launchConfetti, 1200);

    // 5. countdown
    startCountdown(date);
  });
});
