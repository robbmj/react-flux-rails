
var React = require('react'); 
var CommentBox = require('./components/CommentApp.react');

React.render(
	<CommentBox url="comments.json" pollInterval={2000} />,
	document.getElementById('content')
);