
import './NavBar.css'

const Navbar = ({currentAccount,  chosenNetwork, signedIn}) => {
 
    return (
        <div className="navbar">
            <div className='navbar__container'>
                <h3>{!signedIn ? 'Task List' : `Task List - ${chosenNetwork}`}</h3>
                {currentAccount === '' ? (
                   <>
                   </>
                )
                :
                    <div>
                        <button className='nav__button active'>{`${currentAccount.slice(0,4)}...${currentAccount.slice(36)}`}</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar;