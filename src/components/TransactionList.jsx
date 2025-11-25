import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Heading,
  HStack,
  Button,
  useToast,
  useColorModeValue,
  Divider,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import useBudgetStore from '../store/budgetStore';
import { PERIODICITY_OPTIONS } from '../utils/periodicity';
import { exportToJSON, importFromFile } from '../utils/exportImport';
import { formatCurrency } from '../utils/formatNumber';
import { useState } from 'react';

const TransactionList = () => {
  const {
    incomes,
    expenses,
    categories,
    deleteIncome,
    deleteExpense,
    updateIncome,
    updateExpense,
    exportData,
    importData,
  } = useBudgetStore();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    description: '',
    category: '',
    periodicity: 'monthly',
    customDays: 30,
  });

  const getCategoryName = (categoryId, type) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'No category';
  };

  const getPeriodicityLabel = (periodicity) => {
    const option = PERIODICITY_OPTIONS.find((opt) => opt.value === periodicity);
    return option?.label || periodicity;
  };

  const handleEditIncome = (income) => {
    setEditingTransaction({ ...income, type: 'income' });
    setEditForm({
      amount: income.amount.toString(),
      description: income.description,
      category: income.category,
      periodicity: income.periodicity,
      customDays: income.customDays || 30,
    });
    onOpen();
  };

  const handleEditExpense = (expense) => {
    setEditingTransaction({ ...expense, type: 'expense' });
    setEditForm({
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      periodicity: expense.periodicity,
      customDays: expense.customDays || 30,
    });
    onOpen();
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    const updates = {
      amount: parseFloat(editForm.amount),
      description: editForm.description,
      category: editForm.category,
      periodicity: editForm.periodicity,
      ...(editForm.periodicity === 'custom' && { customDays: parseInt(editForm.customDays) }),
    };

    if (editingTransaction.type === 'income') {
      updateIncome(editingTransaction.id, updates);
      toast({
        title: 'Income updated',
        description: 'Income has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      updateExpense(editingTransaction.id, updates);
      toast({
        title: 'Expense updated',
        description: 'Expense has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
    setEditingTransaction(null);
  };

  const handleDeleteIncome = (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      deleteIncome(id);
      toast({
        title: 'Income deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      toast({
        title: 'Expense deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

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

    // Reset input
    event.target.value = '';
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Transactions</Heading>
        <HStack>
          <Button onClick={handleExport} colorScheme="green" size="sm">
            Export JSON
          </Button>
          <Button as="label" colorScheme="blue" size="sm" cursor="pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </Button>
        </HStack>
      </HStack>

      <Box bg={bgColor} borderRadius="lg" boxShadow="md" mb={6} border="1px" borderColor={borderColor}>
        <Heading size="sm" p={4} pb={2}>
          Income ({incomes.length})
        </Heading>
        <Divider />
        {incomes.length === 0 ? (
          <Text p={4} color="gray.500">
            No income registered
          </Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Category</Th>
                <Th isNumeric>Amount</Th>
                <Th>Periodicity</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {incomes.map((income) => (
                <Tr key={income.id}>
                  <Td>{income.description}</Td>
                  <Td>
                    <Badge colorScheme="green">
                      {getCategoryName(income.category, 'income')}
                    </Badge>
                  </Td>
                  <Td isNumeric>${formatCurrency(income.amount)}</Td>
                  <Td>{getPeriodicityLabel(income.periodicity)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEditIncome(income)}
                        aria-label="Edit income"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteIncome(income.id)}
                        aria-label="Delete income"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Box bg={bgColor} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
        <Heading size="sm" p={4} pb={2}>
          Expenses ({expenses.length})
        </Heading>
        <Divider />
        {expenses.length === 0 ? (
          <Text p={4} color="gray.500">
            No expenses registered
          </Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Category</Th>
                <Th isNumeric>Amount</Th>
                <Th>Periodicity</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <Tr key={expense.id} opacity={expense.isActive ? 1 : 0.6}>
                  <Td>{expense.description}</Td>
                  <Td>
                    <Badge colorScheme="red">
                      {getCategoryName(expense.category, 'expense')}
                    </Badge>
                  </Td>
                  <Td isNumeric>${formatCurrency(expense.amount)}</Td>
                  <Td>{getPeriodicityLabel(expense.periodicity)}</Td>
                  <Td>
                    <Badge colorScheme={expense.isActive ? 'green' : 'gray'}>
                      {expense.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEditExpense(expense)}
                        aria-label="Edit expense"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteExpense(expense.id)}
                        aria-label="Delete expense"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Edit {editingTransaction?.type === 'income' ? 'income' : 'expense'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  value={editForm.amount}
                  onChange={(_, value) =>
                    setEditForm({ ...editForm, amount: value })
                  }
                  precision={2}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="e.g., Monthly salary, Rent, etc."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(
                      (cat) =>
                        cat.type === (editingTransaction?.type || 'income')
                    )
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Periodicity</FormLabel>
                <Select
                  value={editForm.periodicity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, periodicity: e.target.value })
                  }
                >
                  {PERIODICITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {editForm.periodicity === 'custom' && (
                <FormControl>
                  <FormLabel>Days in custom period</FormLabel>
                  <NumberInput
                    value={editForm.customDays}
                    onChange={(_, value) =>
                      setEditForm({ ...editForm, customDays: value })
                    }
                    min={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveEdit}>
              Save changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionList;

