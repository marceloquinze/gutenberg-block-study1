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
		wp_register_style( 'quizeditcss', plugin_dir_url( __FILE__ ) . 'build/index.css' );
		wp_register_script( 'ournewblocktype', plugin_dir_url( __FILE__ ) . 'build/index.js', array( 'wp-blocks', 'wp-element', 'wp-editor') );
		register_block_type('ourplugin/are-you-paying-attention', array(
			'editor_script' => 'ournewblocktype',
			'editor_style' => 'quizeditcss',
			'render_callback' => array( $this, 'theHTML')
		));
	}

	function theHTML($attr){
		if( !is_admin()){
			// wp-element contém a versão WP do React
			wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
			wp_enqueue_style('attentionFrontendStyles', plugin_dir_url(__FILE__) . 'build/frontend.css');
		}

		ob_start(); ?>
		<div class="paying-attention-update-me">
			<pre style="display: none;"><?php echo wp_json_encode($attr); ?></pre>
		</div>
		<?php return ob_get_clean();
	}
}

$areyoupaying = new AreYouPaying();
