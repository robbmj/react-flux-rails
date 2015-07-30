/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoConstants
 */

var keyMirror = require('keymirror');

var CommentConstants = keyMirror({
  COMMENT_CREATE: null,
  COMMENT_CREATE_SUCCESS: null,
  COMMENT_CREATE_FAILED: null,
  COMMENT_DESTROY: null,
  COMMENT_DESTROY_SUCCESS: null,
  COMMENT_DESTROY_FAILED: null,
  COMMENT_INIT_LOAD_SUCCESS: null,
  COMMENT_INIT_LOAD_FAILED: null
});

console.log(CommentConstants);
module.exports = CommentConstants;