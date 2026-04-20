'use strict'
import { getData, setData } from "./storage.js";
import { users, expenses } from "./state.js";

const savedExpenses = getData('expenses') || [];