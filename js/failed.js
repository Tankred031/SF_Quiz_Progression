/* =========================================
   SF QUIZ PROGRESSION — SECRET FAILED

   HARDCORE PRAVILO:
   - jedan pogrešan odgovor
   - cijeli Secret Level završava neuspjehom
   - stanje se sprema u localStorage
   - nema ponavljanja za običnog korisnika
========================================= */

/* =========================================
   CONFIG
========================================= */

const SECRET_FAILED_KEY =
    "sfq-secret-level-failed";

const SECRET_FAILED_IMAGE_KEY =
    "sfq-secret-failed-image";

const SECRET_FAILED_IMAGES = [
    "assets/images/copyright-risk/ThereCanBeOnly1.png",
    "assets/images/copyright-risk/YouKnowNothing.png",
    "assets/images/copyright-risk/CaseClosed.png"
];

/* =========================================
   FAILED STATE
========================================= */

function isSecretFailed() {
    return (
        localStorage.getItem(
            SECRET_FAILED_KEY
        ) === "true"
    );
}

function setSecretFailed() {
    localStorage.setItem(
        SECRET_FAILED_KEY,
        "true"
    );
}

/*
   Ovu funkciju možemo kasnije spojiti
   na admin gumb za reset Secret pokušaja.

   Običan korisnik ne dobiva taj gumb.
*/

function resetSecretFailed(
    shouldRender = true
) {
    localStorage.removeItem(
        SECRET_FAILED_KEY
    );

    localStorage.removeItem(
        SECRET_FAILED_IMAGE_KEY
    );

    localStorage.removeItem(
        "sfq-level-4-multipleChoice-score"
    );

    localStorage.removeItem(
        "sfq-level-4-multipleChoice-completed"
    );

    localStorage.removeItem(
        "sfq-level-4-yesNo-score"
    );

    localStorage.removeItem(
        "sfq-level-4-yesNo-completed"
    );

    if (
        shouldRender &&
        typeof renderApp === "function"
    ) {
        renderApp();
    }
}

/* =========================================
   FAILED RENDER
========================================= */

function renderSecretFailed() {
    if (!isSecretFailed()) {
        return "";
    }

    return `
        <section
            class="
                secret-failed-screen
                year-4
            "
        >

            <div class="secret-failed-content">

                <p class="secret-failed-kicker">
                    ACCESS TERMINATED
                </p>

                <h2 class="secret-failed-title">
                    SECRET ARCHIVE FAILED
                </h2>

                <p class="secret-failed-text">
                    Pogrešan odgovor zabilježen.
                </p>

                <p class="secret-failed-warning">
                    Hardcore Archive dopušta
                    samo jedan pokušaj.
                </p>

                <img
                    src="${SECRET_FAILED_IMAGE}"
                    alt="Secret Level nije uspješno završen"
                    class="
                        secret-failed-image
                        zoomable-image
                    "
                >

                <div class="secret-failed-lock">
                    🔒 PRISTUP ARHIVI TRAJNO ZAKLJUČAN
                </div>

            </div>

        </section>
    `;
}