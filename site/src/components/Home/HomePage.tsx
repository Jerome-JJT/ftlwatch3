import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="mx-auto h-max max-w-md bg-white py-6 text-center shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <h1 id="startPage" className="text-2xl">
        Home page
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400">
        This is our <span className="text-blue-600">ft_transcendance</span>, HF
        and GL for your games.
      </p>
      <i className="text-center text-sm text-gray-500 dark:text-gray-400">
        To start a game, you need to{" "}
        <span className="text-blue-600">log in</span> first!
      </i>
      <p className="text-center text-gray-500 dark:text-gray-400">Made by</p>
      <div className="mt-4 flex flex-row justify-center text-center">
        <div className="flex flex-1 flex-col justify-center">
          <img
            className="h-10 w-10 self-center rounded object-cover"
            src="https://cdn.intra.42.fr/users/f3dba9906e446d2dabdf9e8cc61ea422/small_ktrosset.jpg"
            alt="ktrosset"
          />
          ktrosset
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <img
            className="h-10 w-10 self-center rounded object-cover"
            src="https://cdn.intra.42.fr/users/a7d173be27258263cd70f9d4d0f23c51/small_bmangin.jpg"
            alt="bmangin"
          />
          bmangin
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <img
            className="h-10 w-10 self-center rounded object-cover"
            src="https://cdn.intra.42.fr/users/cf4f5240037fe94a945683de44f7fb88/small_tpinto-m.jpg"
            alt="tpinto-m"
          />
          tpinto-m
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <img
            className="h-10 w-10 self-center rounded object-cover"
            src="https://cdn.intra.42.fr/users/52b91ada753329d24bb4686b8e67b31a/small_tnanchen.jpg"
            alt="tnanchen"
          />
          tnanchen
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <img
            className="h-10 w-10 self-center rounded object-cover"
            src="https://cdn.intra.42.fr/users/072f80b99d4a207794928fdf92cf14b1/small_jjaqueme.jpg"
            alt="jjaqueme"
          />
          jjaqueme
        </div>
      </div>
      <div className="inline-flex">
        <Link
          to={"https://github.com/Tosba74/ft_transcendance"}
          className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          GitHub
        </Link>
      </div>
    </div>
  );
}
