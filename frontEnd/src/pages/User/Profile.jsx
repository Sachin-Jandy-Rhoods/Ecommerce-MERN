import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/userApiSlice";
const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.name, userInfo.email]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[6rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
        <h2 className=" text-2xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={submitHandler}>
        <div className="my-[2rem]">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-input mt-1 p-2 border rounded w-full bg-[#25282f]"
            placeholder="Enter name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="my-[2rem]">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-2 border rounded w-full bg-[#25282f]"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-[2rem]">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 p-2 border rounded w-full bg-[#25282f]"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-[2rem]">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-white bg-[#25282f]"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 p-2 border rounded w-full bg-[#25282f]"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div> 

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
              >
                My Orders
              </Link>
            </div>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
