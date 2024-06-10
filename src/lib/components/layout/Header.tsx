import { Link, useRouterState } from "@tanstack/react-router";
import Search from "../Search";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/discover", label: "Discover" },
    { to: "/watchlist", label: "Watchlist" },
  ];

  return (
    <header className="relative bg-slate-900  py-3">
      <div className="container flex w-full items-center justify-between ">
        <nav className="flex items-center gap-4">
          <img
            src="./images/nf_logo.png"
            alt="Nextflik logo"
            className="w-20 mr-2"
          />
          {links.map((link) => (
            <NavLink key={link.to} {...link} />
          ))}
        </nav>

        <Search />
      </div>
    </header>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const { location } = useRouterState();

  const isActive = location.pathname === to;

  const classes = isActive ? "text-white" : "text-gray-400 hover:text-white";

  return (
    <Link to={to} className={`text-sm ${classes}`}>
      <span>{label}</span>
    </Link>
  );
}
