import React, { useState, useEffect } from "react";
import getState from "./flux.js";


// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);


// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// This will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		/*
		  EDIT THIS!
		  This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
		  you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
		  store, instead use actions, like this:
		*/
		useEffect(() => {
			if (state.store.token) {
				state.actions.getInstitutions();
				state.actions.getConnections();
				state.actions.getTransactions();
				state.actions.getBudgets();
				state.actions.getFixedExpenses();
				state.actions.getSources();
				state.actions.getBalance();
				state.actions.getCategories();
				
			}
			// Calling this function from the flux.js actions
		}, []);

		useEffect(() => {
				state.actions.setIncomeInStore();
				console.log('Esperando a que transactions esté disponible...');
			
		}, [state.store.transactions]); 

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
