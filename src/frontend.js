// React e ReactDOM importados via wp-element
// WP usa sua própria versão, evitando que React/DOM seja inserido em cada arquivo do plugin
import React from 'react'
import ReactDOM from 'react-dom'
import "./frontend.scss"

const divsToUpdate = document.querySelectorAll('.paying-attention-update-me');

divsToUpdate.forEach(
	div => {
		const data = JSON.parse(div.querySelector("pre").innerHTML)
		ReactDOM.render(<Quiz {...data} />, div)
		div.classList.remove('paying-attention-update-me')
	}
)

function Quiz(props){
	return(
		<div className="paying-attention-frontend">
			<p>{props.question}</p>
			<ul>
				{props.answers.map(answer => <li>{answer}</li>)}
			</ul>
		</div>
	)
}