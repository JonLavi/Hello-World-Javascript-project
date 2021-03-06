const PubSub = require('../helpers/pub_sub.js');

const Game = function() {
  this.countries_data = [];
  this.numberOfRounds = 10;
  this.score = 0;
  this.questionAnswered = false;
  this.currentQuestion = {};
};

Game.prototype.bindEvents = function() {
  PubSub.subscribe('Countries:game-data', (evt) => {

    // receive country data and make question pool
    this.countries_data = evt.detail;
    const questionPool = this.prepareGame(this.countries_data, this.numberOfRounds);

    // make first question
    this.currentQuestion = this.makeNewQuestion(questionPool);
    PubSub.publish('Game:question-data-ready', this.currentQuestion);

    PubSub.subscribe('InputView:answer-submitted', (evt) => {
      if (!this.questionAnswered) {
        result = this.evaluateAnswer(this.currentQuestion, evt.detail);
        PubSub.publish('Game:result-ready', result);

        this.score = this.givePoints(result, this.score);
        PubSub.publish('Game:score-given', this.score);
        this.questionAnswered = true;

      } else {
        console.log('You have already answered this question!') // TODO: improve this to show a prompt to user
      }

    });

    PubSub.subscribe('NextQuestionView:button-pressed', (evt) => {
      if (questionPool.length === 0) {
        PubSub.publish('Game:game-over', this.score);
      } else {
        this.currentQuestion = this.makeNewQuestion(questionPool);
        PubSub.publish('Game:question-data-ready', this.currentQuestion);
      };
    });

  });
};


Game.prototype.makeNewQuestion = function(questionPool) {
  this.questionAnswered = false;
  let currentQuestion = {};

  currentQuestion = questionPool[0];
  questionPool.shift();

  return currentQuestion;
};


/////// Check answer workflow ///////

Game.prototype.evaluateAnswer = function(question, answer) {
  if (question.name.toLowerCase() === answer.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};

Game.prototype.givePoints = function(result, score) {
  if (result) {
    return score += 1;
  } else {
    return score;
  };
};


/////// Prepare game workflow ///////

Game.prototype.prepareGame = function(arrayOfCountries, numberOfRounds) {
  const shuffledCountries = this.shuffleCountries(arrayOfCountries);
  return shuffledCountries.slice(0, numberOfRounds);
};

Game.prototype.shuffleCountries = function(inputArray) {
  let currentIndex = inputArray.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);

    temporaryValue = inputArray[currentIndex];
    inputArray[currentIndex] = inputArray[randomIndex];
    inputArray[randomIndex] = temporaryValue;

    currentIndex -= 1;
  }

  return inputArray;
}

module.exports = Game;
