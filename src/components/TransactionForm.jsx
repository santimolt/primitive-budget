import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Heading,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useBudgetStore from '../store/budgetStore';
import { PERIODICITY_OPTIONS } from '../utils/periodicity';

const TransactionForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { addIncome, addExpense, categories } = useBudgetStore();
  const [transactionType, setTransactionType] = useState('income');
  const [periodicity, setPeriodicity] = useState('monthly');
  const [customDays, setCustomDays] = useState(30);
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const availableCategories = categories.filter(
    (cat) => cat.type === transactionType
  );

  const onSubmit = (data) => {
    const transactionData = {
      amount: parseFloat(amount || data.amount || 0),
      description: data.description,
      category: data.category,
      periodicity: periodicity,
      ...(periodicity === 'custom' && { customDays: parseInt(customDays) }),
    };

    if (transactionType === 'income') {
      addIncome(transactionData);
      toast({
        title: 'Income added',
        description: 'Income has been registered successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      addExpense(transactionData);
      toast({
        title: 'Expense added',
        description: 'Expense has been registered successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    // Reset entire form
    reset({
      amount: '',
      description: '',
      category: '',
    });
    setAmount('');
    setPeriodicity('monthly');
    setCustomDays(30);
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      mb={6}
      border="1px"
      borderColor={borderColor}
    >
      <Heading size="md" mb={4}>
        New transaction
      </Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Transaction type</FormLabel>
            <Select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>

          <FormControl isRequired isInvalid={errors.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput 
              precision={2} 
              min={0}
              value={amount}
              onChange={(valueString, valueNumber) => {
                setAmount(valueString);
                // Update value in react-hook-form
                const event = { target: { name: 'amount', value: valueString } };
                register('amount').onChange(event);
              }}
            >
              <NumberInputField
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0, message: 'Amount must be greater than 0' },
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.amount && (
              <Box color="red.500" fontSize="sm" mt={1}>
                {errors.amount.message}
              </Box>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={errors.description}>
            <FormLabel>Description</FormLabel>
            <Input
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="e.g., Monthly salary, Rent, etc."
            />
            {errors.description && (
              <Box color="red.500" fontSize="sm" mt={1}>
                {errors.description.message}
              </Box>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={errors.category}>
            <FormLabel>Category</FormLabel>
            <Select
              {...register('category', {
                required: 'Category is required',
              })}
            >
              <option value="">Select a category</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.category && (
              <Box color="red.500" fontSize="sm" mt={1}>
                {errors.category.message}
              </Box>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Periodicity</FormLabel>
            <Select
              value={periodicity}
              onChange={(e) => setPeriodicity(e.target.value)}
            >
              {PERIODICITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {periodicity === 'custom' && (
            <FormControl>
              <FormLabel>Days in custom period</FormLabel>
              <NumberInput
                value={customDays}
                onChange={(_, value) => setCustomDays(value)}
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

          <HStack>
            <Button type="submit" colorScheme="blue" size="lg">
              Add {transactionType === 'income' ? 'income' : 'expense'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  amount: '',
                  description: '',
                  category: '',
                });
                setAmount('');
                setPeriodicity('monthly');
                setCustomDays(30);
              }}
            >
              Clear
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default TransactionForm;

