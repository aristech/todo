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
}

if (class_exists('Todo')) {
    $Todo = new Todo();
}
