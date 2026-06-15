/* =========================================
   SF QUIZ PROGRESSION — ADMIN
========================================= */

const SECRET_LEVEL_UNLOCKED_KEY =
    "sfq-secret-level-unlocked";

/* =========================================
   SECRET ACCESS
========================================= */

function isSecretLevelUnlocked() {
    return (
        localStorage.getItem(
            SECRET_LEVEL_UNLOCKED_KEY
        ) === "true"
    );
}

function canOpenSecretLevel() {
    /*
       Admin uvijek može otvoriti Secret.
    */

    if (
        typeof isTrainer === "function" &&
        isTrainer()
    ) {
        return true;
    }

    /*
       User može samo kada je admin
       otključao Secret.
    */

    return isSecretLevelUnlocked();
}

/* =========================================
   SET ACCESS
========================================= */

function setSecretLevelAccess(unlocked) {
    localStorage.setItem(
        SECRET_LEVEL_UNLOCKED_KEY,
        unlocked ? "true" : "false"
    );

    /*
       Novo otključavanje daje potpuno
       novi hardcore pokušaj.
    */

    if (
        unlocked &&
        typeof resetSecretFailed ===
            "function"
    ) {
        resetSecretFailed(false);
    }

    /*
       Ako je Secret zaključan dok je
       obični korisnik na Levelu 4,
       vrati ga na Level 1.
    */

    if (
        !unlocked &&
        typeof isUser === "function" &&
        isUser() &&
        typeof activeLevel !== "undefined" &&
        activeLevel === 4
    ) {
        activeLevel = 1;

        localStorage.setItem(
            "sfq-active-level",
            "1"
        );
    }

    if (
        typeof renderApp === "function"
    ) {
        renderApp();
    }

    if (
        typeof applyRoleUI === "function"
    ) {
        applyRoleUI();
    }
}

/* =========================================
   TOGGLE ACCESS
========================================= */

function toggleSecretLevelAccess() {
    const currentlyUnlocked =
        isSecretLevelUnlocked();

    setSecretLevelAccess(
        !currentlyUnlocked
    );
}

/* =========================================
   ADMIN BUTTON
========================================= */

function renderSecretAdminControl() {
    if (
        typeof isTrainer !== "function" ||
        !isTrainer()
    ) {
        return "";
    }

    const unlocked =
        isSecretLevelUnlocked();

    return `
        <button
            type="button"
            id="secretAdminToggleBtn"
            class="
                secret-admin-toggle
                ${unlocked
                    ? "secret-is-unlocked"
                    : "secret-is-locked"
                }
            "
        >
            ${unlocked
                ? "Zaključaj Secret"
                : "Otključaj Secret"
            }
        </button>
    `;
}

/* =========================================
   ROLE UI
========================================= */

function applyRoleUI() {
    const body =
        document.body;

    if (!body) {
        return;
    }

    body.classList.remove(
        "role-trainer",
        "role-user"
    );

    if (
        typeof isTrainer === "function" &&
        isTrainer()
    ) {
        body.classList.add(
            "role-trainer"
        );

        return;
    }

    if (
        typeof isUser === "function" &&
        isUser()
    ) {
        body.classList.add(
            "role-user"
        );
    }
}