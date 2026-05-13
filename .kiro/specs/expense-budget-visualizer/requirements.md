# Requirements Document

## Introduction

The Expense & Budget Visualizer is a vanilla JavaScript single-page web application that helps users track personal spending, manage a budget, and visualize financial data. The existing app supports adding and deleting transactions with a name, amount, and category (Food, Transport, Fun), displays a running total balance, shows a pie chart of spending by category via Chart.js, and persists data to localStorage.

This feature spec covers enhancements to the existing app to make it a more complete budgeting tool: income vs. expense tracking, per-category budget limits, richer chart visualizations, filtering and sorting of transactions, and improved data management.

---

## Glossary

- **App**: The Expense & Budget Visualizer single-page web application.
- **Transaction**: A single financial record with a name, amount, type (income or expense), and category.
- **Income**: A transaction with a positive monetary value representing money received.
- **Expense**: A transaction with a negative monetary value representing money spent.
- **Balance**: The net sum of all income amounts minus all expense amounts.
- **Category**: A label assigned to a transaction. Valid categories are Food, Transport, Fun, and Other.
- **Budget**: A user-defined monthly spending limit assigned to a specific category.
- **Budget_Manager**: The component responsible for storing, retrieving, and comparing category budgets against actual spending.
- **Transaction_Manager**: The component responsible for adding, deleting, filtering, sorting, and persisting transactions.
- **Chart_Renderer**: The component responsible for rendering Chart.js visualizations.
- **Storage**: The browser's localStorage used to persist all application data.
- **Filter**: A user-selected criterion (date range, category, or type) used to narrow the displayed transaction list.
- **Summary_Panel**: The UI section displaying balance, total income, total expenses, and per-category spending summaries.

---

## Requirements

### Requirement 1: Income and Expense Transaction Types

**User Story:** As a user, I want to record both income and expense transactions, so that I can track money coming in and going out and see my true net balance.

#### Acceptance Criteria

1. THE Transaction_Manager SHALL support two transaction types: "income" and "expense".
2. WHEN a user submits the Add Transaction form, THE Transaction_Manager SHALL require the user to select a transaction type of either "income" or "expense".
3. WHEN calculating the balance, THE App SHALL compute the balance as the sum of all income amounts minus the sum of all expense amounts.
4. WHEN the balance is positive, THE Summary_Panel SHALL display the balance value in green.
5. WHEN the balance is negative, THE Summary_Panel SHALL display the balance value in red.
6. THE Summary_Panel SHALL display total income and total expenses as separate labeled values alongside the net balance.

---

### Requirement 2: Transaction Form Validation

**User Story:** As a user, I want the app to validate my input before saving a transaction, so that I don't accidentally save incomplete or invalid data.

#### Acceptance Criteria

1. WHEN a user submits the Add Transaction form with an empty name field, THE App SHALL display an inline validation message reading "Item name is required" and SHALL NOT save the transaction.
2. WHEN a user submits the Add Transaction form with an empty amount field, THE App SHALL display an inline validation message reading "Amount is required" and SHALL NOT save the transaction.
3. WHEN a user submits the Add Transaction form with an amount value less than or equal to zero, THE App SHALL display an inline validation message reading "Amount must be greater than zero" and SHALL NOT save the transaction.
4. WHEN a user submits the Add Transaction form with an amount value that is not a valid number, THE App SHALL display an inline validation message reading "Amount must be a valid number" and SHALL NOT save the transaction.
5. WHEN a user submits a valid transaction, THE App SHALL clear all form fields and remove any previously displayed validation messages.

---

### Requirement 3: Category Management

**User Story:** As a user, I want to assign transactions to categories and have an "Other" catch-all option, so that all spending can be categorized without being forced into an ill-fitting label.

#### Acceptance Criteria

1. THE Transaction_Manager SHALL support the following categories: Food, Transport, Fun, and Other.
2. WHEN a user adds a transaction without selecting a category, THE Transaction_Manager SHALL assign the category "Other" by default.
3. THE Chart_Renderer SHALL include all four categories (Food, Transport, Fun, Other) in all category-based visualizations.

---

### Requirement 4: Per-Category Budget Limits

**User Story:** As a user, I want to set a monthly spending limit for each category, so that I can be alerted when I am approaching or have exceeded my budget.

#### Acceptance Criteria

1. THE Budget_Manager SHALL allow the user to set a numeric monthly budget limit for each category (Food, Transport, Fun, Other).
2. WHEN a budget limit is set, THE Budget_Manager SHALL persist the budget limit to Storage.
3. WHEN the App loads, THE Budget_Manager SHALL retrieve all stored budget limits from Storage.
4. WHEN total expenses in a category reach 80% or more of that category's budget limit, THE Summary_Panel SHALL display a warning indicator for that category.
5. WHEN total expenses in a category exceed that category's budget limit, THE Summary_Panel SHALL display an over-budget indicator for that category.
6. WHEN no budget limit is set for a category, THE Summary_Panel SHALL display no budget indicator for that category.

