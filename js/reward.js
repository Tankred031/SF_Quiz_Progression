/* =========================================
   QUIZ REWARD SYSTEM

   Ovaj file upravlja samo:
   - putanjama pojedinačnih nagrada
   - flip karticama
   - zaključavanjem i otključavanjem
   - vraćanjem spremljenog stanja
   - testnim gumbom

   Završne Level 3 i Secret slike
   nalaze se u completion.js.
========================================= */


/* =========================================
   01. REWARD PATHS / KEYS
========================================= */

function getRewardKey(
    year,
    month,
    week
) {
    return `quiz-reward-${year}-${month}-${week}`;
}

function getRewardImage(
    year,
    month,
    week
) {
    return (
        "assets/images/copyright-risk/" +
        `reward-${year}-${month}-${week}.png`
    );
}


/* =========================================
   02. REWARD CARD RENDER
========================================= */

function renderQuizReward(
    year,
    month,
    week
) {
    const frontImage =
        getRewardImage(
            year,
            month,
            week
        );

    const backImage =
        "assets/images/rewards/back.png";

    const placeholderImage =
        "assets/images/rewards/placeholder.png";

    return `
        <div
            class="quiz-reward-card locked"
            data-reward-year="${year}"
            data-reward-month="${month}"
            data-reward-week="${week}"
            data-has-reward="true"
        >
            <div class="reward-inner">

                <div class="reward-face reward-back">

                    <img
                        src="${backImage}"
                        alt="Zaključana nagrada"
                    >

                </div>

                <div class="reward-face reward-front">

                    <img
                        src="${frontImage}"
                        alt="Otključana nagrada"
                        class="
                            zoomable-image
                            reward-zoom-image
                        "

                        onerror="
                            this.onerror = null;
                            this.src = '${placeholderImage}';

                            const card =
                                this.closest(
                                    '.quiz-reward-card'
                                );

                            if (card) {
                                card.dataset.hasReward =
                                    'false';

                                card.classList.add(
                                    'placeholder-reward'
                                );

                                card.classList.remove(
                                    'unlocked',
                                    'newly-unlocked'
                                );

                                card.classList.add(
                                    'locked'
                                );

                                localStorage.removeItem(
                                    'quiz-reward-' +
                                    card.dataset.rewardYear +
                                    '-' +
                                    card.dataset.rewardMonth +
                                    '-' +
                                    card.dataset.rewardWeek
                                );
                            }
                        "
                    >

                </div>

            </div>
        </div>
    `;
}


/* =========================================
   03. PLACEHOLDER CHECK
========================================= */

function isPlaceholderRewardCard(
    rewardCard
) {
    if (!rewardCard) {
        return true;
    }

    const frontImage =
        rewardCard.querySelector(
            ".reward-front img"
        );

    return (
        rewardCard.dataset.hasReward ===
            "false" ||

        rewardCard.classList.contains(
            "placeholder-reward"
        ) ||

        (
            frontImage &&
            frontImage.src.includes(
                "placeholder.png"
            )
        )
    );
}


/* =========================================
   04. LOCK REWARD CARD
========================================= */

function lockRewardCard(
    rewardCard
) {
    if (!rewardCard) {
        return;
    }

    rewardCard.classList.remove(
        "unlocked",
        "newly-unlocked"
    );

    rewardCard.classList.add(
        "locked"
    );
}


/* =========================================
   05. UNLOCK REWARD CARD
========================================= */

function unlockQuizReward(
    rewardCard
) {
    if (!rewardCard) {
        return;
    }

    if (
        isPlaceholderRewardCard(
            rewardCard
        )
    ) {
        lockRewardCard(
            rewardCard
        );

        return;
    }

    const year =
        rewardCard.dataset.rewardYear;

    const month =
        rewardCard.dataset.rewardMonth;

    const week =
        rewardCard.dataset.rewardWeek;

    rewardCard.classList.remove(
        "locked"
    );

    rewardCard.classList.add(
        "unlocked",
        "newly-unlocked"
    );

    localStorage.setItem(
        getRewardKey(
            year,
            month,
            week
        ),
        "unlocked"
    );

    /*
       Podrška za dodatni progression sustav,
       ako je funkcija definirana.
    */

    if (
        typeof completeQuizProgress ===
        "function"
    ) {
        completeQuizProgress(
            year,
            month,
            week
        );
    }

    /*
       Nakon flip animacije ponovno se
       renderira aplikacija.
    */

    setTimeout(() => {
        rewardCard.classList.remove(
            "newly-unlocked"
        );

        if (
            typeof renderApp ===
            "function"
        ) {
            renderApp();
        }
    }, 1200);
}


/* =========================================
   06. CHECK QUIZ RESULT
========================================= */

function checkQuizReward(
    weekBlock
) {
    if (!weekBlock) {
        return;
    }

    const quizCards =
        weekBlock.querySelectorAll(
            ".quiz-card"
        );

    const rewardCard =
        weekBlock.querySelector(
            ".quiz-reward-card"
        );

    if (
        quizCards.length === 0 ||
        !rewardCard
    ) {
        return;
    }

    if (
        rewardCard.classList.contains(
            "unlocked"
        )
    ) {
        return;
    }

    if (
        isPlaceholderRewardCard(
            rewardCard
        )
    ) {
        lockRewardCard(
            rewardCard
        );

        return;
    }

    const allAnswered =
        [...quizCards].every(card => {
            return Boolean(
                card.querySelector(
                    ".quiz-answer-btn:disabled"
                )
            );
        });

    const allCorrect =
        [...quizCards].every(card => {
            return !card.querySelector(
                ".quiz-answer-btn.answer-wrong"
            );
        });

    if (
        allAnswered &&
        allCorrect
    ) {
        unlockQuizReward(
            rewardCard
        );
    }
}


/* =========================================
   07. RESTORE SAVED REWARD STATES
========================================= */

function restoreQuizRewards() {
    const rewardCards =
        document.querySelectorAll(
            ".quiz-reward-card"
        );

    rewardCards.forEach(card => {
        if (
            isPlaceholderRewardCard(
                card
            )
        ) {
            lockRewardCard(
                card
            );

            return;
        }

        const year =
            card.dataset.rewardYear;

        const month =
            card.dataset.rewardMonth;

        const week =
            card.dataset.rewardWeek;

        const rewardKey =
            getRewardKey(
                year,
                month,
                week
            );

        const isUnlocked =
            localStorage.getItem(
                rewardKey
            ) === "unlocked";

        if (isUnlocked) {
            card.classList.remove(
                "locked"
            );

            card.classList.add(
                "unlocked"
            );
        } else {
            lockRewardCard(
                card
            );
        }
    });
}


/* =========================================
   08. TEST REWARD BUTTON
   Samo za razvoj
========================================= */

function createTestRewardButton() {
    if (
        document.getElementById(
            "testRewardButton"
        )
    ) {
        return;
    }

    const button =
        document.createElement(
            "button"
        );

    button.id =
        "testRewardButton";

    button.type =
        "button";

    button.textContent =
        "TEST: Okreni sve nagrade";

    document.body.appendChild(
        button
    );

    button.addEventListener(
        "click",
        () => {
            const rewardCards =
                document.querySelectorAll(
                    ".quiz-reward-card"
                );

            rewardCards.forEach(card => {
                unlockQuizReward(
                    card
                );
            });
        }
    );
}