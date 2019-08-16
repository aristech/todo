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
        $this->url = plugin_dir_url(__FILE__);
    }

    function register()
    {
        require_once $this->path . 'post-types/task.php';
        add_action('wp_enqueue_scripts', array($this, 'wp_scripts'));
        add_shortcode('todo', array($this, 'shortcode_todo'));
        add_action('rest_api_init', function () {
            register_rest_route('aris/v1', '/data', array(
                'methods' => 'GET',
                'callback' => array($this, 'get_data')
            ));
            register_rest_route('aris/v1', '/task', array(
                'methods' => 'POST',
                'callback' => array($this, 'add_task')
            ));
            register_rest_route('aris/v1', '/deleteTask', array(
                'methods' => 'POST',
                'callback' => array($this, 'delete_task')
            ));
            register_rest_route('aris/v1', '/move_task', array(
                'methods' => 'POST',
                'callback' => array($this, 'move_task')
            ));
            register_rest_route('aris/v1', '/get_cats', array(
                'methods' => 'GET',
                'callback' => array($this, 'get_cats')
            ));
        });
    }

    function wp_scripts()
    {
        global $user_ID;

        wp_enqueue_style('task', $this->url . 'static/css/main.19bfba71.chunk.css');
        wp_enqueue_script('todo', $this->url . 'static/todo.js', array(), '0.0.1', true);
        wp_enqueue_script('chunk', $this->url . 'static/js/2.29d0387c.chunk.js', array(), '0.0.1', true);
        wp_enqueue_script('main', $this->url . 'static/js/main.344299b2.chunk.js', array(), '0.0.1', true);
        wp_localize_script('main', 'wpApiTodo', array(
            'usr' => $user_ID,
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }

    function shortcode_todo()
    {
        ob_start();
        echo '<noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>';
        $data = ob_get_contents();
        ob_end_clean();
        return $data;
    }

    function get_data(WP_REST_Request $request)
    {
        $posts_data = array();
        $post_type = 'task';
        $posts = get_posts(
            array(
                'post__not_in'      => get_option('sticky_posts'),
                'posts_per_page'    => -1,
                'post_type'         => array($post_type)
            )
        );

        foreach ($posts as $post) {
            $id = $post->ID;
            $posts_data[] = (object) array(
                'id' => $id,
                'title' => $post->post_title,
                'date' => $post->post_modified,
                'content' => wp_strip_all_tags($post->post_content),
                'category'    =>  get_the_category($id)[0]->name,
                'category_id'    =>  get_cat_ID('done')
            );
        }
        return $posts_data;
    }

    function add_task(WP_REST_Request $request)
    {
        $title = sanitize_text_field($request->get_param('title'));
        $description = sanitize_text_field($request->get_param('description'));
        $new_post = array(
            'post_title' => $title,
            'post_content' => $description,
            'post_status' => 'publish',
            'post_type' => 'task',
            'post_category' => array(get_cat_ID('start')),
            'post_author'  => 1,
            'post_date' => date('Y-m-d H:i:s')
        );
        $post = wp_insert_post($new_post);


        return  $post;
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

    function move_task(WP_REST_Request $request)
    {

        $postId = (int) $request->get_param('postId');
        $catName = get_cat_ID($request->get_param('category'));
        $moved_post = array(
            'ID'           => $postId,
            'post_category' => array($catName),
        );

        // Update the post into the database
        wp_update_post($moved_post);

        return  get_cat_ID($catName);
    }

    function get_cats()
    {
        $customPostTaxonomies = get_object_taxonomies('task');
        $cats = array();
        if (count($customPostTaxonomies) > 0) {
            foreach ($customPostTaxonomies as $tax) {
                $args = array(
                    'show_emty' => false,
                    'hide_empty' => true,
                    'orderby' => 'id',
                    'taxonomy' => $tax,
                    'echo' => 0

                );

                $cats[] = wp_list_categories($args);
            }
        }
        return $cats;
    }
}

if (class_exists('Todo')) {
    $Todo = new Todo();
    $Todo->register();
}
