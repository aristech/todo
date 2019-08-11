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
        add_action('rest_api_init', function () {
            register_rest_route('aris/v1', '/task', array(
                'methods' => 'POST',
                'callback' => array($this, 'add_todo')
            ));
        });
    }
}

if (class_exists('Todo')) {
    $Todo = new Todo();
    $Todo->register();
}
