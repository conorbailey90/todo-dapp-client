import { ethers } from 'ethers';
import { useEffect, useState} from 'react';
import { TaskContractAddress } from './config';
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

      // Check that user is connected to the correct network...
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log(`Connected to chain: ${chainId}`)
      const hardhatChainId = '0x7a69';
      if(chainId !== hardhatChainId){
        alert('You are not connected to the Harhat network....');
        return
      }else{
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])

      const provider = new ethers.BrowserProvider(ethereum);

      const signer = await provider.getSigner();
  
      const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer); 
      setTaskContract(TaskContract);   
    }catch(err){
      console.log(err.code)
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
        console.log(taskId)
        let tempTask = {id: taskId,...task};
        console.log(tempTask)
        setTasks([...tasks, tempTask])
    }catch(err){
      console.log(err)
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
        console.log(allTasks)
        setTasks(allTasks);
      }
    }
    getAllTasks();
   
  }, [taskContract]);

  // Detect change in Metamask account
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chain) => {
        const hardhatChainId = '0x7a69';
        if(chain !== hardhatChainId){
          alert('Network change detected. Please sign in using the Hardhat Network.');
          window.location.reload();
        }
        //
      });

      window.ethereum.on("accountsChanged", (accounts) => {
        if(accounts.length === 0){ // signed out
          window.location.reload();
        }else{
          setCurrentAccount(accounts[0]);
        }
        
      });
    }
  },[]);

  return (
    <div className="App">
      <NavBar currentAccount={currentAccount} connectWallet={connectWallet}/>
     {currentAccount === '' ? (
           <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <HomePanel text='Please sign in.'  />
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
