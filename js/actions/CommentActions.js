
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CommentConstants = require('../constants/CommentConstants');


var SEVER_ADDR = 'comments.json';
var CREATE = 'comment/create';
var DESTROY = 'comment/destroy';

function createCommentOnServer(comment) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
}

function destroyCommentOnServer(id) {

}

var CommentActions = {

  load: function() {
    jQuery.ajax({
      url: SEVER_ADDR,
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
        
        console.log(SEVER_ADDR, status, err.toString());
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
      url: CREATE,
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
        
        console.log(SEVER_ADDR, status, err.toString());
      }
    });
  },

  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_DESTROY,
      id: id
    });

    jQuery.ajax({
      url: DESTROY,
     // dataType: 'json',
      cache: false,
      type: 'POST',
      data: {id: id},
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
        
        console.log(SEVER_ADDR, status, err.toString());
      }
    });
  }
};

module.exports = CommentActions;