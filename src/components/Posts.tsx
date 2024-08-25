import React, { useState, useEffect } from 'react';
import { supabase } from '../repositories/supabase';
import Post from '../entities/types/post';

function Posts({ additionalClass=''}) {
  const [posts, setPosts] = useState([]);

  return (
	<div id='posts' className={`${additionalClass}`}>
	  <h2>Posts</h2>
	  <ul>
		{posts.map((post: Post) => (
		  <li key={post.id}>
			<p>{post.author}さん</p>
			<p>{post.content}</p>
			<p>{post.created_at}</p>
		  </li>
		))}
	  </ul>
	</div>
  )
}

export default Posts;