---

### Requirement 5: Spending Visualizations

**User Story:** As a user, I want to see my spending broken down in multiple chart types, so that I can understand my financial patterns at a glance.

#### Acceptance Criteria

1. THE Chart_Renderer SHALL render a pie chart showing the proportion of total expenses by category.
2. THE Chart_Renderer SHALL render a bar chart showing total expenses per category alongside the budget limit for that category, when a budget limit has been set.
3. WHEN a category has no expenses, THE Chart_Renderer SHALL still include that category in the bar chart with a value of zero.
4. WHEN the user switches between chart types, THE Chart_Renderer SHALL destroy the existing chart instance before rendering the new chart.
5. THE Chart_Renderer SHALL update all charts immediately after any transaction is added or deleted.

---

### Requirement 6: Transaction List Filtering and Sorting

**User Story:** As a user, I want to filter and sort my transaction list, so that I can quickly find specific transactions and review spending patterns over time.

#### Acceptance Criteria

1. THE Transaction_Manager SHALL allow the user to filter the displayed transaction list by category, showing only transactions matching the selected category.
2. THE Transaction_Manager SHALL allow the user to filter the displayed transaction list by transaction type (income or expense).
3. THE Transaction_Manager SHALL allow the user to sort the displayed transaction list by date in ascending or descending order.
4. THE Transaction_Manager SHALL allow the user to sort the displayed transaction list by amount in ascending or descending order.
5. WHEN a filter or sort option is changed, THE App SHALL update the displayed transaction list immediately without a page reload.
6. WHEN a filter is active, THE App SHALL display a visible indicator showing which filter is applied.
7. WHEN all filters are cleared, THE Transaction_Manager SHALL display all transactions in the default order (most recently added first).

---

### Requirement 7: Transaction Deletion Confirmation

**User Story:** As a user, I want to confirm before deleting a transaction, so that I don't accidentally remove data I intended to keep.

#### Acceptance Criteria

1. WHEN a user clicks the Delete button on a transaction, THE App SHALL display a confirmation prompt before deleting the transaction.
2. WHEN the user confirms deletion, THE Transaction_Manager SHALL remove the transaction from the list and from Storage.
3. WHEN the user cancels deletion, THE Transaction_Manager SHALL retain the transaction unchanged.

---

### Requirement 8: Data Persistence

**User Story:** As a user, I want my transactions and budget settings to be saved automatically, so that my data is still available when I return to the app.

#### Acceptance Criteria

1. WHEN a transaction is added, THE Transaction_Manager SHALL save the updated transaction list to Storage within 100ms.
2. WHEN a transaction is deleted, THE Transaction_Manager SHALL save the updated transaction list to Storage within 100ms.
3. WHEN a budget limit is set or updated, THE Budget_Manager SHALL save the updated budget limits to Storage within 100ms.
4. WHEN the App loads, THE Transaction_Manager SHALL retrieve all transactions from Storage and render them before any user interaction is possible.
5. IF Storage is unavailable, THEN THE App SHALL display an error message reading "Unable to save data. Changes may not persist." and SHALL continue to operate in-memory for the current session.

---

### Requirement 9: Responsive Layout

**User Story:** As a user, I want the app to be usable on both desktop and mobile screens, so that I can track expenses from any device.

#### Acceptance Criteria

1. WHILE the viewport width is 600px or less, THE App SHALL stack all layout sections vertically in a single column.
2. WHILE the viewport width is greater than 600px, THE App SHALL display the transaction list and chart side by side in a two-column layout.
3. THE App SHALL render all interactive controls (buttons, inputs, selects) at a minimum touch target size of 44x44 CSS pixels on all viewport sizes.

---

### Requirement 10: Clear All Transactions

**User Story:** As a user, I want to clear all transactions at once, so that I can start fresh without manually deleting each entry.

#### Acceptance Criteria

1. THE App SHALL provide a "Clear All" control that removes all transactions from the list and from Storage.
2. WHEN the user activates the "Clear All" control, THE App SHALL display a confirmation prompt before deleting all transactions.
3. WHEN the user confirms the "Clear All" action, THE Transaction_Manager SHALL remove all transactions from Storage and render an empty transaction list.
4. WHEN the user cancels the "Clear All" action, THE Transaction_Manager SHALL retain all transactions unchanged.
5. WHEN the transaction list is empty, THE App SHALL display the message "No transactions yet." in the transaction list area.
