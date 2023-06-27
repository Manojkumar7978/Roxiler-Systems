import logo from './logo.svg';
import './App.css';
import { Heading, chakra } from '@chakra-ui/react';
import Context from './context';
import TTable from './components/table';
import Statistics from './components/statistics';

function App() {
  return (
    <Context>
      <chakra.div p={4} m={'auto'} maxW={'1200px'}>
        <Heading size={'lg'} textAlign={'center'} color={'blue.500'}>Transction Dashboard</Heading>
        <TTable />
        <Statistics />
      </chakra.div>
    </Context>
  );
}

export default App;
