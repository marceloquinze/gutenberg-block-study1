// React e ReactDOM importados via wp-element
// WP usa sua própria versão, evitando que React/DOM seja inserido em cada arquivo do plugin
import React from 'react'
import ReactDOM from 'react-dom'
import "./frontend.scss"

const divsToUpdate = document.querySelectorAll('.paying-attention-update-me');

divsToUpdate.forEach(
	div => {
		ReactDOM.render(<Quiz />, div)
		div.classList.remove('paying-attention-update-me')
	}
)

function Quiz(){
	return(
		<div className="paying-attention-frontend">
			Hello from React
		</div>
	)
}