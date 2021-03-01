import { Client, Lobby } from 'boardgame.io/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Game } from './Game';
import { Board } from './Board';

const SinglePlayerClient = Client(
  {
    game: Game,
    board: Board,
    debug: false
  }
)

const App = () => <Router>
  <nav>
    <ul>
      <li>
        <Link to='/singleplayer'>Single-player</Link>
      </li>
      <li>
        <Link to='/lobby'>Multiplayer</Link>
      </li>
    </ul>
  </nav>
  <Switch>
    <Route path='/singleplayer'>
      <SinglePlayerClient />
    </Route>
    <Route path='/lobby'>
      <Lobby
        gameServer={`http://${window.location.hostname}:8000`}
        lobbyServer={`http://${window.location.hostname}:8000`}
        gameComponents={[
          { game: Game, board: Board }
        ]}
      />;
    </Route>
  </Switch>
</Router>

export default App;
