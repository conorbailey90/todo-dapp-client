
import './NavBar.css'

const Navbar = ({currentAccount, connectWallet, chosenNetwork}) => {
 
    return (
        <div className="navbar">
            <div className='navbar__container'>
                <h3>{currentAccount === '' ? 'Task List' : `Task List - ${chosenNetwork}`}</h3>
                {currentAccount === '' ? (
                    <div>
                        <button className='nav__button' onClick={connectWallet}>Connect Wallet</button>
                    </div>
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