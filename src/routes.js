import MainMenu from "./components/main-menu.vue"
import JoinGame from "./components/JoinGame.js"
import CreateGame from "./components/CreateGame.js"
import PlayGame from "./components/PlayGame.js"
import NotFound from "./components/NotFound.js"

export default [
  {
    path: "/",
    component: MainMenu
  },
  {
    path: "/join",
    component: JoinGame
  },
  {
    path: "/create",
    component: CreateGame
  },
  {
    path: "/match",
    component: PlayGame
  },
  {
    path: "*",
    component: NotFound
  }
]
