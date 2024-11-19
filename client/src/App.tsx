import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/Theme/theme-provider";
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { Toaster } from "@/components/ui/sonner";
import { MessagePage } from './pages/MessagePage';
import Projects from './pages/Projects';
import Visualization from './pages/Visualization';
import PrivacyPolicy from './pages/Privacypolicy';
import ProjectDisplay from './pages/ProjectDisplay';
import TermsAndConditions from './pages/TermsAndConditions';
import Feed from './pages/Feed';
import UserPosts from './pages/UserPosts';
import ShowPostByID from './components/Posts/ShowPostByID';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/message" element={<MessagePage/>} />
          <Route path="/projects/:username" element={<Projects />} />
          <Route path="/projects/:username/:projectId" element={<ProjectDisplay />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/relations/:username" element={<Visualization />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/posts/:username" element={<UserPosts />} />
          <Route path="/post/:postId" element={<ShowPostByID />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;