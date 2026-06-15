function isRegularLevelCompleted(level) {
    return QUIZ_GROUPS.every(groupData =>
        QUIZ_DIFFICULTIES.every(difficultyConfig => {
            const key = [
                "sfq",
                `level-${level}`,
                difficultyConfig.id,
                groupData.id,
                "completed"
            ].join("-");

            return localStorage.getItem(key) === "true";
        })
    );
}

function isSecretLevelCompleted() {
    return (
        isSecretCompleted("multipleChoice") &&
        isSecretCompleted("yesNo")
    );
}

function renderCompletionImage({
    className,
    kicker,
    title,
    text,
    image,
    alt
}) {
    return `
        <section class="level-completion ${className}">

            <div class="level-completion-content">

                <p class="level-completion-kicker">
                    ${kicker}
                </p>

                <h2>
                    ${title}
                </h2>

                <p>
                    ${text}
                </p>

                <img
                    src="${image}"
                    alt="${alt}"
                    class="
                        level-completion-image
                        zoomable-image
                    "
                >

            </div>

        </section>
    `;
}

function renderLevel3Completion() {
    if (
        activeLevel !== 3 ||
        !isRegularLevelCompleted(3)
    ) {
        return "";
    }

    return renderCompletionImage({
        className: "level-3-completion",
        kicker: "MISIJA IZVRŠENA",
        title: "Čestitamo!",
        text: "Završili ste sva tri glavna levela SF Quiz Progressiona.",
        image: "assets/images/copyright-risk/YouActuallyDidIt.png",
        alt: "Čestitamo, završili ste glavne levele SF kviza"
    });
}

function renderSecretCompletion() {
    if (
        activeLevel !== 4 ||
        !isSecretLevelCompleted()
    ) {
        return "";
    }

    return renderCompletionImage({
        className: "secret-completion",
        kicker: "ARHIVA OSVOJENA",
        title: "Hardcore Archive završen!",
        text: "Završili ste i posljednji tajni izazov SF Quiz Progressiona.",
        image: "assets/images/secret-complete.png",
        alt: "Čestitamo, završili ste Secret Level"
    });
}