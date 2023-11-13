import './index.scss';
// import metadata evita de ter que passar o nome do bloco em registerBlockType
// webpack é responsável por reunir esses dados
import metadata from '../block.json';
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit'

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

registerBlockType( metadata, { //metadata é o block.json
	edit,
	save: function (props) { // preciso mesmo passar props?
		return null;
	},
});
