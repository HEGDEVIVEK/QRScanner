import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Layout.scss";

export default function Layout({ children }) {
  return (

    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__right">
        <Header />
        <main className="app-layout__main">{children}</main>
      </div>
      
    </div>
  );
}