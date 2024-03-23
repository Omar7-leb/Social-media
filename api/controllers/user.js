import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "Update users SET `name`=? ,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=?"

    db.query(q,[
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      userInfo.id,
    ], (err,data)=>{
      if(err) res.status(500).json(err)
      if(data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can Update only your post");
    })
  })
};

export const searchUser = (req, res) => {

  const searchQuery = "SELECT * FROM users WHERE `name` LIKE ?";
  const searchTerm = `%${req.body.searchbar}%`;

  db.query(searchQuery, searchTerm, (err, data) => {
    if (err) {
      console.error('Error searching users:', err);
      return res.status(500).json(err);
    }

    res.json(data);
  });
};

export const getSuggester = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "SELECT u.id ,u.username, u.profilePic FROM users u LEFT JOIN relationships r ON u.id = r.followedUserId AND r.followerUserId = ? WHERE r.followedUserId IS NULL AND u.id != ?";

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(data);
    });
  });
};