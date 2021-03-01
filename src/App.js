import { Client } from 'boardgame.io/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Game } from './Game';
import { Board } from './Board';
import Lobby from './Lobby';

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
      <Lobby />;
    </Route>
  </Switch>
</Router>

export default App;
