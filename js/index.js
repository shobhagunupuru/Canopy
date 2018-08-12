const getId = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
var Spades = [];
var Clubs = [];
var Hearts = [];
var Diamonds = [];

let ranks = new Map([
  ["ACE", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["10", 10],
  ["JACK", 11],
  ["QUEEN", 12],
  ["KING", 13]
]);
// create a card
function createCard(value) {
  var card = {};
  card.value = value;
  card.rank = ranks.get(value);
  return card;
}
//compare the ranks
function compare(a, b) {
  if (a.rank < b.rank) {
    return -1;
  }
  if (a.rank > b.rank) {
    return 1;
  }
  return 0;
}
//success and response json in a single function to make use in multiple calls
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}
function json(response) {
  return response.json();
}
//function to get the Deck ID
function getDeckId() {
  return fetch(getId)
    .then(status)
    .then(json)
    .then(jsonData => {
      return jsonData.deck_id;
    })
    .catch(() => {
      console.log("error");
    });
}
//Draw two cards and push them in the respective arrays of suits
function drawTwo(endPoint) {
  fetch(endPoint)
    .then(status)
    .then(json)
    .then(deckdata => {
      for (let i in deckdata.cards) {
        if (deckdata.cards[i].suit === "HEARTS") {
          Hearts.push(createCard(deckdata.cards[i].value));
        }
        if (deckdata.cards[i].suit === "SPADES") {
          Spades.push(createCard(deckdata.cards[i].value));
        }
        if (deckdata.cards[i].suit === "CLUBS") {
          Clubs.push(createCard(deckdata.cards[i].value));
        }
        if (deckdata.cards[i].suit === "DIAMONDS") {
          Diamonds.push(createCard(deckdata.cards[i].value));
        }
      }

      if (
        deckdata.cards[0].value !== "QUEEN" &&
        deckdata.cards[1].value !== "QUEEN"
      ) {
        drawTwo(endPoint);
      } else {
        console.log("********** QUEEN");
        if (
          Clubs.map(x => x.value).indexOf("QUEEN") !== -1 &&
          Spades.map(x => x.value).indexOf("QUEEN") !== -1 &&
          Hearts.map(x => x.value).indexOf("QUEEN") !== -1 &&
          Diamonds.map(x => x.value).indexOf("QUEEN") !== -1
        ) {
          document.getElementById("spades").innerHTML = Spades.sort(
            compare
          ).map(x => x.value);
          document.getElementById("clubs").innerHTML = Clubs.sort(compare).map(
            x => x.value
          );
          document.getElementById("hearts").innerHTML = Hearts.sort(
            compare
          ).map(x => x.value);
          document.getElementById("diamonds").innerHTML = Diamonds.sort(
            compare
          ).map(x => x.value);
        }
      }
    })
    .catch(() => {
      console.log("error");
    });
}

//function to call the second URL to Untill all the queens are picked
function start() {
  getDeckId().then(function (deckId) {
    const getTwoCards = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
    for (let count = 1; count <= 4; count++) {
      drawTwo(getTwoCards);
    }
  });
}

start();