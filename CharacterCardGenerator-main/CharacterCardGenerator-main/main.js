document.addEventListener("DOMContentLoaded", () => {
  // === ESTADO Y CONSTANTES ===
  const THEMES = [1, 2, 3, 4, 5, 6, 7, 8];
  const elements = {
    body: document.body,
    // ... (seleccionar todos los inputs y displays)
    nameInput: document.getElementById("char-name"),
    moteInput: document.getElementById("char-mote"),
    raceInput: document.getElementById("char-race"),
    genderInput: document.getElementById("char-gender"),
    descInput: document.getElementById("char-desc"),
    likesInput: document.getElementById("char-likes"),
    dislikesInput: document.getElementById("char-dislikes"),

    displayName: document.getElementById("display-name"),
    displayMote: document.getElementById("display-mote"),
    displayImage: document.getElementById("display-image"),
    displayRace: document.getElementById("display-race"),
    displayGender: document.getElementById("display-gender"),
    displayDesc: document.getElementById("display-desc"),
    displayLikes: document.getElementById("display-likes"),
    displayDislikes: document.getElementById("display-dislikes"),

    themeSelector: document.getElementById("theme-selector"),
    imageInput: document.getElementById("image-input"),
    uploadImageBtn: document.getElementById("upload-image-btn"),
    saveDataBtn: document.getElementById("save-data-btn"),
    downloadBtn: document.getElementById("download-btn"),
    cardContainer: document.getElementById("card-container"),

    menuToggle: document.getElementById("menu-toggle"),
    sidebar: document.getElementById("sidebar"),
  };

  let characterData = {};

  // === FUNCIONES ===
  function renderCard() {
    elements.displayName.textContent =
      characterData.name || "Nombre del Personaje";
    elements.displayMote.textContent = characterData.mote || "Su mote va aquí";
    elements.displayRace.textContent = characterData.race || "...";
    elements.displayGender.textContent = characterData.gender || "...";
    elements.displayDesc.textContent = characterData.desc || "...";
    elements.displayLikes.textContent = characterData.likes || "...";
    elements.displayDislikes.textContent = characterData.dislikes || "...";
    elements.displayImage.src =
      characterData.image || "https://via.placeholder.com/300x450";
  }

  function updateDataFromInput(e) {
    const key = e.target.id.split("-")[1]; // ej: "char-name" -> "name"
    characterData[key] = e.target.value;
    renderCard();
  }

  function saveData() {
    localStorage.setItem("characterCardData", JSON.stringify(characterData));
    alert("¡Datos guardados en el navegador!");
  }

  function loadData() {
    const savedData = JSON.parse(localStorage.getItem("characterCardData"));
    const savedTheme = localStorage.getItem("characterCardTheme") || "theme-1";

    if (savedData) {
      characterData = savedData;
      // Poblar inputs
      for (const key in characterData) {
        const input = document.getElementById(`char-${key}`);
        if (input) input.value = characterData[key];
      }
    }
    applyTheme(savedTheme);
    renderCard();
  }

  function applyTheme(themeClass) {
    elements.body.className = themeClass;
    localStorage.setItem("characterCardTheme", themeClass);
  }

  function downloadCardAsImage() {
    html2canvas(elements.cardContainer, {
      backgroundColor: getComputedStyle(elements.cardContainer).backgroundColor,
      useCORS: true, // Para imágenes externas si las hubiera
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${characterData.name || "character"}_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  // === INICIALIZACIÓN Y EVENT LISTENERS ===

  // Poblar selector de temas
  THEMES.forEach((themeNum) => {
    const themeBtn = document.createElement("button");
    themeBtn.className = `w-8 h-8 rounded-full border-2 theme-${themeNum}`;
    themeBtn.style.backgroundColor = `var(--primary-color)`;
    themeBtn.onclick = () => applyTheme(`theme-${themeNum}`);
    elements.themeSelector.appendChild(themeBtn);
  });

  // Listeners para los inputs de texto
  const inputs = [
    elements.nameInput,
    elements.moteInput,
    elements.raceInput,
    elements.genderInput,
    elements.descInput,
    elements.likesInput,
    elements.dislikesInput,
  ];
  inputs.forEach((input) =>
    input.addEventListener("input", updateDataFromInput)
  );

  // Listener para subida de imagen
  elements.uploadImageBtn.addEventListener("click", () =>
    elements.imageInput.click()
  );
  elements.imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        characterData.image = event.target.result;
        renderCard();
      };
      reader.readAsDataURL(file);
    }
  });

  // Listeners para botones de acción
  elements.saveDataBtn.addEventListener("click", saveData);
  elements.downloadBtn.addEventListener("click", downloadCardAsImage);
  elements.menuToggle.addEventListener("click", () =>
    elements.sidebar.classList.toggle("open")
  );

  // Carga inicial
  loadData();
});
