const UIController = (function () {

    const EMPTY_ICON = 'beach_access';

    const UISelectors = {
        startPanel: document.querySelector('.start-game-panel'),
        btnStart: document.getElementById('start'),
        btnShuffle: document.getElementById('shuffle'),
        cards: document.querySelectorAll('.card-item'),
        icons: document.querySelectorAll('i.icon-item'),
        scores: document.querySelector('.scores-value'),
        turns: document.querySelector('.turns-value'),
    };

    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    return {
        disableGuessedCards: function (selectedCards) {
            selectedCards.forEach(card => {
                const element = document.getElementById(`card-${card.id}`);
                element.setAttribute('data-state', 'disabled');
                const divCard = element.querySelector('div.card');
                divCard.classList.remove('teal');
                divCard.classList.add('grey');
                divCard.classList.add('darken-3');
            });
        },

        isGameCompleted: function () {
            const count = document.querySelectorAll('div[data-state="enabled"]').length;
            return count !== 0;
        },
        getSelectors: function () {
            return UISelectors;
        },
        setScores: function (value) {
            UISelectors.scores.textContent = value;
        },
        setTurns: function (value) {
            UISelectors.turns.textContent = value;
        },
        setStateToWin: function () {
            CardController.setGame(false);
            UISelectors.btnStart.textContent = 'PLAY AGAIN?';
            UISelectors.startPanel.style.display = 'block';
        },
        setStateToGame: function () {
            CardController.setGame(true);
            UISelectors.startPanel.style.display = 'none';
        },
        hideStartButton: function () {
            UISelectors.startPanel.style.display = 'none';
        },
        setCardIcon: function (id, icon) {
            let card = UISelectors.cards[id].querySelector('i.icon-item');
            card.setAttribute('data-content', icon);
            card.textContent = icon;
        },

        clearCardIcon: function (id) {
            let card = UISelectors.cards[id].querySelector('i.icon-item');
            card.setAttribute('data-content', EMPTY_ICON);
            card.textContent = EMPTY_ICON;
        },
        hideCard: function (id) {
            let card = UISelectors.cards[id].querySelector('i.icon-item');
            card.style.display = 'none';
        },
        hideAllCards: function () {
            UISelectors.icons.forEach(el => {
                el.style.display = 'none';
            })
        },
        showAllCards: function () {
            UISelectors.icons.forEach(el => {
                el.style.display = 'inline';
            })
        },
        showCard: function (id) {
            let card = UISelectors.cards[id].querySelector('i.icon-item');
            card.style.display = 'inline';
        },
        getIcon: function (id) {
            let card = UISelectors.cards[id].querySelector('i.icon-item');
            return card.getAttribute('data-content');
        },
        getCardsCount: function () {
            return UISelectors.cards.length;
        },
        getAnyEmptyCardIndex: function () {
            const emptyCards = document.querySelectorAll(`i.icon-item[data-content="${EMPTY_ICON}"]`);
            if (emptyCards.length === 0)
                return -1;
            const id = emptyCards[random(0, emptyCards.length)].parentElement.parentElement.parentElement.id;
            return id.split('-')[1];
        },
        resetAndEnableAllCards: function () {
            document.querySelectorAll('.card-item').forEach(card => {
                // reset data-state
                card.setAttribute("data-state", "enabled");
                // reset color
                const divCard = card.querySelector('div.card');
                divCard.classList.remove('grey');
                divCard.classList.remove('darken-3');
                divCard.classList.add('teal');

                // reset icon
                const icon = card.querySelector('i.icon-item');
                icon.style.display = 'inline';
                icon.setAttribute('data-content', EMPTY_ICON);
                icon.textContent = EMPTY_ICON;
            });
        }
    }

})();

