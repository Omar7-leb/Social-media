import { useState } from "react";
import { makeRequest } from "../../axios";
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./editPost.scss";

export const Edit = ({setOpenUpdate, post}) => {
   const [image, setImage] = useState(null);
   const [texts, setTexts] = useState({
     id : post.id,
     desc : post.desc,
     img : post.img,
     });

  const upload =  async (file)=>{
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }


  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
};

      

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (post)=>{
        console.log("Post object:", post);
    console.log("Post ID:", post.id);
     return makeRequest.put(`/posts/${post.id}`, post);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post"] })
    },
  })
  
  const handleClick = async (e) => {
     e.preventDefault();
     let imageUrl;
     
     imageUrl = image ? await upload(image) : post.img;
     mutation.mutate({ ...texts, img: imageUrl});
     setOpenUpdate(false);
     setImage(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Edit your Post</h1>
        <form>
          <div className="files">
            <label htmlFor="image">
              <span>Image</span>
              <div className="imgContainer">
                <img
                 src={
                  image
                    ? URL.createObjectURL(image)
                    : "/upload/" + post.img
                }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="image"
              style={{ display: "none" }}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <label>Description</label>
          <input
            type="text"
            value={texts.desc}
            name="desc"
            onChange={handleChange}
          />
          <button onClick={handleClick}>Edit</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};