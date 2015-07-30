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

// TODO: change this to an object
var _comments = [];

var _deleted_comments = {};

function loadSuccess(comments) {
  _comments = comments;
}

/**
 * Create a Comment.
 * @param  {string} author The author of the comment
 * @param  {string} text The comment text
 */
function create(temp_id, author, text) {
  _comments.push({
    id: temp_id,
    author: author,
    text: text
  });
}

function updateTempID(temp_id, id) {
  _comments.map(function (comment) {
    if (comment.id == temp_id) {
      comment.id = id;
    }
  });
}

/**
 * Delete a Comment.
 * @param  {string} id
 */
function destroy(id) {
  _comments = _comments.filter(function (comment) {
    var ret = comment.id != id;
    if (!ret) {
      _deleted_comments[id] = comment;
    }
    return ret;
  });
}

// __deleted_comments
function expunge(id) {
  delete _deleted_comments[id];
}

function restore(id) {
  _comments.push(_deleted_comments[id]);
  expunge(id);
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
  switch (action.actionType) {

    case CommentConstants.COMMENT_INIT_LOAD_SUCCESS:
      loadSuccess(action.comments);
      CommentStore.emitChange();
      break;

    case CommentConstants.COMMENT_CREATE:
        create(action.id, action.author.trim(), action.text.trim());
        CommentStore.emitChange();
      break;

    case CommentConstants.COMMENT_CREATE_SUCCESS:
      updateTempID(action.temp_id, action.id);
      CommentStore.emitChange();
      break;

    case CommentConstants.COMMENT_CREATE_FAILED:
      destroy(action.temp_id);
      CommentStore.emitChange();
      break;

    case CommentConstants.COMMENT_DESTROY:
      destroy(action.id);
      CommentStore.emitChange();
      break;

    case CommentConstants.COMMENT_DESTROY_SUCCESS:
      expunge(action.id);
      break;

    case CommentConstants.COMMENT_DESTROY_FAILED:
      restore(action.id);
      CommentStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CommentStore;