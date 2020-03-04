//utilities
import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {CSSTransition} from "react-transition-group";

//style
import "./App.css";

//components
import ModalBackdrop from "UI/ModalBackdrop";
import modalContext from "Contexts/modalContext";

//layouts
import Layout from "./Layouts/Layout";

//routes
import ChoseOperator from "./Routes/ChoseOperator"
import AdminCalendar from "./Routes/AdminCalendar";
import UserCalendar from "./Routes/UserCalendar";
import AddDDT from "./Routes/AddDDT";
import NotFound from "./Routes/404";

class App extends Component {
	state = {
		modal: {
			isDismissable: true,
			message: "",
			buttons: [],
			title: "",
			class: {},
			style: {},
			isActive: false
		}
	};

	displayModal = obj =>
		this.setState({
			modal: {
				...this.state.modal,
				isDismissable: obj.isDismissable || true,
				message: obj.message,
				buttons: obj.buttons,
				title: obj.title || "",
				class: obj.class || {},
				style: obj.style || {},
				isActive: true
			}
		});

	dismissModal = () =>
		this.setState({
			modal: {
				...this.state.modal,
				isActive: false
			}
		});

	resetModal = () =>
		this.setState({
			modal: {
				...this.state.modal,
				isDismissable: true,
				message: "",
				buttons: [],
				title: "",
				class: {},
				style: {}
			}
		});

	render = () => (
		<modalContext.Provider
			value={{
				...this.state.modal,
				displayModal: this.displayModal,
				dismissModal: this.dismissModal
			}}
		>
			<CSSTransition
				in={this.state.modal.isActive}
				timeout={300}
				classNames="modal"
				unmountOnExit
				appear
				onExited={this.resetModal}
			>
				<ModalBackdrop />
			</CSSTransition>
			<Router>
				<Route exact path="/*">
					<Layout>
						<Switch>
							<Route exact path="/" component={ChoseOperator} />
							<Route path="/admin-calendar" component={AdminCalendar} />
							<Route path="/add-ddt" component={AddDDT} />
							<Route path="/user-calendar" component={UserCalendar} />
							<Route component={NotFound} />
						</Switch>
					</Layout>
				</Route>
			</Router>
		</modalContext.Provider>
	);
}

export default App;
