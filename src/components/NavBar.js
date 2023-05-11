import './NavBar.css'

const Navbar = ({currentAccount, connectWallet}) => {


    return (
        <div className="navbar">
            <div className='navbar__container'>
                <h3>Task List</h3>
                {currentAccount === '' ? (
                    <div>
                        <button className='nav__button' onClick={connectWallet}>Connect Wallet</button>
                    </div>
                )
                :
                    <button className='nav__button active'>{`${currentAccount.slice(0,4)}...${currentAccount.slice(36)}`}</button>
                }
            </div>
        </div>
    )
}

export default Navbar;