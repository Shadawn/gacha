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

const NavItem = (props) => {
  return <div style={{
    paddingRight: '5px',
    paddingLeft: '5px',
    display: 'inline'
  }}><Link to={props.to}>{props.label}</Link></div>
}
const App = () => <Router>
  <nav>
    <NavItem to='/singleplayer' label='Single-player' />
    <NavItem to='/lobby' label='Multiplayer' />
    <NavItem to='/debug' label='Debug' />
  </nav>
  <Switch>
    <Route path='/singleplayer'>
      <SinglePlayerClient />
    </Route>
    <Route path='/lobby'>
      <Lobby />;
    </Route>
    <Route path='/debug'>
      <Lobby />;
      <Lobby />;
    </Route>
  </Switch>
</Router>

export default App;
