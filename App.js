import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import 'react-native-get-random-values';

// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims';

// Import the ethers library
import {ethers} from 'ethers';

const App = () => {
  const [txState, setTxState] = useState(null);
  const PRIVATE_KEY =
    '251d600a7ee83e1edd9b96b409f8295441c372e0c095495250acf7e85b52bc76';
  const walletAddress = '0xED068441C094Cbc40F6a5e4e4b9cdCfb43385807';
  const transactionAmount = '0.0000001';
  const connect = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.getDefaultProvider('goerli');

    // MetaMask requires requesting permission to connect users accounts

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const block = await provider.getBalance(walletAddress);
    console.log(ethers.utils.formatEther(block));
    if (ethers.utils.formatEther(block) < transactionAmount) {
      setTxState('Failed');
      return;
    }
    setTxState('Pending');
    let tx = {
      to: walletAddress,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(transactionAmount),
    };
    // Send a transaction
    await wallet.sendTransaction(tx).then(txObj => {
      console.log('started mining', {txObj});
      //wait for transaction receipt
      provider.waitForTransaction(txObj.hash).then(txnObj => {
        setTxState('Completed');
        console.log({txnObj});
      });
    });
  };
  return (
    <View style={styles.container}>
      <TextInput placeholder="transaction value" style={styles.textBox} />
      <TextInput placeholder="address" style={styles.textBox} />
      <TouchableOpacity onPress={connect}>
        <Text style={styles.button}>Connect</Text>
      </TouchableOpacity>
      <Text>{txState}</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'yellow',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textBox: {
    color: 'black',
    width: '75%',
    backgroundColor: 'white',
    margin: 2,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'green',
    color: 'white',
    marginHorizontal: 'auto',
  },
});
