import { ethers } from 'ethers';
import { useEffect, useState} from 'react';
import { TaskContractAddress, availableNetworks } from './config';
import TaskAbi from './abi/TaskContractMain.json';

// Components
import NavBar from './components/NavBar';
import TaskContainer from './components/TaskContainer';
import TaskForm from './components/TaskForm';
import HomePanel from './components/HomePanel';
import './App.css';

function App() {
  const [taskContract, setTaskContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [chosenNetwork, setChosenNetwork] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try{
      // Check MetaMask is installed...
      const {ethereum} = window;
      if(!ethereum){
        alert('MetaMask not detected...');
        console.log('MetaMask not detected...');
        return
      }

      // Check that user is connected to a correct available network...
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      // console.log(`Connected to chain: ${chainId}`)

      if(availableNetworks.hasOwnProperty(chainId)){
        setChosenNetwork(availableNetworks[chainId]);
        setCorrectNetwork(true);
      }else{
        let netString = ''
        for(let key in availableNetworks){
          netString += `- ${availableNetworks[key]} \n `
        }
        alert(`Please connect to one of the following networks in MetaMask: \n \n ${netString}`);
        setCorrectNetwork(false);
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0]) 
    }catch(err){
      console.error(err)
      if(err.code === -32002){
        alert('Open the Metamask extension to complete sign on.')
      }
    }
  }

  const addTask = async (taskText, isDeleted) => {
    const task = {
      "taskText": taskText,
      "isDeleted": isDeleted
    }

    try{
        await taskContract.addTask(task.taskText, task.isDeleted);
        let taskId = await taskContract.getTasksLength();
        let tempTask = {id: taskId,...task};
        setTasks([...tasks, tempTask])
    }catch(err){
      console.log(err);
      alert('Something went wrong.')
    }
  }

  const deleteTask = async (taskId, isDeleted) => {
    try{
        let deletedTask = await taskContract.deleteTask(taskId, isDeleted);
        console.log(deletedTask)
        let allTasks = tasks.filter(task => task.id !== taskId)
        setTasks(allTasks);
    }catch(err){
      if(err.code === 'ACTION_REJECTED') return;
      alert('Something went wrong. Please try refreshing the page to ensure that this app is syncronised to the blockchain...')
    }
  }

  useEffect(() =>{
    const getAllTasks = async () => {
      if(taskContract){
        const allTasks = await taskContract.getTasks();
        setTasks(allTasks);
      }
    }
    getAllTasks();
  }, [taskContract]);

  // Set up contract with ethers js library
  useEffect(() => {
    if(currentAccount && chosenNetwork){
      const setupContract = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress[chosenNetwork], TaskAbi.abi, signer); 
        setTaskContract(TaskContract); 
      }
      setupContract(); 
    }
  }, [chosenNetwork, currentAccount])

  // Detect change in Metamask account
  useEffect(() => {
    const {ethereum} = window;
    if(ethereum) {
      ethereum.on("chainChanged", (chain) => {
        if(!availableNetworks.hasOwnProperty(chain)){
          let netString = ''
          for(let key in availableNetworks){
            netString += `- ${availableNetworks[key]} \n `
          }
          console.log(`Please connect to one of the following networks in MetaMask: \n \n ${netString}`);
        }else{
          setCorrectNetwork(true);
          setChosenNetwork(availableNetworks[chain]);
        }
        window.location.reload();
      });

      ethereum.on("accountsChanged", async (accounts) => {
        if(accounts.length === 0){ // signed out
          window.location.reload();
        }else{
          setCurrentAccount(accounts[0]);
          const chainId = await ethereum.request({ method: 'eth_chainId' });    
          if(availableNetworks.hasOwnProperty(chainId)){
            setChosenNetwork(availableNetworks[chainId]);
            setCorrectNetwork(true);
          }
       }
    })
    }
},[chosenNetwork]);

useEffect(() => {
  async function change(){
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xf00' }],
    });
  }
  change()
})

  return (
    <div className="App">
      <NavBar currentAccount={currentAccount} connectWallet={connectWallet} chosenNetwork={chosenNetwork}/>
     {currentAccount === '' ? (
           <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <HomePanel text='Please sign in.'/>
      </div>
     ) :
     correctNetwork ? (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <TaskForm addTask={addTask} />
        <TaskContainer tasks={tasks} deleteTask={deleteTask} />
        
      </div>
     ) :
     (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <HomePanel text='Please connect to the hardhat network' />
      </div>
     )
     }
     </div>
  )
}
export default App;
