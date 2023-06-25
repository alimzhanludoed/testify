import { Link } from "react-router-dom";
import logo from './logo.png';

const Navbar = ( props ) => {
  const username = props.username;

  return ( 
      <nav className='mynavbar'>
        <Link to='/'>
          <img className='mylogo' src={logo} alt='Testify' />
        </Link>
        <div>
          <Link className='navlink' to="/newquestion">Add Questions</Link>
          |
          <button className='myprofile'>{username || 'Sign Up'}</button>
        </div>
      </nav>
   );
}
 
export default Navbar;