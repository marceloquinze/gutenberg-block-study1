import './index.scss';
import {TextControl, Flex, FlexBlock, FlexItem, Button, Icon} from '@wordpress/components';

wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
	title: 'Are you paying attention?',
	icon: 'smiley',
	category: 'common',
	attributes:{
		question: { type: "string"},
		answers: {type: "array", default: [""]},
		correctAnswer: {type: "number", default: undefined}
	},
	edit: Edit,
	save: function (props) {
		return null;
	},
});


function Edit (props) {
	function updateQuestion(value){
		props.setAttributes({question: value})
	}

	function deleteAnswer(indextoDelete){
		// cria um novo array com tudo o que tem dentro da props answers
		// adiciona um filtro removendo apenas o índice atual
		const newAnswers = props.attributes.answers.filter( (x, index) => {
			// retorna um array somente onde os items não sejam os mesmos que indextoDelete
			return index !== indextoDelete
		})
		// retorna o novo array com os valores e coloca dentro da prop answers
		props.setAttributes({ answers: newAnswers})
	}

	function markAsCorrect(index){
		props.setAttributes({correctAnswer: index})
	}

	return (
		<div className="paying-attention-edit-block">
			<TextControl label='Question: ' value={props.attributes.question} onChange={updateQuestion} style={{fontSize:"20px"}} />
			<p style={{fontSize: "13px", margin: "20px 0 8px 0"}}>Answers:</p>
			{props.attributes.answers.map(
				(answer, index) => {
					return(
						<Flex>
							<FlexBlock>
								<TextControl autoFocus={answer == undefined} value={answer} onChange={ newValue =>{
									// faz uma cópia do array answers (prop) e usa concat pra adicionar ESTE elemento ao array original, mas criando um novo array
									const newAnswers =  props.attributes.answers.concat([]);
									// novo valor adicionado ao novo array
									newAnswers[index] = newValue;
									// props.setAttribute sempre tem para cada onChange, onClick etc
									// retorna o novo array com os valores e coloca dentro da prop answers
									props.setAttributes({answers: newAnswers})
								}} />
							</FlexBlock>
							<FlexItem>
								<Button onClick={() => markAsCorrect(index)}>
									<Icon className="correct" icon={props.attributes.correctAnswer === index ? 'star-filled' : 'star-empty'} />
								</Button>
							</FlexItem>
							<FlexItem>
								<Button isLink className="attention-delete" onClick={ () => deleteAnswer(index)}>Delete</Button>
							</FlexItem>
						</Flex>
					)
				}
			)}
			<Button isPrimary onClick={ () => {
				// setAttributes pode ser chamada aqui diretamente
				props.setAttributes({answers: props.attributes.answers.concat([undefined])})
			}}>Add another answer</Button>
		</div>
	);
}