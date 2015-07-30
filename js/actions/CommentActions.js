
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CommentConstants = require('../constants/CommentConstants');

function createCommentOnServer(comment) {

}

function destroyCommentOnServer(id) {

}

var CommentActions = {

  /**
   * @param  {string} text
   */
  create: function(author, text) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_CREATE,
      author: author,
      text: text
    });
  },

  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_DESTROY,
      id: id
    });
  }
};

module.exports = CommentActions;