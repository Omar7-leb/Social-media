import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => {
        return res.data;
      }),
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleClick = () => {
    setShowForm(true);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    console.log("Button clicked");
    console.log("File:", file);
    if (file) {
      const imgUrl = await upload();
      console.log("Image URL:", imgUrl);
      mutation.mutate({ img: imgUrl });
      setFile(null);
      setShowForm(false);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        {!showForm && (
          <>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleClick}>+</button>
          </>
        )}
      </div>
      {showForm && (
    <form onSubmit={handleShare} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
      <input
        type="file"
        id="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginRight: '10px' }}
      />
      <button type="submit" style={{ padding: '5px 10px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Share</button>
      <button type="button" onClick={() => setShowForm(false)} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
    </form>
  )}
  

      {error ? (
        "Something went wrong"
      ) : isPending ? (
        "loading"
      ) : (
        data.map((story) => (
          <div className="story" key={story.id}>
            <img src={"/upload/" +story.img} alt="" />
            <span>{story.userName}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;
