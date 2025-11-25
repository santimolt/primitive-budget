import { create } from 'zustand';
import { calculateMonthlyAmount } from '../utils/periodicity';

// Predefined categories
const DEFAULT_CATEGORIES = [
  // Income categories
  { id: 'salary', name: 'Salary', type: 'income', isDefault: true },
  { id: 'other-income', name: 'Other income', type: 'income', isDefault: true },
  
  // Expense categories
  { id: 'food', name: 'Food', type: 'expense', isDefault: true },
  { id: 'transport', name: 'Transport', type: 'expense', isDefault: true },
  { id: 'housing', name: 'Housing', type: 'expense', isDefault: true },
  { id: 'health', name: 'Health', type: 'expense', isDefault: true },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', isDefault: true },
];

const useBudgetStore = create((set, get) => ({
  // Initial state
  incomes: [],
  expenses: [],
  categories: [...DEFAULT_CATEGORIES],

  // Income actions
  addIncome: (income) => {
    const newIncome = {
      id: Date.now().toString(),
      ...income,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      incomes: [...state.incomes, newIncome],
    }));
  },

  updateIncome: (id, updates) => {
    set((state) => ({
      incomes: state.incomes.map((income) =>
        income.id === id ? { ...income, ...updates } : income
      ),
    }));
  },

  deleteIncome: (id) => {
    set((state) => ({
      incomes: state.incomes.filter((income) => income.id !== id),
    }));
  },

  // Expense actions
  addExpense: (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      isActive: true,
      ...expense,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      expenses: [...state.expenses, newExpense],
    }));
  },

  updateExpense: (id, updates) => {
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      ),
    }));
  },

  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }));
  },

  toggleExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id ? { ...expense, isActive: !expense.isActive } : expense
      ),
    }));
  },

  // Category actions
  addCategory: (category) => {
    const newCategory = {
      id: Date.now().toString(),
      isDefault: false,
      ...category,
    };
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
  },

  deleteCategory: (id) => {
    set((state) => {
      const category = state.categories.find((c) => c.id === id);
      if (category?.isDefault) {
        return state; // Don't allow deleting predefined categories
      }
      return {
        categories: state.categories.filter((c) => c.id !== id),
      };
    });
  },

  // Derived calculations
  getTotalMonthlyIncome: () => {
    const { incomes } = get();
    return incomes.reduce((total, income) => {
      return total + calculateMonthlyAmount(
        income.amount,
        income.periodicity,
        income.customDays
      );
    }, 0);
  },

  getTotalMonthlyExpenses: () => {
    const { expenses } = get();
    return expenses
      .filter((expense) => expense.isActive)
      .reduce((total, expense) => {
        return total + calculateMonthlyAmount(
          expense.amount,
          expense.periodicity,
          expense.customDays
        );
      }, 0);
  },

  getBalance: () => {
    const { getTotalMonthlyIncome, getTotalMonthlyExpenses } = get();
    return getTotalMonthlyIncome() - getTotalMonthlyExpenses();
  },

  // Export/Import
  exportData: () => {
    const { incomes, expenses, categories } = get();
    return { incomes, expenses, categories };
  },

  importData: (data) => {
    set({
      incomes: data.incomes || [],
      expenses: data.expenses || [],
      categories: [...DEFAULT_CATEGORIES, ...(data.categories?.filter(c => !c.isDefault) || [])],
    });
  },
}));

export default useBudgetStore;

