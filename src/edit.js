import {TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker} from '@wordpress/components';
// Importa componentes estruturaus de UI para o editor (barra direita do inspetor, controles superiores de blocos, alinhamento etc)
import {InspectorControls, BlockControls, AlignmentToolbar, useBlockProps} from '@wordpress/block-editor'

export default function edit (props) {
	const blockProps = useBlockProps({
		className: "paying-attention-edit-block",
		style: {backgroundColor: props.attributes.bgColor}
	});

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
			props.setAttributes({correctAnswer: null})
		}
	}

	function markAsCorrect(index){
		props.setAttributes({correctAnswer: index})
	}

	return (
		<div {...blockProps}>
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
								<TextControl autoFocus={answer == null} value={answer} onChange={ newValue =>{
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
				props.setAttributes({answers: props.attributes.answers.concat([null])})
			}}>Add another answer</Button>
		</div>
	);
}