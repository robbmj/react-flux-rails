/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CommentConstants = require('../constants/CommentConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _comments = [];

/**
 * Create a Comment.
 * @param  {string} author The author of the comment
 * @param  {string} text The comment text
 */
function create(author, text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _comments.push({
    id: id,
    author: author,
    text: text
  });
}

/**
 * Delete a COmment.
 * @param  {string} id
 */
function destroy(id) {
  _comments = _comments.filter(function (comment) {
    return comment.id != id;
  });
}

var CommentStore = assign({}, EventEmitter.prototype, {

  getAll: function() {
    return _comments;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text, author;

  switch (action.actionType) {
    case CommentConstants.COMMENT_CREATE:

      text = action.text.trim();
      author = action.author.trim();
      if (text !== '') {
        create(author, text);
        CommentStore.emitChange();
      }
      break;

    case CommentConstants.COMMENT_DESTROY:
      destroy(action.id);
      CommentStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CommentStore;