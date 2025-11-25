# 💰 Primitive Budget

A modern web application to manage your personal budget, record income and expenses, and visualize your financial situation clearly and intuitively.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.8.2-319795?logo=chakra-ui)
![Zustand](https://img.shields.io/badge/Zustand-4.4.7-FF6B6B)

## ✨ Features

- 📊 **Complete Dashboard**: Visualize your monthly balance, income, expenses and breakdown by categories
- 💵 **Transaction Management**: Record, edit and delete income and expenses with amount, description and category
- 🔄 **Flexible Periodicity**: Configure transactions as daily, weekly, monthly, yearly, one-time or custom
- 🏷️ **Category System**: Predefined categories and ability to create custom categories
- 🔘 **Expense Toggle**: Activate or deactivate expenses from the dashboard to see how they affect your budget in real time
- 📈 **Interactive Charts**: Visualize your data with donut charts (surplus vs expenses) and pie charts (distribution by category)
- 💾 **Export/Import**: Save and load your data in JSON format
- 🌓 **Dark Mode**: Interface with support for light and dark mode
- 💰 **Number Formatting**: Automatic formatting with thousands separators and decimals

## 🚀 Technologies

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Chakra UI 2.8.2** - Component system
- **Zustand 4.4.7** - State management
- **Recharts 2.10.3** - Charts and visualizations
- **React Hook Form 7.48.2** - Form handling

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/tu-usuario/budget-primitivo.git
cd budget-primitivo
```

Or download the code as ZIP and extract it.

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

## 📖 Usage

### Add Transactions

1. Navigate to the **Transactions** tab
2. Complete the form:
   - Select the type (Income or Expense)
   - Enter the amount
   - Add a description
   - Select a category
   - Choose the periodicity
3. Click **Add**

### Manage Categories

1. Go to the **Categories** tab
2. Predefined categories include:
   - **Income**: Salary, Other income
   - **Expenses**: Food, Transport, Housing, Health, Entertainment
3. Create new custom categories according to your needs

### Expense Toggle

- In the **Dashboard**, in the "Expense control" section, use the switch to activate/deactivate each expense
- Deactivated expenses are not included in the balance calculation
- Changes are reflected immediately in charts and statistics
- Useful for simulating scenarios and seeing how different expenses affect your budget

### Dashboard

The dashboard shows:
- **Monthly Balance**: Difference between income and active expenses
- **Donut Chart**: Visualization of remaining surplus vs expenses (or income vs expenses if there's a deficit)
- **Pie Chart**: Expense distribution by category with consistent colors
- **Expense Control**: Table with toggles to activate/deactivate expenses and see the impact in real time
- **Breakdown by Category**: Table with net amount per category (positive for income, negative for expenses)

### Export/Import Data

- **Export**: Click "Export JSON" to download all your data
- **Import**: Use "Import JSON" to load previously exported data
- Files are saved with format: `budget-YYYY-MM-DD.json`

## 📁 Project Structure

```
budget-primitivo/
├── src/
│   ├── components/
│   │   ├── CategoryManager.jsx    # Category management
│   │   ├── Dashboard.jsx          # Main view with statistics
│   │   ├── Layout.jsx              # Main layout with navigation
│   │   ├── TransactionForm.jsx     # Transaction form
│   │   └── TransactionList.jsx     # Transaction list
│   ├── store/
│   │   └── budgetStore.js          # Zustand store
│   ├── utils/
│   │   ├── exportImport.js         # Export/import functions
│   │   ├── formatNumber.js         # Number formatting with separators
│   │   └── periodicity.js          # Periodicity logic
│   ├── App.jsx                     # Main component
│   ├── main.jsx                    # Entry point
│   ├── theme.js                    # Theme configuration
│   └── index.css                   # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Periodicity

The system automatically calculates monthly amounts based on periodicity:

- **Daily**: Multiplies by 30 days
- **Weekly**: Multiplies by 4.33 weeks (monthly average)
- **Monthly**: Keeps the original amount
- **Yearly**: Divides by 12 months
- **Once**: Not counted in monthly calculation
- **Custom**: Converts according to specified days

## 🛠️ Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributions

Contributions are welcome! Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for more details.

## 👤 Author

**Santiago Moltedo**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)

> Note: Replace `tu-usuario` with your GitHub username when cloning the repository.

## 🙏 Acknowledgments

- [Chakra UI](https://chakra-ui.com/) for the components
- [Recharts](https://recharts.org/) for the visualizations
- [Zustand](https://github.com/pmndrs/zustand) for state management

---

⭐ If you like this project, give it a star!
