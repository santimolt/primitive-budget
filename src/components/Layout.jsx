import { Box, Flex, Heading, Button, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import Dashboard from './Dashboard';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategoryManager from './CategoryManager';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Flex
        as="nav"
        bg={colorMode === 'light' ? 'blue.600' : 'blue.800'}
        color="white"
        p={4}
        justifyContent="space-between"
        alignItems="center"
        boxShadow="md"
      >
        <Heading size="lg">Primitive Budget</Heading>
        <Button onClick={toggleColorMode} size="sm" variant="ghost">
          {colorMode === 'light' ? '🌙' : '☀️'}
        </Button>
      </Flex>

      <Flex
        as="nav"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderBottom="1px"
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        boxShadow="sm"
      >
        <Button
          variant={activeTab === 'dashboard' ? 'solid' : 'ghost'}
          colorScheme={activeTab === 'dashboard' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('dashboard')}
          borderRadius={0}
        >
          Dashboard
        </Button>
        <Button
          variant={activeTab === 'transactions' ? 'solid' : 'ghost'}
          colorScheme={activeTab === 'transactions' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('transactions')}
          borderRadius={0}
        >
          Transactions
        </Button>
        <Button
          variant={activeTab === 'categories' ? 'solid' : 'ghost'}
          colorScheme={activeTab === 'categories' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('categories')}
          borderRadius={0}
        >
          Categories
        </Button>
      </Flex>

      <Box p={6} maxW="1400px" mx="auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && (
          <Box>
            <TransactionForm />
            <TransactionList />
          </Box>
        )}
        {activeTab === 'categories' && <CategoryManager />}
      </Box>
    </Box>
  );
};

export default Layout;

