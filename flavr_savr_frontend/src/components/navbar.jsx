import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { IconContext } from "react-icons";
import React from 'react';

export default function Navbar() {

  return (
    <div className="navbar-container">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `navbar-btn-container ${isActive ? "active" : ""}`
        }
      >
        <IconContext.Provider value={{ size: "24px" }}>
          <FaHome />
        </IconContext.Provider>
      </NavLink>

      <NavLink
        to="/savedrecipes"
        className={({ isActive }) =>
          `navbar-btn-container ${isActive ? "active" : ""}`
        }
      >
        <IconContext.Provider value={{ size: "24px" }}>
          <FaRegBookmark />
        </IconContext.Provider>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `navbar-btn-container ${isActive ? "active" : ""}`
        }
      >
        <IconContext.Provider value={{ size: "24px" }}>
          <FaRegUser />
        </IconContext.Provider>
      </NavLink>
    </div>
  );
}
