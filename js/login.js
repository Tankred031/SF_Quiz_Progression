/* =========================================
AUTH
========================================= */

const adminPassword = "admin";
const userPassword = "quiz";

/* =========================================
ROLE HELPERS
========================================= */

function getRole() {
    return localStorage.getItem("role");
}

function isTrainer() {
    return getRole() === "trainer";
}

function isUser() {
    return getRole() === "user";
}

/* =========================================
LOGIN UI
========================================= */

function showLogin() {
    document.body.classList.add("logged-out");

    const loginView = document.getElementById("loginView");
    const appView = document.getElementById("appView");
    const hero = document.getElementById("hero");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginView) {
        loginView.style.display = "flex";
    }

    if (appView) {
        appView.style.display = "none";
    }

    if (hero) {
        hero.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.style.display = "none";
    }
}

function showApp() {
    document.body.classList.remove("logged-out");

    const loginView = document.getElementById("loginView");
    const appView = document.getElementById("appView");
    const hero = document.getElementById("hero");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginView) {
        loginView.style.display = "none";
    }

    if (appView) {
        appView.style.display = "block";
    }

    if (hero) {
        hero.style.display = "block";
    }

    if (logoutBtn) {
        logoutBtn.style.display = "block";
    }

    applyRoleUI();
}

/* =========================================
LOGIN
========================================= */

function login() {
    const input = document.getElementById("password");

    if (!input) {
        return;
    }

    const pass = input.value.trim();

    let role = null;

    if (pass === adminPassword) {
        role = "trainer";
    } else if (pass === userPassword) {
        role = "user";
    } else {
        alert("Kriva lozinka");
        return;
    }

    localStorage.setItem("role", role);

    input.value = "";

    showApp();
    renderApp();
}

// ===============================
// RANDOM LOGIN PORUKA
// ===============================
// Na login ekranu postoje 3 <p> poruke unutar #loginSubtitle.
// Ova funkcija svaki put kad se stranica učita:
// 1. pronađe sve poruke
// 2. sakrije ih sve
// 3. nasumično odabere jednu
// 4. prikaže samo tu jednu poruku
// ===============================

function prikaziRandomLoginPoruku() {
    const loginSubtitle = document.getElementById("loginSubtitle");

    // Ako element ne postoji na stranici, prekini funkciju
    // Ovo sprječava grešku u konzoli ako se funkcija pozove na stranici bez loginSubtitle elementa
    if (!loginSubtitle) return;

    // Uzimamo sve <p> elemente unutar loginSubtitle diva
    const poruke = loginSubtitle.querySelectorAll("p");

    // Sakrij sve poruke
    poruke.forEach(function(poruka) {
        poruka.style.display = "none";
    });

    // Izračunaj random broj od 0 do broja poruka - 1
    const randomIndex = Math.floor(Math.random() * poruke.length);

    // Prikaži samo jednu nasumično odabranu poruku
    poruke[randomIndex].style.display = "block";
}

// Pokreni funkciju odmah kad se login.js učita
prikaziRandomLoginPoruku();

/* =========================================
LOGOUT
========================================= */

function logout() {
    localStorage.removeItem("role");
    showLogin();
}

/* =========================================
INIT
========================================= */

window.addEventListener("load", () => {
    const role = getRole();

    if (role) {
        showApp();
        renderApp();
    } else {
        showLogin();
    }

    const input = document.getElementById("password");

    if (!input) {
        return;
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            login();
        }
    });
});