import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Divider,
  Text,
  HStack,
  Button,
  VStack,
  Switch,
} from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useBudgetStore from '../store/budgetStore';
import { calculateMonthlyAmount, PERIODICITY_OPTIONS } from '../utils/periodicity';
import { exportToJSON, importFromFile } from '../utils/exportImport';
import { formatCurrency } from '../utils/formatNumber';
import { useRef } from 'react';
import { useToast } from '@chakra-ui/react';

const Dashboard = () => {
  const {
    incomes,
    expenses,
    categories,
    getTotalMonthlyIncome,
    getTotalMonthlyExpenses,
    getBalance,
    exportData,
    importData,
    toggleExpense,
  } = useBudgetStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const fileInputRef = useRef(null);
  const toast = useToast();

  const totalIncome = getTotalMonthlyIncome();
  const totalExpenses = getTotalMonthlyExpenses();
  const balance = getBalance();

  // Data for donut chart (Surplus vs Expenses)
  // If there's surplus, show remaining balance. If deficit, show income vs expenses
  const donutChartData = balance >= 0 
    ? [
        {
          name: 'Surplus',
          value: balance, // What actually remains after expenses
        },
        {
          name: 'Expenses',
          value: totalExpenses,
        },
      ]
    : [
        {
          name: 'Income',
          value: totalIncome,
        },
        {
          name: 'Expenses',
          value: totalExpenses,
        },
      ];

  // Colors for donut chart
  const DONUT_COLORS = balance >= 0 
    ? ['#00C49F', '#FF8042'] // Green for remaining surplus, Red for expenses
    : ['#00C49F', '#FF8042']; // Green for income, Red for expenses (when deficit)

  // Data for pie chart (Expenses by category)
  const expenseByCategory = {};
  expenses
    .filter((exp) => exp.isActive)
    .forEach((expense) => {
      const categoryName =
        categories.find((c) => c.id === expense.category)?.name || 'No category';
      const monthlyAmount = calculateMonthlyAmount(
        expense.amount,
        expense.periodicity,
        expense.customDays
      );
      expenseByCategory[categoryName] =
        (expenseByCategory[categoryName] || 0) + monthlyAmount;
    });

  const pieChartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)), // Keep for internal calculations
  }));

  // Colors for pie chart
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
  ];

  // Breakdown by category
  const categoryBreakdown = {};
  
  // Income by category
  incomes.forEach((income) => {
    const categoryName =
      categories.find((c) => c.id === income.category)?.name || 'No category';
    const monthlyAmount = calculateMonthlyAmount(
      income.amount,
      income.periodicity,
      income.customDays
    );
    if (!categoryBreakdown[categoryName]) {
      categoryBreakdown[categoryName] = 0;
    }
    categoryBreakdown[categoryName] += monthlyAmount;
  });

  // Expenses by category (only active) - subtracted (negative values)
  expenses
    .filter((exp) => exp.isActive)
    .forEach((expense) => {
      const categoryName =
        categories.find((c) => c.id === expense.category)?.name || 'No category';
      const monthlyAmount = calculateMonthlyAmount(
        expense.amount,
        expense.periodicity,
        expense.customDays
      );
      if (!categoryBreakdown[categoryName]) {
        categoryBreakdown[categoryName] = 0;
      }
      categoryBreakdown[categoryName] -= monthlyAmount;
    });

  const breakdownData = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({
      category,
      amount: amount,
    }))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  const handleExport = () => {
    const data = exportData();
    exportToJSON(data);
    toast({
      title: 'Data exported',
      description: 'JSON file has been downloaded successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    importFromFile(file)
      .then((data) => {
        importData(data);
        toast({
          title: 'Data imported',
          description: 'Data has been imported successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: 'Import error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });

    event.target.value = '';
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Dashboard</Heading>
        <HStack>
          <Button onClick={handleExport} colorScheme="green" size="sm">
            Export JSON
          </Button>
          <Button
            as="label"
            colorScheme="blue"
            size="sm"
            cursor="pointer"
          >
            Import JSON
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </Button>
        </HStack>
      </HStack>

      {/* Main statistics */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <Stat>
              <StatLabel>Monthly income</StatLabel>
              <StatNumber color="green.500">
                ${formatCurrency(totalIncome)}
              </StatNumber>
              <StatHelpText>Total income</StatHelpText>
            </Stat>
          </Box>
        </GridItem>
        <GridItem>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <Stat>
              <StatLabel>Monthly expenses</StatLabel>
              <StatNumber color="red.500">
                ${formatCurrency(totalExpenses)}
              </StatNumber>
              <StatHelpText>Total active expenses</StatHelpText>
            </Stat>
          </Box>
        </GridItem>
        <GridItem>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <Stat>
              <StatLabel>Monthly balance</StatLabel>
              <StatNumber color={balance >= 0 ? 'green.500' : 'red.500'}>
                ${formatCurrency(balance)}
              </StatNumber>
              <StatHelpText>
                {balance >= 0 ? 'Surplus' : 'Deficit'}
              </StatHelpText>
            </Stat>
          </Box>
        </GridItem>
      </Grid>

      {/* Gráficos */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <Heading size="sm" mb={4}>
              Surplus vs Expenses
            </Heading>
            {donutChartData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {donutChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${formatCurrency(value)}`}
                    contentStyle={{
                      backgroundColor: bgColor,
                      border: 'none',
                      borderRadius: '8px',
                      color: textColor,
                    }}
                    labelStyle={{ color: textColor }}
                  />
                  <Legend 
                    wrapperStyle={{ color: textColor }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Text color="gray.500" textAlign="center" py={10}>
                No data to show
              </Text>
            )}
          </Box>
        </GridItem>
        <GridItem>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <Heading size="sm" mb={4}>
              Expense distribution by category
            </Heading>
            {pieChartData.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={10}>
                No active expenses to show
              </Text>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${formatCurrency(value)}`}
                    contentStyle={{
                      backgroundColor: bgColor,
                      border: 'none',
                      borderRadius: '8px',
                      color: textColor,
                    }}
                    labelStyle={{ color: textColor }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </GridItem>
      </Grid>

      {/* Expense toggle */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        border="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={4}>
          Expense control
        </Heading>
        <Divider mb={4} />
        <Text mb={4} color="gray.600" fontSize="sm">
          Activate or deactivate expenses to see how they affect your budget
        </Text>
        {expenses.length === 0 ? (
          <Text color="gray.500">No expenses registered</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Active</Th>
                <Th>Description</Th>
                <Th>Category</Th>
                <Th isNumeric>Amount</Th>
                <Th>Periodicity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((expense) => {
                const categoryName =
                  categories.find((c) => c.id === expense.category)?.name || 'No category';
                const periodicityOption = PERIODICITY_OPTIONS.find(
                  (opt) => opt.value === expense.periodicity
                );
                const periodicityLabel = periodicityOption?.label || expense.periodicity;
                
                return (
                  <Tr key={expense.id} opacity={expense.isActive ? 1 : 0.6}>
                    <Td>
                      <Switch
                        isChecked={expense.isActive}
                        onChange={() => toggleExpense(expense.id)}
                        colorScheme="blue"
                      />
                    </Td>
                    <Td>{expense.description}</Td>
                    <Td>
                      <Badge colorScheme="red">{categoryName}</Badge>
                    </Td>
                    <Td isNumeric>${formatCurrency(expense.amount)}</Td>
                    <Td>{periodicityLabel}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Breakdown by category */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        border="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={4}>
          Breakdown by category
        </Heading>
        <Divider mb={4} />
        {breakdownData.length === 0 ? (
          <Text color="gray.500">No transactions to show</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th isNumeric>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {breakdownData.map((row) => (
                <Tr key={row.category}>
                  <Td>
                    <Badge>{row.category}</Badge>
                  </Td>
                  <Td
                    isNumeric
                    color={row.amount >= 0 ? 'green.500' : 'red.500'}
                    fontWeight="bold"
                  >
                    {row.amount >= 0 ? '+' : ''}${formatCurrency(row.amount)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </VStack>
  );
};

export default Dashboard;

