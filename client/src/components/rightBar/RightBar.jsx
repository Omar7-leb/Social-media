import "./rightBar.scss";
import { useQuery , useQueryClient , useMutation } from '@tanstack/react-query';
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isPending, error, data: suggestions } = useQuery({
    queryKey: ["getSuggester"],
    queryFn: () => makeRequest.get(`/users/getSuggester`).then((res) => res.data)
  });
  console.log(suggestions);

  const { isLoading, error: likesError, data: likes } = useQuery({
    queryKey: ["likes"],
    queryFn: () => makeRequest.get("/likes/LikesActivity").then(res => res.data)
  });

  console.log("likesss", likes);
  console.log("sugg", suggestions);

  const { isPending : risPending, data: relationshipData } = useQuery({
    queryKey: ["relationships"],
    queryFn: () => makeRequest.get("/relationships?followedUserId=" + relationshipData.id).then((res) => res.data)
  });
  
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships", { userId }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationships"] })
    },
  });
  
  const handleFollow = (user) => {
    mutation.mutateAsync(user.id);
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {isPending && <p>Loading...</p>}
          {error && <p>Error fetching suggestions</p>}
          {suggestions && suggestions.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={`/upload/${user.profilePic}`} alt="" />
                <span>{user.username}</span>
              </div>
              <div className="buttons">
                {risPending ? "Loading" : user.id !== currentUser.id && (
                  <button onClick={() => handleFollow(user)}>follow</button>
                )}
                <button>dismiss</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="item">
  <span>Latest Activities</span>
  {isLoading && <p>Loading...</p>}
  {likes && likes.map((like, index) => (
    <p key={index}>You liked {like.username}'s post</p>
  ))}
  {likesError && <p>Error fetching likes</p>}
</div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Omar</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Ahmad</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Fadi</span>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};

export default RightBar;
