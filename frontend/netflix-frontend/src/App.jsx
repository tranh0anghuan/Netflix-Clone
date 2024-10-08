import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SingupPage from "./pages/SignupPage";
// import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Footer from "./components/Footer/index.jsx";
import WatchPage from "./pages/WatchPage/index.jsx";
import SearchPage from "./pages/SearchPage/index.jsx";
import HistoryPage from "./pages/HistoryPage/index.jsx";
import NotFoundPage from "./pages/NotFoundPage/index.jsx";
import ListPage from "./pages/ListPage/index.jsx";

function App() {

  const {user,isCheckingAuth, authCheck} = useAuthStore()

  useEffect(()=>{
    authCheck()
  },[authCheck])

  if(isCheckingAuth){
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!user ? <SingupPage /> : <Navigate to={"/"} />} />
        <Route path="/watch/:id" element={user ? <WatchPage /> : <Navigate to={"/login"} />} />
        <Route path="/search" element={user ? <SearchPage /> : <Navigate to={"/login"} />} />
        <Route path="/history" element={user ? <HistoryPage /> : <Navigate to={"/login"} />} />
        <Route path="/list" element={user ? <ListPage /> : <Navigate to={"/login"} />} />
        <Route path="/*" element={<NotFoundPage/>} />
      </Routes>
      
      <Footer/>
      <Toaster/>
    </>
  );
}

export default App;
