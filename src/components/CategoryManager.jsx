import {
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  FormControl,
  FormLabel,
  Divider,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import useBudgetStore from '../store/budgetStore';

const CategoryManager = () => {
  const { categories, addCategory, deleteCategory } = useBudgetStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('income');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === newCategoryName.toLowerCase() && c.type === newCategoryType)) {
      toast({
        title: 'Error',
        description: 'A category with that name already exists for this type',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    addCategory({
      name: newCategoryName.trim(),
      type: newCategoryType,
    });

    toast({
      title: 'Category added',
      description: 'Category has been created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewCategoryName('');
  };

  const handleDeleteCategory = (id) => {
    const category = categories.find((c) => c.id === id);
    if (category?.isDefault) {
      toast({
        title: 'Error',
        description: 'Cannot delete predefined categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      toast({
        title: 'Category deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <VStack spacing={6} align="stretch">
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
        <Heading size="md" mb={4}>
          Add new category
        </Heading>
        <Divider mb={4} />
        <HStack spacing={4}>
          <FormControl flex={2}>
            <FormLabel>Name</FormLabel>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., Bonuses, Services, etc."
            />
          </FormControl>
          <FormControl flex={1}>
            <FormLabel>Type</FormLabel>
            <Select
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <Button
            onClick={handleAddCategory}
            colorScheme="blue"
            mt={8}
            size="lg"
          >
            Add
          </Button>
        </HStack>
      </Box>

      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
        <Heading size="md" mb={4}>
          Income categories ({incomeCategories.length})
        </Heading>
        <Divider mb={4} />
        {incomeCategories.length === 0 ? (
          <Text color="gray.500">No income categories</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {incomeCategories.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.name}</Td>
                  <Td>
                    <Badge colorScheme="green">Income</Badge>
                  </Td>
                  <Td>
                    {category.isDefault ? (
                      <Badge colorScheme="blue">Predefined</Badge>
                    ) : (
                      <Badge colorScheme="gray">Custom</Badge>
                    )}
                  </Td>
                  <Td>
                    {!category.isDefault && (
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                        aria-label="Delete category"
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
        <Heading size="md" mb={4}>
          Expense categories ({expenseCategories.length})
        </Heading>
        <Divider mb={4} />
        {expenseCategories.length === 0 ? (
          <Text color="gray.500">No expense categories</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenseCategories.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.name}</Td>
                  <Td>
                    <Badge colorScheme="red">Expense</Badge>
                  </Td>
                  <Td>
                    {category.isDefault ? (
                      <Badge colorScheme="blue">Predefined</Badge>
                    ) : (
                      <Badge colorScheme="gray">Custom</Badge>
                    )}
                  </Td>
                  <Td>
                    {!category.isDefault && (
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                        aria-label="Delete category"
                      />
                    )}
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

export default CategoryManager;

