import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FeedPage from "./pages/feed";
import ExplorePage from "./pages/explore";
import ProfilePage from "./pages/profile";
import PostPage from "./pages/post";
import EditProfilePage from "./pages/edit-profile";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import NotFoundPage from "./pages/not-found";
import EstablishmentPage from "./pages/establishment";
import { AuthContext } from "./auth";
import { ME } from "./graphql/subscriptions";
import { useSubscription } from "@apollo/client";
import LoadingScreen from "./components/shared/LoadingScreen";

export const UserContext = React.createContext();

function App() {
  const { authState } = React.useContext(AuthContext);
  // console.log("Authstate", authState);

  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.uid : null;
  const variables = { userId };

  const { data, loading } = useSubscription(ME, { variables });

  if (loading) return <LoadingScreen />;

  if (!isAuth) {
    return (
      <Router>
        <Routes>
          <Route path="/accounts/login" element={<LoginPage />} />
          <Route path="/accounts/emailsignup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/accounts/login" replace />} />
        </Routes>
      </Router>
    );
  }

  const me = isAuth && !loading && (data ? data.users[0] : null);
  const currentUserId = me?.id;
  const followingIds = me?.following.map(({ user }) => user.id);
  const followerIds = me?.followers.map(({ user }) => user.id);

  // User ids to show on feed. Including own posts
  const feedIds = me && [...followingIds, currentUserId];

  return (
    <UserContext.Provider
      value={{ me, currentUserId, followingIds, followerIds, feedIds }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/p/:postId" element={<PostPage />} />
          <Route path="/e/:establishmentId" element={<EstablishmentPage />} />
          <Route path="/accounts/edit" element={<EditProfilePage />} />
          <Route path="/accounts/login" element={<LoginPage />} />
          <Route path="/accounts/emailsignup" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
