

import './HomePanel.css'

const HomePanel = ({text, currentNetwork, availableNetworks, connectWallet, setNetwork }) => {

    console.log(currentNetwork)
    return (
        <div className='home__panel'>
            <div>
            <h3>Current Network: {currentNetwork}</h3><br />
            <h3>Select network</h3>
            <select  className='network__select' onChange={(e) => setNetwork(e.target.value)}>
                <option key={0} value={false}>-</option>
                {   
                   Object.keys(availableNetworks).map(chainId => (
                    <option key={chainId} value={chainId}>{availableNetworks[chainId]}</option>
                   ))
                }
            </select><br />
            <button onClick={connectWallet} className='connect__btn'>Connect Wallet</button>
            </div>
           
        </div>
    )
}

export default HomePanel;