import express from "express"
import {createUser,login,logout,getAllUser,getCurrentUserProfile,updateCurrentProfile,deleteUserById,getUserById,updateUserById}from "../controllers/useController.js"
const router=express.Router()
import {authenticate,authorizeAdmin} from "../middlewares/authMiddleware.js"

router.route("/").post(createUser)
.get(authenticate,authorizeAdmin,getAllUser)

router.route("/auth").post(login)
router.route("/logout").post(logout)
router.route("/profile").get(authenticate,getCurrentUserProfile).put(authenticate,updateCurrentProfile)
//Admin Routes
router.route("/:id").delete(authenticate,authorizeAdmin,deleteUserById)
.get(authenticate,authorizeAdmin,getUserById)
.put(authenticate,authorizeAdmin,updateUserById)


export default router;