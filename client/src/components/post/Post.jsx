import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import {
  useQuery,
  useQueryClient,
  useMutation
} from '@tanstack/react-query';
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext.js";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Edit } from "../editPost/editPost.jsx";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isPending, error, data: likes } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then(res => res.data)
  });

  const { isLoading, errorr, data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => makeRequest.get("/comments?postId=" + post.id).then(res => res.data)
  });

  const likeMutation = useMutation({
    mutationFn: liked => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes"]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: postId => {
      if (postId) return makeRequest.delete("/posts/" +postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    }
  });

  const editMutation = useMutation({
    mutationFn: (postData) => {
      return makeRequest.put(`/posts/${postData.id}`, postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    }
  });
  


  const shareMutation = useMutation({
    mutationFn: () => {
      return makeRequest.post("/posts", { postId: post.id , desc: post.desc , img: post.img });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      window.scrollTo({ top: 30, behavior: 'smooth' });
    }
  });

  const handleLike = () => {
    if (likes !== undefined) {
      likeMutation.mutate(likes.includes(currentUser.id));
    }
  };

  const handleShare = () => {
    shareMutation.mutate();
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id)
  }

  const handleEdit = () => {
    editMutation.mutate(post.id)
  }
  return (
    <div className="post" key={post.id}>
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <>
  {post.userId === currentUser.id && (
    <div className="button-container">
      <button className="edit-button" onClick={() => setOpenUpdate(true)}><FaEdit />edit</button>
      <button className="delete-button" onClick={handleDelete}><FaTrash />delete</button>
    </div>
  )}
</>

        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isPending ? "Loading" :
              likes !== undefined && (
                likes.includes(currentUser.id) ? (
                  <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                ) : (
                  <FavoriteBorderOutlinedIcon onClick={handleLike} />
                )
              )}
            {likes !== undefined && (
              <>{likes.length} Likes</>
            )}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comments !== undefined && (
              <>{comments.length} Comments</>
            )}
          </div>
          <div className="item" onClick={handleShare}>
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
      {openUpdate && <Edit setOpenUpdate={setOpenUpdate} post={post} />}

    </div>
  );
};

export default Post;