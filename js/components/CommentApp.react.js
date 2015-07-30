
var React = require('react');
var CommentStore = require('../stores/CommentStore');
var CommentActions = require('../actions/CommentActions');
/**
 * Retrieve the current TODO data from the TodoStore
 */
 function getCommentState() {
  return {
    data: CommentStore.getAll()
  };
}

var Comment = React.createClass({

  handleDestroy: function(id) {
    CommentActions.destroy(id);
  },

  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment" data-commentid={this.props.commentid}>
        <h2 className="commentAuthor">
          {this.props.author} - {this.props.commentid}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        <button onClick={this.handleDestroy.bind(this, this.props.commentid)} key={this.props.commentid}>
          Delete Comment
        </button>
      </div>
    );
  }
});

var CommentBox = React.createClass({

  getInitialState: function() {
    return {data: []};
  },

  handleCommentSubmit: function(comment) {
    CommentActions.create(comment.author, comment.text);
  },

  componentDidMount: function() {
    CommentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CommentStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>Comment Box</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the CommentStore
   */
  _onChange: function() {
    this.setState(getCommentState());
  }

});

var CommentList = React.createClass({

  render: function() {
    var commentNodes = this.props.data.map(function (comment, i) {
      return (
        <Comment author={comment.author}>
          {comment.text}
          <button onClick={this.handleDestroy.bind(this, i)} key={i}>Delete Comment</button>
        </Comment>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();

    var author = React.findDOMNode(this.refs.author).value.trim(),
        text   = React.findDOMNode(this.refs.text).value.trim();

    if (!author || !text) {
      return;
    }

    this.props.onCommentSubmit({author: author, text: text});

    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your Name" ref="author" />
        <input type="text" placeholder="Say Something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});


module.exports = CommentBox;