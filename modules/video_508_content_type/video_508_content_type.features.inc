<?php

/**
 * @file
 * video_508_content_type.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function video_508_content_type_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function video_508_content_type_node_info() {
  $items = array(
    'video508' => array(
      'name' => t('Video 508'),
      'base' => 'node_content',
      'description' => t('Boilerplate of a video content type'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
