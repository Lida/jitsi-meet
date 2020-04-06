import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Enter Game/Room</h1>
      <Link to={`Pandemic/HelloWorld6837`}>Create Pandemic Room</Link>
    </div>
  );
}
