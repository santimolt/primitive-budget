import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Layout from './components/Layout';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Layout />
    </ChakraProvider>
  );
}

export default App;

