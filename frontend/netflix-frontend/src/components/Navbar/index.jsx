import { LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authUser.js";
import { useContentStore } from "../../store/content.js";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();

  const { setContentType } = useContentStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
      <div className="flex items-center gap-10 z-50">
        <Link to="/">
          <img src="/netflix-logo.png" alt="" className="w-32 sm:w-40" />
        </Link>

        <div className="hidden sm:flex gap-2 items-center">
          <Link
            to="/"
            className="hover:opacity-40 mx-2"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:opacity-40 mx-2"
            onClick={() => setContentType("tv")}
          >
            TV Shows
          </Link>
          <Link to="/history" className="hover:opacity-40 mx-2">
            Search History
          </Link>
          <Link to="/list" className="hover:opacity-40 mx-2">
            My List
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        <Link to={"/search"}>
          <Search className="size-6 cursor-pointer mx-2" />
        </Link>
        <img
          src={user.image}
          alt="Avatar"
          className="h-8 rounded cursor-pointer mx-2"
        />
        <LogOut className="size-6 cursor-pointer mx-2" onClick={logout} />
        <div className="sm:hidden">
          <Menu
            className="size-6 cursor-pointer mx-2"
            onClick={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Mobile */}

      {isMobileMenuOpen && (
        <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
          <Link
            to={"/"}
            className="block hover:opacity-40 p-2"
            onClick={toggleMobileMenu}
          >
            Movies
          </Link>
          <Link
            to={"/"}
            className="block hover:opacity-40 p-2"
            onClick={toggleMobileMenu}
          >
            TV Shows
          </Link>
          <Link
            to={"/history"}
            className="block hover:opacity-40 p-2"
            onClick={toggleMobileMenu}
          >
            Search History
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