const CardController = (function () {

    const setOfCards = [
        'access_time', 'account_balance', 'add_alert', 'add_box', 'airport_shuttle', 'attach_money',
        'ac_unit', 'album', 'apps', 'android', 'attach_file', 'battery_full'
    ];

    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const getShuffledCards = () => {
        return shuffle(setOfCards);
    }

    const state = {
        selectedCards: [],
        isWin: false,
        isGame: false,
        isShowingOpenedCards: false,
        scores: 0,
        turns: 0,
    }

    return {
        setWin: function (val) {
            state.isWin = val;
        },
        isWin: function () {
            return state.isWin;
        },
        getScores: function () {
            return state.scores;
        },
        setScores: function (val) {
            return state.scores = val;
        },
        getTurns: function () {
            return state.turns;
        },
        setTurns: function (val) {
            return state.turns = val;
        },
        addScores: function (val) {
            return state.scores += val;
        },
        addTurns: function (val) {
            return state.turns += val;
        },
        setGame: function (isGame) {
            state.isGame = isGame;
        },
        isGame: function () {
            return state.isGame;
        },
        isShowingOpenedCards: function () {
            return state.isShowingOpenedCards;
        },
        setShowingOpenedCards: function (val) {
            state.isShowingOpenedCards = val;
        },
        addSelectedCard: function (value) {
            state.selectedCards.push(value);
        },
        getSelectedCard: function (idx) {
            return state.selectedCards[idx];
        },
        getAllSelectedCards: function () {
            return state.selectedCards;
        },
        isTwoCardsSelected: function () {
            return state.selectedCards.length === 2;
        },
        clearSelectedCards: function () {
            state.selectedCards = [];
        },
        isCardsEqual: function () {
            if (CardController.isTwoCardsSelected()) {
                return state.selectedCards[0].icon === state.selectedCards[1].icon;
            } else
                return false;
        },
        shuffleCards: function () {
            const itemsFromSet = setOfCards.slice(getShuffledCards(), UIController.getCardsCount() / 2);
            for (let i = 0; i < itemsFromSet.length; i++) {
                const currentCardIcon = itemsFromSet[i];
                let idx = UIController.getAnyEmptyCardIndex();
                if (idx !== -1) {
                    UIController.setCardIcon(idx, currentCardIcon);
                    idx = UIController.getAnyEmptyCardIndex();
                    UIController.setCardIcon(idx, currentCardIcon);
                }
            }
        }
    }
})();

const App = (function (UIController, CardController) {
    const uiSelectors = UIController.getSelectors();

    const loadEventListeners = () => {
        uiSelectors.btnStart.addEventListener('click', start);
        // uiSelectors.btnShuffle.addEventListener('click', shuffle);
        document.querySelector('.container').addEventListener('click', cardClick)
    };

    const cardClick = (e) => {
        if (!CardController.isGame()) {
            console.log('Press start to begin');
            return;
        }

        if (CardController.isShowingOpenedCards()) {
            return;
        }

        let selectedCard = null;
        if (e.target.classList.contains('icon-item')) {
            selectedCard = e.target.parentElement.parentElement.parentElement;
        } else if (e.target.classList.contains('icon-item-parent')) {
            selectedCard = e.target.parentElement.parentElement;
        }

        if (selectedCard !== null) {
            const idx = selectedCard.id.split('-')[1];

            if (selectedCard.dataset.state !== 'enabled') {
                return;
            }

            if (!CardController.isTwoCardsSelected()) {
                CardController.addSelectedCard({ id: idx, icon: UIController.getIcon(idx) });
                UIController.showCard(idx);
            }

            if (CardController.isTwoCardsSelected()) {

                if (CardController.isCardsEqual()) {
                    UIController.disableGuessedCards(CardController.getAllSelectedCards());
                    CardController.addScores(100);
                } else {
                    // do nothing
                }
                CardController.addTurns(1);
                UIController.setTurns(CardController.getTurns());
                UIController.setScores(CardController.getScores());
                CardController.setShowingOpenedCards(true);
                setTimeout(() => {

                    CardController.setShowingOpenedCards(false);

                    if (!UIController.isGameCompleted()) {
                        console.log('GAME COMPLETED');
                        CardController.setGame(false);
                        UIController.showAllCards();
                        UIController.setStateToWin();
                        CardController.setWin(true);
                    } else {
                        UIController.hideAllCards();
                        CardController.clearSelectedCards();
                    }


                }, 1000);
            }


        }
    }

    const start = () => {
        // reset scores 
        CardController.setScores(0);
        UIController.setScores(0);
        // reset turns
        CardController.setTurns(0);
        UIController.setTurns(0);

        CardController.clearSelectedCards();
        UIController.resetAndEnableAllCards();
        UIController.hideStartButton();
        CardController.shuffleCards();


        // show all cards for 3 seconds before the game
        setTimeout(() => {
            UIController.hideAllCards();
            UIController.setStateToGame();
        }, 3000);

    }

    return {
        init: function () {
            loadEventListeners();
        }
    }
})(UIController, CardController);

App.init();