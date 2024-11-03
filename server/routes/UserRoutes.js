import User from "../model/User.js";
import app from "./RouteConfig.js";
import Joi from "joi"

const user = new User();



const UserRoutes = () => {

     // Route pour obtenir tous les utilisateurs
     app.get("/api/user", async (req, res) => {
          await user.init()
          const users = await user.getAll()
          res.status(200).json(users)
     })


     // Route pour créer un nouvel utilisateur
     app.post('/api/user', async (req, res) => {
          const schema = Joi.object().keys({
               username: Joi.string()
                    .min(3)
                    .max(30)
                    .required()
                    .custom((value, helpers) => {
                         // Check if the username contains only letters, numbers, and spaces
                         if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
                              return helpers.error('any.invalid', { message: 'Username can only contain letters, numbers, and spaces.' });
                         }
                         return value; // If valid, return the value
                    }),
               email: Joi.string().email().required(),
               password: Joi.string().min(8).required()
          });

          const { username, email, password } = req.body;
          const result = schema.validate({ username, email, password });

          if (result.error) {
               return res.status(400).json({ message: `Invalid request dude`, error: result.error.details });
          }

          try {
               await user.init();
               await user.store({ username, email, password });
               res.status(201).json({ message: "User  successfully created", isCreated: true });
          } catch (error) {
               console.error("Error while adding new user:", error);
               res.status(500).json({ message: "Error while adding new user", error: error.message });
          }
     });

     // Route pour mettre à jour un utilisateur
     app.put('/api/user/updateUser', async (req, res) => {
          const { username, email, id } = req.body;
          try {
               await user.init();
               await user.updateUser(username, email, id);
               res.status(200).json({ message: "Mise à jour effectuée avec succès", userUpdated: true });
          } catch (error) {
               console.error("Error updating user:", error);
               res.status(500).json({ error: `Failed to update user ${error}` });
          }
     });

     // Route pour obtenir un utilisateur par ID
     app.get('/api/user/:id', async (req, res) => {
          try {
               const userId = req.params.id;
               await user.init();
               const userData = await user.getById(userId);
               if (!userData) {
                    return res.status(404).json({ error: "User not found" });
               }
               res.status(200).json(userData);
          } catch (error) {
               console.error("Error getting user:", error);
               res.status(500).json({ error: `Failed to retrieve user due to: ${error}` });
          }
     });

     // Route pour supprimer un utilisateur par ID
     app.delete('/api/user/delete/:id', async (req, res) => {
          try {
               const userId = req.params.id;
               await user.delete(userId);
               res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
          } catch (error) {
               console.error("Error deleting user:", error);
               res.status(500).json({ message: 'Error deleting user' });
          }
     });

     // Route pour la connexion d'un utilisateur
     app.post("/api/user/login", async (req, res) => {
          try {
               const { email, password } = req.body;

               // Check if username and password are provided
               if (!email || !password) {
                    return res.status(400).json({ error: "Username and password are required" });
               }

               // Call the login method on the User model
               const user = new User();
               const authUser = await user.login(email, password);

               // Check if the login is successful
               if (authUser.invalidPassword) {
                    return res.json({
                         message: 'Password invalid', invalidPassword: true
                    });
               }

               if(authUser.userNotFound){
                    return res.json({
                         userNotFound : true,
                         message : authUser.message
                    })
               }

               if (authUser) {
                    return res.json({
                         message: `User  successfully found`, user: authUser, isLoggedIn: true
                    });
               } else {
                    // If the login fails, an error message
                    return res.status(401).json({ error: "Invalid username or password" });
               }
          } catch (error) {
               // If an error occurs, a server error response
               return res.status(500).json({ error: `Internal Server Error : ${error}` });
          }
     });

}

export default UserRoutes;
