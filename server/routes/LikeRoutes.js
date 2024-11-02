import Like from "../model/Like.js";
import app from "./RouteConfig.js";

const like = new Like();
await like.init();

const LikeRoutes = () => {
     // Get all likes
     app.get("/api/like", async (req, res) => {
          try {
               const likes = await like.getAll();
               res.status(200).json(likes);
          } catch (error) {
               console.error(error);
               res.status(500).json({ message: "Can't send the request to the model", error: error.message });
          }
     });

     // Like or unlike a recipe
     app.post("/api/like", async (req, res) => {
          try {
               const { recipe_id, userId } = req.body;
               const action = await like.likeOrUnlike(recipe_id, userId); // Get the action result
               res.status(200).json({ message: `Recipe has been ${action}` ,likeStatus : action}); // Return the action result
          } catch (error) {
               res.status(500).json({ message: `No liked or unliked due to: ${error.message}` });
          }
     });
};

export default LikeRoutes;