export default function Footer() {
  return (
    <footer className=" flex items-center p-5 text-slate-400 ">
      <div className="container text-center space-y-2">
        <img
          src="./images/nf_logo.png"
          alt="Nextflik logo"
          className="w-16 block mx-auto"
        />

        <p className=" flex items-center justify-center text-sm">
          <span className="mr-2">Developed by</span>
          <a
            href={"https://www.bradmeyn.com"}
            target="_blank"
            rel="noreferrer"
            className="text-white underline-offset-2 hover:underline"
          >
            Brad Meyn
          </a>
          <span className="px-2">&#8226;</span>
          <a
            href={"https://www.github.com/bradmeyn/nextflik"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-white underline-offset-2 hover:underline"
          >
            <span>GitHub</span>
          </a>
        </p>

        <p className="text-xs">
          Copyright © {new Date().getFullYear()} - All right reserved
        </p>
      </div>
    </footer>
  );
}
