import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-black text-white">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  )
}

export default Navbar