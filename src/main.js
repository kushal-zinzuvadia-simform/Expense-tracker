'use strict'
import { getData, setData } from "./storage.js";
import { users, expenses } from "./state.js";
import { initForm } from "./ui/form.js";
import { renderExpenses } from "./ui/expenseList.js";

expenses.push(...(getData('expenses') || []));

initForm();
renderExpenses();