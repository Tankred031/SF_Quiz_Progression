/* =========================================
   SF QUIZ — COMPLETION SYSTEM
========================================= */


/* =========================================
   01. LEVEL 3 COMPLETION
========================================= */

const LEVEL_3_COMPLETION = {
    image:
        "assets/images/copyright-risk/YouActualyDidIT.png",

    alt:
        "Čestitamo, završili ste glavne levele SF kviza",

    title:
        "Hej, stvarno si uspio.",

    text:
        "Otključali ste pristup posljednjem izazovu."
};


/* =========================================
   02. SECRET LEVEL COMPLETION VARIANTS
========================================= */

/*
   Secret Level koristi jednu nasumično odabranu
   završnu sliku, a svaka ima svoj tekst.
*/

const SECRET_COMPLETION_VARIANTS = [
    {
    image:
        "assets/images/copyright-risk/IDontBelieveInNoWinScenario.png",

    alt:
        "Čestitamo, završili ste Secret Level",

    title:
        "Ne vjerujem u scenarij u kojem je nemoguće pobijediti.",

    text:
        "Secret Level osvojen"
},

    {
    image:
        "assets/images/copyright-risk/YouMadeIt-Figures.png",

    alt:
        "Konačna nagrada SF Quiz Progressiona",

    title:
        "Uspio si? — Naravno!",

    text:
        "Final reward osvojen"
}
];


/* =========================================
   03. COMPLETION CHECKS
========================================= */

function isRegularLevelCompleted(level) {
    return QUIZ_GROUPS.every(groupData => {
        return QUIZ_DIFFICULTIES.every(
            difficultyConfig => {
                const key = [
                    "sfq",
                    `level-${level}`,
                    difficultyConfig.id,
                    groupData.id,
                    "completed"
                ].join("-");

                return (
                    localStorage.getItem(key) ===
                    "true"
                );
            }
        );
    });
}

function isSecretLevelCompleted() {
    return (
        isSecretCompleted("multipleChoice") &&
        isSecretCompleted("yesNo")
    );
}


/* =========================================
   04. RANDOM SECRET VARIANT
========================================= */

/*
   Jednom odabrana Secret završna varijanta
   sprema se u localStorage, da se ne mijenja
   pri svakom renderiranju iste stranice.
*/

function getSecretCompletionVariant() {
    const storageKey =
        "sfq-secret-completion-variant";

    const savedIndex =
        Number(
            localStorage.getItem(storageKey)
        );

    if (
        Number.isInteger(savedIndex) &&
        savedIndex >= 0 &&
        savedIndex <
            SECRET_COMPLETION_VARIANTS.length
    ) {
        return SECRET_COMPLETION_VARIANTS[
            savedIndex
        ];
    }

    const randomIndex =
        Math.floor(
            Math.random() *
            SECRET_COMPLETION_VARIANTS.length
        );

    localStorage.setItem(
        storageKey,
        randomIndex.toString()
    );

    return SECRET_COMPLETION_VARIANTS[
        randomIndex
    ];
}


/* =========================================
   05. COMPLETION CARD RENDER
========================================= */

function renderCompletionCard({
    image,
    alt,
    title,
    text
}) {
    return `
        <article class="completion-card">

            <div class="completion-image-card">
                <img
                    src="${image}"
                    alt="${alt}"
                    class="
                        completion-image
                        zoomable-image
                    "

                    onerror="
                        console.error(
                            '[SF Quiz] Completion slika nije pronađena:',
                            this.src
                        );
                    "
                >
            </div>

            <div class="completion-card-text">
                <h3>
                    ${title}
                </h3>

                <p>
                    ${text}
                </p>
            </div>

        </article>
    `;
}


/* =========================================
   06. LEVEL 3 COMPLETION RENDER
========================================= */

function renderLevel3Completion() {
    if (
        activeLevel !== 3 ||
        !isRegularLevelCompleted(3)
    ) {
        return "";
    }

    return `
        <section
            class="
                completion-section
                level-3-completion
            "
        >
            <div class="completion-heading">

                <div class="completion-kicker">
                    MISIJA IZVRŠENA
                </div>

                <h2>
                    Čestitamo!
                </h2>

                <p>
                    Završili ste sva tri glavna levela
                    SF Quiz Progressiona.
                </p>

            </div>

            <div
                class="
                    completion-grid
                    completion-grid-single
                "
            >
                ${renderCompletionCard(
                    LEVEL_3_COMPLETION
                )}
            </div>

        </section>
    `;
}


/* =========================================
   07. SECRET LEVEL COMPLETION RENDER
========================================= */

function renderSecretCompletion() {
    if (
        activeLevel !== 4 ||
        !isSecretLevelCompleted()
    ) {
        return "";
    }

    const selectedVariant =
        getSecretCompletionVariant();

    return `
        <section
            class="
                completion-section
                secret-completion
            "
        >
            <div class="completion-heading">

                <div class="completion-kicker">
                    ARHIVA OSVOJENA
                </div>

                <h2>
                    Hardcore Archive završen!
                </h2>

                <p>
                    Završili ste i posljednji tajni izazov
                    SF Quiz Progressiona.
                </p>

            </div>

            <div
                class="
                    completion-grid
                    completion-grid-single
                "
            >
                ${renderCompletionCard(
                    selectedVariant
                )}
            </div>

        </section>
    `;
}