<?php

/**
 * @package Todo
 * @version 0.0.1
 */
/*
Plugin Name: Todo
Plugin URI: https://aristech.gr/todo/
Description: This is just a plugin
Author: aris
Version: 0.0.1
Author URI: https://aristech.gr/
*/
if (!defined('ABSPATH')) {
    die;
}

class Todo
{
    function __construct()
    {
        $this->path = plugin_dir_path(__FILE__);
    }

    function register()
    {
        require_once $this->path . 'post-types/task.php';
        add_action('wp_enqueue_scripts', 'wp_scripts');
        add_action('rest_api_init', function () {
            register_rest_route('aris/v1', '/task', array(
                'methods' => 'POST',
                'callback' => array($this, 'add_task')
            ));
            register_rest_route('aris/v1', '/deleteTask', array(
                'methods' => 'post',
                'callback' => 'delete_task',
            ));
        });
    }

    function wp_scripts()
    {
        global $user_ID;

        wp_localize_script('main', 'wpApiTodo', array(
            'usr' => $user_ID,
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }

    function add_task(WP_REST_Request $request)
    {
        $title = sanitize_text_field($request->get_param('title'));
        $new_post = array(
            'post_title' => $title,
            'post_content' => 'just a dummy text',
            'post_status' => 'publish',
            'post_type' => 'task',
            'post_author'  => 1,
            'post_date' => date('Y-m-d H:i:s')
        );
        wp_insert_post($new_post);

        $req = new WP_REST_Request('GET', '/wp/v2/task');
        $response = rest_do_request($req);
        $server = rest_get_server();
        $data = $server->response_to_data($response, false);
        return  $data;
    }

    function delete_task(WP_REST_Request $request)
    {

        $postId = (int) $request->get_param('postId');

        wp_delete_post($postId);
        $req = new WP_REST_Request('GET', '/wp/v2/task');
        $response = rest_do_request($req);
        $server = rest_get_server();
        $data = $server->response_to_data($response, false);
        return  $data;
    }
}

if (class_exists('Todo')) {
    $Todo = new Todo();
    $Todo->register();
}
