import './index.scss';
import { registerBlockType } from '@wordpress/blocks';
import {TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker} from '@wordpress/components';
// Importa componentes estruturaus de UI para o editor (barra direita do inspetor, controles superiores de blocos, alinhamento etc)
import {InspectorControls, BlockControls, AlignmentToolbar} from '@wordpress/block-editor'

(function(){

	let locked = false

	// Quando sobrescrevemos, usamos a versão mais nova dos dados
	// Chamada toda vez que qualquer coisa mude
	wp.data.subscribe(function(){
		// Vamos filtrar todos os blocos do editor, achar o nosso
		const results = wp.data.select("core/block-editor").getBlocks().filter(function(block){
			// e depois ver se o valor dele é undefined (sem resposta correta)
			return block.name == "ourplugin/are-you-paying-attention" && block.attributes.correctAnswer == undefined;
		})

		// Travando o botão de salvar
		if( results.length && locked == false){
			locked = true
			wp.data.dispatch("core/editor").lockPostSaving("noanswer")
		}

		// Destravando
		if( !results.length && locked){
			locked = false
			wp.data.dispatch("core/editor").unlockPostSaving("noanswer")
		}
	})
})()

registerBlockType('ourplugin/are-you-paying-attention', {
	title: 'Are you paying attention?',
	icon: 'smiley',
	category: 'common',
	attributes:{
		question: { type: "string"},
		answers: {type: "array", default: [""]},
		correctAnswer: {type: "number", default: undefined},
		bgColor: {type: "string", default: "#EBEBEB"},
		theAlignment: {type: "string", default: "left"}
	},
	description: "Just a description",
	example: {
		attributes:{
			question: "Test Question",
			answers: ["Number 1", "Number 2", "Number 3"],
			correctAnswer: 1,
			bgColor: "#EBEBEB",
			theAlignment: "left"
		}
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

		if( indextoDelete === props.attributes.correctAnswer){
			props.setAttributes({correctAnswer: undefined})
		}
	}

	function markAsCorrect(index){
		props.setAttributes({correctAnswer: index})
	}

	return (
		<div className="paying-attention-edit-block" style={{backgroundColor: props.attributes.bgColor}}>
			<BlockControls>
				<AlignmentToolbar value={props.attributes.theAlignment} onChange={x => props.setAttributes({theAlignment: x})} />
			</BlockControls>
			<InspectorControls>
				<PanelBody title='Background Color' initialOpen={true}>
					<PanelRow>
						<ColorPicker color={props.attributes.bgColor} onChangeComplete={x => props.setAttributes({bgColor: x.hex })} disableAlpha={true} />
					</PanelRow>
				</PanelBody>
			</InspectorControls>
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