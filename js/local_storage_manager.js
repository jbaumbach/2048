window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";
  this.initalStateKey     = "initialState";
  this.moveHistoryKey     = "moveHistory";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};

LocalStorageManager.prototype.saveInitialState = function(initialGameState) {
  this.storage.setItem(this.initalStateKey, JSON.stringify(initialGameState));
  var toSave = JSON.stringify([]);
  this.storage.setItem(this.moveHistoryKey, toSave);
}

LocalStorageManager.prototype.getInitialState = function() {
  return JSON.parse(this.storage.getItem(this.initalStateKey));
}

LocalStorageManager.prototype.saveMove = function(direction) {
  var moves = JSON.parse(this.storage.getItem(this.moveHistoryKey));
  moves.push(direction);
  this.storage.setItem(this.moveHistoryKey, JSON.stringify(moves));
  return moves.length;
}

LocalStorageManager.prototype.getMoves = function() {
  var moves = JSON.parse(this.storage.getItem(this.moveHistoryKey));
  return moves;
}