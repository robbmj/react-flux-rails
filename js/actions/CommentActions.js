
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CommentConstants = require('../constants/CommentConstants');


var COMMENT_ADDR = 'comments';

function createCommentOnServer(comment) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
}

function destroyCommentOnServer(id) {

}

var CommentActions = {

  load: function() {
    jQuery.ajax({
      url: COMMENT_ADDR,
      dataType: 'json',
      cache: false,
      success: function(data) {

        AppDispatcher.dispatch({
          actionType: CommentConstants.COMMENT_INIT_LOAD_SUCCESS,
          comments: data
        });

      },
      error: function (xhr, status, err) {

        AppDispatcher.dispatch({
          actionType: CommentConstants.COMMENT_INIT_LOAD_FAILED
        });
        
        console.log(COMMENT_ADDR, status, err.toString());
      }
    });
  },

  /**
   * @param  {string} text
   */
  create: function(author, text) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_CREATE,
      id: id,
      author: author,
      text: text
    });

    jQuery.ajax({
      url: COMMENT_ADDR,
      dataType: 'json',
      cache: false,
      type: 'POST',
      data: {author: author, text: text},
      success: function(data) {

        AppDispatcher.dispatch({
          actionType: CommentConstants.COMMENT_CREATE_SUCCESS,
          temp_id: id,
          id: data.id
        });

      },
      error: function (xhr, status, err) {

        AppDispatcher.dispatch({
          actionType: CommentConstants.COMMENT_CREATE_FAILED,
          id: id
        });
        
        console.log(COMMENT_ADDR, status, err.toString());
      }
    });
  },

  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_DESTROY,
      id: id
    });

    jQuery.ajax({
      url: COMMENT_ADDR + '/' + id,
     // dataType: 'json',
      cache: false,
      type: 'POST',
      data: { _method: 'delete', id: id},
      success: function(data) {

        AppDispatcher.dispatch({
          actionType: CommentConstants.COMMENT_DESTROY_SUCCESS,
          id: id
        });

      },
      error: function (xhr, status, err) {

        AppDispatcher.dispatch({
          actionType: CommentConstants.COMMENT_DESTROY_FAILED,
          id: id
        });
        
        console.log(COMMENT_ADDR, status, err.toString());
      }
    });
  }
};

module.exports = CommentActions;