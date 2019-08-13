<?php

/**
 * Registers the `task` post type.
 */
function task_init()
{
    register_post_type('task', array(
        'labels'                => array(
            'name'                  => __('Tasks', 'todo'),
            'singular_name'         => __('Task', 'todo'),
            'all_items'             => __('All Tasks', 'todo'),
            'archives'              => __('Task Archives', 'todo'),
            'attributes'            => __('Task Attributes', 'todo'),
            'insert_into_item'      => __('Insert into Task', 'todo'),
            'uploaded_to_this_item' => __('Uploaded to this Task', 'todo'),
            'featured_image'        => _x('Featured Image', 'task', 'todo'),
            'set_featured_image'    => _x('Set featured image', 'task', 'todo'),
            'remove_featured_image' => _x('Remove featured image', 'task', 'todo'),
            'use_featured_image'    => _x('Use as featured image', 'task', 'todo'),
            'filter_items_list'     => __('Filter Tasks list', 'todo'),
            'items_list_navigation' => __('Tasks list navigation', 'todo'),
            'items_list'            => __('Tasks list', 'todo'),
            'new_item'              => __('New Task', 'todo'),
            'add_new'               => __('Add New', 'todo'),
            'add_new_item'          => __('Add New Task', 'todo'),
            'edit_item'             => __('Edit Task', 'todo'),
            'view_item'             => __('View Task', 'todo'),
            'view_items'            => __('View Tasks', 'todo'),
            'search_items'          => __('Search Tasks', 'todo'),
            'not_found'             => __('No Tasks found', 'todo'),
            'not_found_in_trash'    => __('No Tasks found in trash', 'todo'),
            'parent_item_colon'     => __('Parent Task:', 'todo'),
            'menu_name'             => __('Tasks', 'todo'),
        ),
        'public'                => true,
        'hierarchical'          => false,
        'show_ui'               => true,
        'show_in_nav_menus'     => true,
        'supports'              => array('title', 'editor'),
        'has_archive'           => true,
        'rewrite'               => true,
        'query_var'             => true,
        'menu_position'         => null,
        'menu_icon'             => 'dashicons-menu-alt3',
        'show_in_rest'          => true,
        'rest_base'             => 'task',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    ));
}
add_action('init', 'task_init');

/**
 * Sets the post updated messages for the `task` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `task` post type.
 */
function task_updated_messages($messages)
{
    global $post;

    $permalink = get_permalink($post);

    $messages['task'] = array(
        0  => '', // Unused. Messages start at index 1.
        /* translators: %s: post permalink */
        1  => sprintf(__('Task updated. <a target="_blank" href="%s">View Task</a>', 'todo'), esc_url($permalink)),
        2  => __('Custom field updated.', 'todo'),
        3  => __('Custom field deleted.', 'todo'),
        4  => __('Task updated.', 'todo'),
        /* translators: %s: date and time of the revision */
        5  => isset($_GET['revision']) ? sprintf(__('Task restored to revision from %s', 'todo'), wp_post_revision_title((int) $_GET['revision'], false)) : false,
        /* translators: %s: post permalink */
        6  => sprintf(__('Task published. <a href="%s">View Task</a>', 'todo'), esc_url($permalink)),
        7  => __('Task saved.', 'todo'),
        /* translators: %s: post permalink */
        8  => sprintf(__('Task submitted. <a target="_blank" href="%s">Preview Task</a>', 'todo'), esc_url(add_query_arg('preview', 'true', $permalink))),
        /* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
        9  => sprintf(
            __('Task scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview Task</a>', 'todo'),
            date_i18n(__('M j, Y @ G:i', 'todo'), strtotime($post->post_date)),
            esc_url($permalink)
        ),
        /* translators: %s: post permalink */
        10 => sprintf(__('Task draft updated. <a target="_blank" href="%s">Preview Task</a>', 'todo'), esc_url(add_query_arg('preview', 'true', $permalink))),
    );

    return $messages;
}
add_filter('post_updated_messages', 'task_updated_messages');
