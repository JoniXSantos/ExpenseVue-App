import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import '../../styles/transactions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faCircleArrowDown, faBuildingColumns, faChartLine, faTrashCan, faCreditCard, faMoneyBills, faPen } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from "../component/Spinner.jsx";
import { TransactionsChart } from "../component/TransactionsChart.jsx";
import { useNavigate } from "react-router-dom";

export const Transactions = () => {
	const { store, actions } = useContext(Context);
	const [name, setName] = useState('')
	const [type, setType] = useState('')
	const [category, setCategory] = useState('')
	const [source, setSource] = useState('')
	const [description, setDescription] = useState('')
	const [amount, setAmount] = useState('')
	const [date, setDate] = useState('')
	const [selectedFilterType, setSelectedFilterType] = useState(null);
	const [filterValue, setFilterValue] = useState('');
	const [filteredTransactions, setFilteredTransactions] = useState(store.transactions || []); // Estado de transacciones filtradas
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const transactionsPerPage = 10;

	const indexOfLastTransaction = currentPage * transactionsPerPage;
	const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
	const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
	const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		setFilteredTransactions(store.transactions);
	}, [store.transactions]);

	useEffect(() => {
		actions.getCategories();

	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();

		const transactionData = {
			name: name,
			type: type,
			category_id: category,
			source_id: source,
			description: description,
			amount: parseFloat(amount),
			date: date,
		}
		// console.log("Datos enviados:", transactionData);
		// console.log("este es token:", store.token);
		actions.createTransaction(transactionData)


		const modal = document.getElementById("NewTransactionModal");
		if (modal) {
			const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
			if (bootstrapModal) bootstrapModal.hide();
		}

		setName('');
		setType('');
		setDescription('');
		setAmount('');
		setDate('');
		setCategory('');
		setSource('');

		actions.getTransactions();
		navigate('/transactions')
	}

	const deleteTransaction = (id) => {
		actions.deleteTransaction(id);
	}

	const formatDate = (date) => {
		const parsedDate = new Date(date);
		const year = parsedDate.getFullYear();
		const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
		const day = String(parsedDate.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const editTransaction = async (item) => {
		const itemEdited = {
			id: item.id,
			name: item.name,
			type: item.type,
			category: item.category.id,
			source: item.source.id,
			description: item.description,
			amount: parseFloat(item.amount),
			date: formatDate(item.date),
		}
		actions.setCurrentTransaction(itemEdited)
		// console.log("this is the data to send to current transaction:", itemEdited)
		navigate('/edit-transaction');
		actions.getTransactions();
	}

	const applyFilter = (criteria, value) => {
		if (value === "") {
			setFilteredTransactions(store.transactions);
		} else {
			const filtered = store.transactions.filter((transaction) => {
				if (criteria === 'source') {
					return transaction.source && transaction.source.id === parseInt(value);
				} else if (criteria === 'category') {
					return transaction.category && transaction.category.id === parseInt(value);
				} else if (criteria === 'date') {
					return formatDate(transaction.date) === value;
				} else {
					return transaction[criteria] === value;
				}
			});
			setFilteredTransactions(filtered);
		}
	};

	const handleFilterSelection = (filterType) => {
		setSelectedFilterType(filterType);
		setFilterValue('');
		setFilteredTransactions(store.transactions);
	};

	const handleFilterValueChange = (event) => {
		const { value } = event.target;
		setFilterValue(value);
		applyFilter(selectedFilterType, value);
	};

	const clearFilters = () => {
		setSelectedFilterType(null);
		setFilterValue('');
		setFilteredTransactions(store.transactions);
	};

	const handleTransactions = () => {
		actions.getTransactions();
		actions.getCurrentTransaction();
	}

	return (
		<div className="transactions-container">
			<div>
				<header className="transactions-header">
					<div className="container my-4">
						<div className="row align-items-center">
							<div className="col">
								<h2>Transactions</h2>
								<p>Welcome to your transactions</p>
							</div>
							<div className="col-auto">
								<button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#NewTransactionModal" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>New Transaction</button>
								<div className="modal fade" id="NewTransactionModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
									<div className="modal-dialog">
										<div className="modal-content">
											<div className="modal-header">
												<h5 className="modal-title" id="exampleModalLabel" >New Transaction</h5>
												<button type="reset" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
											</div>
											<div className="modal-body">
												<form onSubmit={handleSubmit}>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerName">Name<span className="required">*</span></label>
														<input
															type="text"
															id="name"
															name="name"
															className="form-control"
															value={name}
															onChange={(event) => setName(event.target.value)}
															required
														/>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerType">Type of Transaction<span className="required">*</span></label>
														<select className="form-select" aria-label="Default select example" value={type}
															onChange={(event) => setType(event.target.value)} required>
															<option value="">Choose a type of Transaction</option>
															<option value="expense">expense</option>
															<option value="income">income</option>
														</select>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerCategory">Category:<span className="required">*</span></label>
														<select className="form-select" aria-label="Default select example" value={category} onChange={(e) => setCategory(e.target.value)} required>
															<option value="">Select a category</option>
															{store.categories && store.categories.map((cat) => (
																<option key={cat.id} value={cat.id}>{cat.name}</option>
															))}
														</select>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerCategory">Source:<span className="required">*</span></label>
														<select
															className="form-select"
															aria-label="Default select example"
															value={source}
															onChange={(e) => setSource(e.target.value)}
															required
														>
															<option value="">Select a source</option>
															{store.sources &&
																store.sources
																	.filter((source) => !source.yapily_id) // Filter out sources with yapily_id
																	.map((source) => (
																		<option key={source.id} value={source.id}>
																			{source.name}
																		</option>
																	))}
														</select>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label">Description:</label>
														<textarea
															className="form-control textarea"
															name="description"
															aria-label="With textarea"
															value={description}
															onChange={(event) => setDescription(event.target.value)}
														/>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerAmount">Amount<span className="required">*</span></label>
														<input
															type="text"
															id="amount"
															name="amount"
															className="form-control"
															value={amount}
															onChange={(event) => setAmount(event.target.value)}
															required
														/>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerDate">Date<span className="required">*</span></label>
														<input
															type="date"
															id="date"
															name="date"
															className="form-control"
															value={date}
															onChange={(event) => setDate(event.target.value)}
															required />
													</div>
													<div className="modal-footer">
														<button type="submit" className="btn" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} onClick={handleTransactions}>Create Transaction</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">

						<div className="col">
							<div className="row g-3">
								{/* Card Income */}
								<div className="col-12 col-md-4">
									<div className="card text-center p-3">
										{!store.balance || Object.keys(store.balance).length === 0 ? (
											<div>
												<FontAwesomeIcon icon={faCircleArrowUp} style={{ color: "#3eac65", fontSize: "2rem" }} />
												<p className="mt-2 mb-0">
													Income <br />
													€0
												</p>
											</div>
										) : (
											<div>
												<FontAwesomeIcon icon={faCircleArrowUp} style={{ color: "#3eac65", fontSize: "2rem" }} />
												<p className="mt-2 mb-0">
													Income <br />
													€{store.monthlyIncome}
												</p>
											</div>
										)}
									</div>
								</div>

								{/* Card Expenses */}
								<div className="col-12 col-md-4">
									<div className="card text-center p-3">
										{!store.balance || Object.keys(store.balance).length === 0 ? (
											<div>
												<FontAwesomeIcon icon={faCircleArrowDown} style={{ color: "#ea1a2f", fontSize: "2rem" }} />
												<p className="mt-2 mb-0">
													Expenses <br />
													€0
												</p>
											</div>
										) : (
											<div>
												<FontAwesomeIcon icon={faCircleArrowDown} style={{ color: "#ea1a2f", fontSize: "2rem" }} />
												<p className="mt-2 mb-0">
													Expenses <br />
													-€{store.monthlyExpense}
												</p>
											</div>
										)}
									</div>
								</div>

								{/* Card Balance */}
								<div className="col-12 col-md-4">
									<div className="card text-center p-3 align-items-center justify-content-center">
										{!store.balance || Object.keys(store.balance).length === 0 ? (
											<div>
												<FontAwesomeIcon icon={faChartLine} style={{ color: "#ea1a2f", fontSize: "2rem" }} />
												<p className="mt-2 mb-0">
													Balance <br />
													€0
												</p>
											</div>
										) : (
											<div>
												<FontAwesomeIcon icon={faChartLine} style={{ color: "#ea1a2f", fontSize: "2rem" }} />
												<p className="mt-2 mb-0">
													Balance <br />
													{store.totalBalance >= 0 ? (
														<>
															<span>€</span> {store.totalBalance}
														</>
													) : (
														<>
															<span style={{ color: 'red' }}>-€</span>
															<span style={{ color: 'red' }}>{Math.abs(store.totalBalance)}</span>
														</>
													)}
												</p>

											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

				</header>
				<TransactionsChart />
				<div className="d-flex align-items-center gap-2 mb-3">
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>
							Filter
						</button>
						<ul className="dropdown-menu bg-light" aria-labelledby="filterDropdown">
							<li><button className="dropdown-item" onClick={() => handleFilterSelection('type')}>Type</button></li>
							<li><button className="dropdown-item" onClick={() => handleFilterSelection('source')}>Source</button></li>
							<li><button className="dropdown-item" onClick={() => handleFilterSelection('category')}>Category</button></li>
							<li><button className="dropdown-item" onClick={() => handleFilterSelection('date')}>Date</button></li>
							<li><button className="dropdown-item" onClick={clearFilters}>Clear All Filters</button></li>
						</ul>
						{selectedFilterType && (
							<div className="mt-2">
								<label>{`Filter by ${selectedFilterType}`}</label>
								{selectedFilterType === 'date' ? (
									<input
										type="date"
										className="form-control mt-1"
										value={filterValue}
										onChange={handleFilterValueChange}
									/>
								) : (
									<select className="form-select mt-1" value={filterValue} onChange={handleFilterValueChange}>
										<option value="">Select an option</option>
										{selectedFilterType === 'type' && (
											<>
												<option value="income">Income</option>
												<option value="expense">Expense</option>
											</>
										)}
										{selectedFilterType === 'source' && store.sources && store.sources.map(source => (
											<option key={source.id} value={source.id}>{source.name}</option>
										))}
										{selectedFilterType === 'category' && store.categories && store.categories.map(cat => (
											<option key={cat.id} value={cat.id}>{cat.name}</option>
										))}
									</select>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="transactions-list card p-3 text-truncate" style={{ overflowX: 'auto' }}>
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h5>Transaction History</h5>
						{selectedFilterType && (
							<button
								className="btn btn-outline-danger m-1"
								onClick={clearFilters}
								title="Clear All Filters"
							>
								Clear Filters
							</button>
						)}
					</div>
					<table>
						<thead>
							<tr>
								<th colSpan="4" className="h5">Transaction Activity</th>
							</tr>
							<tr>
								<th>Transaction</th>
								<th>Description</th>
								<th>Type</th>
								<th>Date</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{!currentTransactions || currentTransactions.length === 0 ? (
								<tr>
									<td colSpan="7"> <div className="m-3 d-flex justify-content-center"> No Transactions Available </div></td>
								</tr>
							) : (
								currentTransactions.map((item, index) => (
									<tr key={item.id}>
										<td>{!item.name ? 'Transaction' : item.name}</td>
										<td>{!item.description ? 'This is a description for a Transaction' : item.description}</td>
										<td>
											{(() => {
												switch (item.source.type_source) {
													case 'bank_account':
														return <FontAwesomeIcon icon={faBuildingColumns} />;
													case 'credit_card':
														return <FontAwesomeIcon icon={faCreditCard} />;
													case 'debit_card':
														return <FontAwesomeIcon icon={faCreditCard} />;
													case 'manual_entry':
														return <FontAwesomeIcon icon={faMoneyBills} />;
													default:
														return null;
												}
											})()}
										</td>
										<td>{item.date}</td>
										<td className="amount">
											{item.type === 'income' ? `€${item.amount}` : `-€${item.amount}`}
										</td>
										<td> {item.source.type_source === 'manual_entry' ? <button type="button" onClick={() => editTransaction(item)} className="btn"> <FontAwesomeIcon icon={faPen} /> </button> : <FontAwesomeIcon icon={faPen} className="d-none" />}</td>
										<td> {item.source.type_source === 'manual_entry' ? <button type="button" className="btn" onClick={() => deleteTransaction(item.id)}> <FontAwesomeIcon icon={faTrashCan} /> </button> : <FontAwesomeIcon icon={faPen} className="d-none" />}</td>
									</tr>
								))
							)}
						</tbody>
					</table>

					<nav aria-label="Page navigation" className="mt-3">
						<ul className="pagination justify-content-center">
							<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
								<button
									className="page-link"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									style={{
										backgroundColor: "#2D3748",
										color: "white",
										border: "1px solid #2D3748",
									}}
								>
									Previous
								</button>
							</li>
							<li className="page-item">
								<span className="page-link" style={{ backgroundColor: "white", color: "#2D3748" }}>
									Page {currentPage} of {totalPages}
								</span>
							</li>
							<li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
								<button
									className="page-link"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									style={{
										backgroundColor: "#2D3748",
										color: "white",
										border: "1px solid #2D3748",
									}}
								>
									Next
								</button>
							</li>
						</ul>
					</nav>
				</div>

			</div>
		</div>
	);
};
