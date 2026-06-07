/* =========================================
   QUIZ REWARD SYSTEM
========================================= */

function getRewardKey(month, week) {
    return `quiz-reward-${month}-${week}`;
}

function unlockQuizReward(rewardCard) {
    if (!rewardCard) {
        return;
    }

    const month = rewardCard.dataset.rewardMonth;
    const week = rewardCard.dataset.rewardWeek;

    rewardCard.classList.remove("locked");
    rewardCard.classList.add("unlocked");
    rewardCard.classList.add("newly-unlocked");

    localStorage.setItem(
        getRewardKey(month, week),
        "unlocked"
    );

    const rewardMessage = rewardCard.querySelector(".reward-message");

    if (rewardMessage) {
        rewardMessage.textContent = "Nagrada otključana!";
    }

    setTimeout(() => {
        rewardCard.classList.remove("newly-unlocked");
    }, 1200);
}

function checkQuizReward(weekBlock) {
    if (!weekBlock) {
        return;
    }

    const quizCards = weekBlock.querySelectorAll(".quiz-card");
    const rewardCard = weekBlock.querySelector(".quiz-reward-card");

    if (!quizCards.length || !rewardCard) {
        return;
    }

    if (rewardCard.classList.contains("unlocked")) {
        return;
    }

    const allAnswered = [...quizCards].every(card => {
        return card.querySelector(".quiz-answer-btn:disabled");
    });

    const allCorrect = [...quizCards].every(card => {
        return !card.querySelector(".quiz-answer-btn.answer-wrong");
    });

    if (allAnswered && allCorrect) {
        unlockQuizReward(rewardCard);
    }
}

function restoreQuizRewards() {
    const rewardCards = document.querySelectorAll(".quiz-reward-card");

    rewardCards.forEach(card => {
        const month = card.dataset.rewardMonth;
        const week = card.dataset.rewardWeek;

        const isUnlocked =
            localStorage.getItem(getRewardKey(month, week)) === "unlocked";

        if (isUnlocked) {
            card.classList.remove("locked");
            card.classList.add("unlocked");

            const rewardMessage = card.querySelector(".reward-message");

            if (rewardMessage) {
                rewardMessage.textContent = "Nagrada otključana!";
            }
        }
    });
}