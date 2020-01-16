import React from 'react';
import NavBar from './Components/Navbar'

const layout = (props) => (
	<React.Fragment>
		<NavBar />
		<main>
			{props.children}
		</main>
	</React.Fragment>
);

export default layout;