
var React = require('react'); 
var CommentBox = require('./components/CommentApp.react');
var CommentActions = require('./actions/CommentActions');

CommentActions.load();

React.render(
	<CommentBox url="comments.json" pollInterval={2000} />,
	document.getElementById('content')
);