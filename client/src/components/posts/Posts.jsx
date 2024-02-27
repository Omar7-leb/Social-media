import { makeRequest } from "../../axios.js";
import Post from "../post/Post.jsx"
import "./posts.scss";
import {
  useQuery,
} from '@tanstack/react-query';
const Posts = ({userId}) => {

  const { isPending, error, data } = useQuery({
    queryKey: ['posts'],queryFn: () =>
  makeRequest.get("/posts?userId="+userId).then((res)=>{
    return res.data;
  })
});

      console.log(data);


  return (
  <div className="posts">
    {error 
       ? "Something went wrong!" 
       : isPending 
       ? "loading" 
       : data.map((post) => 
      <Post post={post} key={post.id} /> 
      )}
  </div>
  );
};

export default Posts;
