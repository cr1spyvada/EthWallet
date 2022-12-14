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
  const [txState, setTxState] = useState('No transaction');
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionAmount, setTxnAmt] = useState('');
  const PRIVATE_KEY =
    '251d600a7ee83e1edd9b96b409f8295441c372e0c095495250acf7e85b52bc76';
  // const walletAddress = '0xED068441C094Cbc40F6a5e4e4b9cdCfb43385807';
  // const transactionAmount = '0.0000001';
  const connect = async () => {
    if (!txState === 'No transaction' && !txState === 'Completed') return;
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    setTxState('Pending');
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
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.text}>Transaction Value</Text>
        <TextInput
          onChangeText={text => setTxnAmt(text)}
          value={transactionAmount}
          placeholder="transaction value(in ether)"
          style={styles.textBox}
        />
        <Text style={styles.text}>Wallet Address</Text>
        <TextInput
          onChangeText={val => setWalletAddress(val)}
          value={walletAddress}
          placeholder="wallet address"
          style={styles.textBox}
        />
        <TouchableOpacity
          disabled={!txState === 'No transaction' && !txState === 'Completed'}
          onPress={connect}>
          <Text style={styles.button}>Make Transaction</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textContainer}>{txState}</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  body: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  container: {
    backgroundColor: 'yellow',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '80%',
    height: '40%',
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  textBox: {
    color: 'black',
    width: '75%',
    backgroundColor: 'white',
    margin: 4,
    borderRadius: 10,
  },
  button: {
    padding: 15,
    // margin: 5,
    borderRadius: 10,
    backgroundColor: 'green',
    color: 'white',
  },
  textContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: 'black',
  },
});
