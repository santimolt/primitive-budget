// Validate imported data structure
export function validateImportedData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'File does not contain valid data' };
  }

  const requiredFields = ['incomes', 'expenses', 'categories'];
  for (const field of requiredFields) {
    if (!Array.isArray(data[field])) {
      return { valid: false, error: `Field '${field}' must be an array` };
    }
  }

  // Validate transaction structure
  const validateTransaction = (transaction, type) => {
    const required = ['id', 'amount', 'description', 'category', 'periodicity'];
    for (const field of required) {
      if (!(field in transaction)) {
        return { valid: false, error: `Invalid transaction: missing field '${field}'` };
      }
    }
    if (type === 'expense' && !('isActive' in transaction)) {
      return { valid: false, error: 'Invalid expense: missing field \'isActive\'' };
    }
    return { valid: true };
  };

  for (const income of data.incomes) {
    const validation = validateTransaction(income, 'income');
    if (!validation.valid) return validation;
  }

  for (const expense of data.expenses) {
    const validation = validateTransaction(expense, 'expense');
    if (!validation.valid) return validation;
  }

  // Validate categories
  for (const category of data.categories) {
    if (!category.id || !category.name || !category.type) {
      return { valid: false, error: 'Invalid category: missing required fields' };
    }
  }

  return { valid: true };
}

// Export data to JSON
export function exportToJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `budget-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import data from file
export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validation = validateImportedData(data);
        if (validation.valid) {
          resolve(data);
        } else {
          reject(new Error(validation.error));
        }
      } catch (error) {
        reject(new Error('Error parsing JSON file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

