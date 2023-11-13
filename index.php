<?php
/*
Plugin Name: Are you paying attention Quiz
Description: Description
Version: 1.0
Author: Marcelo
Author URI: https://google.com
*/

if( ! defined( 'ABSPATH' ) ) exit;

class AreYouPaying{
	function __construct(){
		add_action('init', array( $this, 'adminAssets'));
	}

	function adminAssets(){
		// block.json: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
		register_block_type( __DIR__ , array(
			// Renderizando o frontend com PHP ao invés de JSX
			'render_callback' => array( $this, 'renderHTML')
		));
	}

	// $attr são as props (attributs)
	function renderHTML($attr){
		ob_start(); ?>
		<div class="paying-attention-update-me">
			<pre style="display: none;"><?php echo wp_json_encode($attr); ?></pre>
		</div>
		<?php return ob_get_clean();
	}
}

$areyoupaying = new AreYouPaying();
