import "./rightBar.scss";
import { useQuery , useQueryClient , useMutation } from '@tanstack/react-query';
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);

  const { isPending, error, data: suggestionsData } = useQuery({
    queryKey: ["getSuggester"],
    queryFn: () => makeRequest.get(`/users/getSuggester`).then((res) => res.data)
  });

  console.log(suggestionsData);

  const { isLoading, error: likesError, data: likes } = useQuery({
    queryKey: ["likes"],
    queryFn: () => makeRequest.get("/likes/LikesActivity").then(res => res.data)
  });

  console.log("likesss", likes);
  console.log("sugg", suggestionsData);

  const { isPending: risPending, data: relationshipData } = useQuery({
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

  const handleDismiss = (userId) => {
    setSuggestions(suggestions => suggestions.filter(user => user.id !== userId));
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {isPending && <p>Loading...</p>}
          {error && <p>Error fetching suggestions</p>}
          {suggestionsData && suggestionsData.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={`/upload/${user.profilePic}`} alt="" />
                <span>{user.username}</span>
              </div>
              <div className="buttons">
                {risPending ? "Loading" : user.id !== currentUser.id && (
                  <button onClick={() => handleFollow(user)}>follow</button>
                )}
                <button onClick={() => handleDismiss(user)}>dismiss</button>
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
