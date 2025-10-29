//  Simple Guessing Game (API + only easy popular flags)
(() => {
  // ---------- START INTERFACE ----------
  const startScreen = document.getElementById("start-screen");
  const startBtn = document.getElementById("start-btn");
  const gameContainer = document.getElementById("game-container");

  startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
  });

  // ---------- GAME VARIABLES ----------
  let coins = 100;
  const coinsEl = document.getElementById("coins");
  const FALLBACK = "https://via.placeholder.com/360x220?text=No+Image";

  const btnCountry = document.getElementById("btn-country");
  const btnCelebrity = document.getElementById("btn-celebrity");
  const btnCar = document.getElementById("btn-car");

  const countryGame = document.getElementById("country-game");
  const celebrityGame = document.getElementById("celebrity-game");
  const carGame = document.getElementById("car-game");

  const flagImg = document.getElementById("flag");
  const celebImg = document.getElementById("celebrity-img");
  const carImg = document.getElementById("car-img");

  const countryInput = document.getElementById("country-guess");
  const celebInput = document.getElementById("celebrity-guess");
  const carInput = document.getElementById("car-guess");

  const submitCountry = document.getElementById("submit-country");
  const submitCeleb = document.getElementById("submit-celebrity");
  const submitCar = document.getElementById("submit-car");

  const countryFeedback = document.getElementById("country-feedback");
  const celebFeedback = document.getElementById("celebrity-feedback");
  const carFeedback = document.getElementById("car-feedback");

  const updateCoins = n => (coinsEl.textContent = (coins += n));

  const showGame = name => {
    [countryGame, celebrityGame, carGame].forEach(g => g.classList.remove("active"));
    if (name === "country") countryGame.classList.add("active");
    if (name === "celebrity") celebrityGame.classList.add("active");
    if (name === "car") carGame.classList.add("active");
  };

  const safeSetImage = (el, url) => {
    el.onerror = () => (el.src = FALLBACK);
    el.src = url || FALLBACK;
  };

  // ---------- COUNTRY GAME ----------
  let currentCountry = null;
  const easyCountries = [
    "India", "United States", "Canada", "Japan", "France",
    "Germany", "Brazil", "Australia", "Italy", "United Kingdom"
  ];

  async function loadCountry() {
    countryFeedback.textContent = "Loading flag...";
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");
      const data = await res.json();
      const list = data.data.filter(c => easyCountries.includes(c.name));
      const pick = list[Math.floor(Math.random() * list.length)];
      currentCountry = { name: pick.name, flag: pick.flag };
      safeSetImage(flagImg, pick.flag);
      countryFeedback.textContent = "";
    } catch (err) {
      console.error(err);
      countryFeedback.textContent = " Failed to load flag.";
      safeSetImage(flagImg, FALLBACK);
    }
  }

  function checkCountryGuess() {
    const guess = (countryInput.value || "").trim().toLowerCase();
    if (!currentCountry) return;
    if (guess === currentCountry.name.toLowerCase()) {
      countryFeedback.textContent = ` Correct — ${currentCountry.name}. +20 coins`;
      updateCoins(20);
    } else {
      countryFeedback.textContent = ` Wrong — it was ${currentCountry.name}. -10 coins`;
      updateCoins(-10);
    }
    countryInput.value = "";
    loadCountry();
  }

  // ---------- WIKIPEDIA THUMBNAIL ----------
  async function fetchWikiImage(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=500&titles=${encodeURIComponent(
      title
    )}&origin=*`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const pages = Object.values(data.query.pages);
      return pages[0]?.thumbnail?.source || null;
    } catch {
      return null;
    }
  }

  // ---------- CELEBRITY GAME ----------
  const celebrities = [
    "Tom Cruise", "Emma Watson", "Leonardo DiCaprio", "Taylor Swift",
    "Robert Downey Jr.", "Zendaya", "Chris Hemsworth", "Scarlett Johansson"
  ];
  let currentCeleb = null;

  async function loadCelebrity() {
    celebFeedback.textContent = "Loading celebrity...";
    const name = celebrities[Math.floor(Math.random() * celebrities.length)];
    currentCeleb = { name };
    const img = await fetchWikiImage(name);
    safeSetImage(celebImg, img || `https://picsum.photos/seed/${encodeURIComponent(name)}/600/400`);
    celebFeedback.textContent = "";
  }

  function checkCelebrityGuess() {
    const g = (celebInput.value || "").trim().toLowerCase();
    if (!currentCeleb) return;
    if (g === currentCeleb.name.toLowerCase()) {
      celebFeedback.textContent = `Correct — ${currentCeleb.name}. +20 coins`;
      updateCoins(20);
    } else {
      celebFeedback.textContent = ` Wrong — it was ${currentCeleb.name}. -10 coins`;
      updateCoins(-10);
    }
    celebInput.value = "";
    loadCelebrity();
  }

  // ---------- CAR GAME ----------
  const cars = [
    "Ferrari 488", "Lamborghini Huracán", "Porsche 911", "Tesla Model S",
    "BMW M3", "Audi A6", "Bugatti Chiron", "Mercedes-Benz S-Class"
  ];
  let currentCar = null;

  async function loadCar() {
    carFeedback.textContent = "Loading car...";
    const name = cars[Math.floor(Math.random() * cars.length)];
    currentCar = { name };
    const img = await fetchWikiImage(name);
    safeSetImage(carImg, img || `https://picsum.photos/seed/${encodeURIComponent(name)}/600/400`);
    carFeedback.textContent = "";
  }

  function checkCarGuess() {
    const g = (carInput.value || "").trim().toLowerCase();
    if (!currentCar) return;
    if (currentCar.name.toLowerCase().includes(g) && g.length > 0) {
      carFeedback.textContent = ` Correct — ${currentCar.name}. +20 coins`;
      updateCoins(20);
    } else {
      carFeedback.textContent = ` Wrong — it was ${currentCar.name}. -10 coins`;
      updateCoins(-10);
    }
    carInput.value = "";
    loadCar();
  }

  // ---------- BUTTON HANDLERS ----------
  btnCountry.onclick = () => { if (coins > 0) { showGame("country"); loadCountry(); } };
  btnCelebrity.onclick = () => { if (coins > 0) { showGame("celebrity"); loadCelebrity(); } };
  btnCar.onclick = () => { if (coins > 0) { showGame("car"); loadCar(); } };

  submitCountry.onclick = () => { if (coins > 0) checkCountryGuess(); checkGameOver(); };
  submitCeleb.onclick = () => { if (coins > 0) checkCelebrityGuess(); checkGameOver(); };
  submitCar.onclick = () => { if (coins > 0) checkCarGuess(); checkGameOver(); };

  [countryInput, celebInput, carInput].forEach(inp => {
    inp.addEventListener("keydown", e => {
      if (e.key === "Enter" && coins > 0) {
        if (inp === countryInput) checkCountryGuess();
        if (inp === celebInput) checkCelebrityGuess();
        if (inp === carInput) checkCarGuess();
        checkGameOver();
      }
    });
  });

  // ---------- GAME OVER HANDLING ----------
  function checkGameOver() {
    if (coins <= 0) {
      coinsEl.textContent = 0;
      alert("You're out of coins! Game Over.");
      disableInputs(true);
      showRestartButton();
    }
  }

  function disableInputs(disabled) {
    document.querySelectorAll("input, button").forEach(el => {
      if (!el.id.includes("btn-")) el.disabled = disabled;
    });
  }

  function showRestartButton() {
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart Game";
    restartBtn.style.marginTop = "20px";
    restartBtn.onclick = restartGame;
    document.body.appendChild(restartBtn);
  }

  function restartGame() {
    coins = 100;
    coinsEl.textContent = coins;
    document.querySelectorAll("input, button").forEach(el => (el.disabled = false));
    document.querySelector("button:last-of-type").remove(); // remove restart button
    showGame("country");
    loadCountry();
  }

  // ---------- INIT ----------
  showGame("country");
})();
