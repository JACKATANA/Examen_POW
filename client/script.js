const wordE1 = document.getElementById("word");
const wrongLettersE1 = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
let gameOver = false;
const figureParts = document.querySelectorAll(".figure-part");
const correctLetters = [];
const wrongLetters = [];

let words;

let selectedWord;

function obtenerPalabra() {
  fetch("https://pow-3bae6d63ret5.deno.dev/word")
    .then((response) => response.json())
    .then((data) => {
      words = data.word;
      selectedWord = words;
      displayWord();
    })
    .catch((error) => console.error("Error:", error));
}

obtenerPalabra();

//Mostrar letra oculta
function displayWord() {
  wordE1.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ""}
        </span>
        `
      )
      .join("")}
    `;
  const innerWord = wordE1.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Felicitaciones! Has ganado!";
    popup.style.display = "flex";
  }
}

// Actualizar letras erroneas
function updateWrongLetterE1() {
  //Display
  wrongLettersE1.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Error</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;

  //Display
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  //Verificar si perdio
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Perdiste.";
    popup.style.display = "flex";
    gameOver = true;
  }
}

//Mostrar notificacion
function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

//Lectura de teclado
window.addEventListener("keydown", (e) => {
  if (!gameOver && e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLetterE1();
      } else {
        showNotification();
      }
    }
  }
});

//Empezar de nuevo
playAgainBtn.addEventListener("click", () => {
  //Vaciar arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);
  obtenerPalabra();
  updateWrongLetterE1();
  gameOver = false;
  popup.style.display = "none";
});
