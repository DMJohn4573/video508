<?php

/**
 * @file Admin functionality for the module
 */



/**
 * Form builder callback
 *
 * @param $form
 * @param $form_state
 * @return mixed
 * @todo - provide entity selection, or provide field selections.
 *
 *
 */
function video_508_settings_form($form, &$form_state) {
  // Pull content types, make a fieldset for each,
  // Each fieldset to choose fields for video, AD video, transcript etc.
  // Add some additional settings such as hiding transcripts etc...

  $selected_types = variable_get('video-508-types', array());
  $form['video-508-types'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Node types'),
    '#description' => t('Choose node types containing 508 compliant video'),

    '#options' => array(),
    '#default_value' => $selected_types,
  );

  $types = node_type_get_types();
  foreach ($types as $type => $info) {
    if ($info->disabled) {
      continue;
    }
    $type_form = video_508_type_settings_form($info);
    // if the content type does not fit requirements
    if (empty($type_form)) {
      continue;
    }
    $form['video-508-types']['#options'][$type] = $info->name;
    $form = array_merge($form, $type_form);
    $form["video-508-{$type}-options"]['#states'] = array(
      'visible' => array(
        ':input[name="video-508-types[' . $type . ']"]' => array('checked' => true),
      ),
    );
  }

  return system_settings_form($form);
}

/**
 * Builds node type options fieldset
 * @param $type stdClass Node type object
 * @return array Form array
 */
function video_508_type_settings_form($type) {

  $fields_info = field_info_instances('node', $type->type);
  foreach ($fields_info as $field_name => &$field) {
    $field_info = field_info_field($field_name);
    $field['field_type'] = $field_info['type'];
  }

  $file_fields = _video_508_field_options($fields_info, array('file', 'image'));

  // Bail if the content type has not file fields attached
  if (empty($file_fields)) {
    return null;
  }

  $link_fields = _video_508_field_options($fields_info, array('text', 'link_field'));
  $text_fields = _video_508_field_options($fields_info, array('text_long'));

  $nope = array('' => 'Not Used');

  $fs = "video-508-{$type->type}-options";
  $options = _video_508_options_defaults($fs);
  $form = array();
  $form[$fs] = array(
    '#type' => 'fieldset',
    '#title' => t($type->name),
    '#collapsible' => true,
    '#collapsed' => true,
    '#tree' => true,
    '#access' => true,
    'video' => array(
      '#type' => 'select',
      '#title' => t('Video file source field'),
      '#description' => t('Main video file'),
      '#options' => $file_fields,
      '#default_value' => $options['video'],
      '#required' => true,
    ),
    'video-ad' => array(
      '#type' => 'select',
      '#title' => t('AD Video file source field'),
      '#description' => t('Audio described video file'),
      '#options' => $nope + $file_fields,
      '#default_value' => $options['video-ad'],
    ),
    'captions' => array(
      '#type' => 'select',
      '#title' => t('Captions source field'),
      '#options' => $nope + $file_fields,
      '#default_value' => $options['captions'],
    ),
    'thumbnail' => array(
      '#type' => 'select',
      '#title' => t('Thumbnail source field'),
      '#options' => $nope + $file_fields,
      '#default_value' => $options['thumbnail'],
    ),
    'transcript' => array(
      '#type' => 'container',
      'source' => array(
        '#type' => 'select',
        '#title' => t('Transcript text source field'),
        '#options' => $nope + $text_fields,
        '#default_value' => $options['transcript']['source'],
      ),
      'hidden' => array(
        '#type' => 'checkbox',
        '#title' => t('Hide transcript by default'),
        '#default_value' => $options['transcript']['hidden'],
        '#states' => array(
          'invisible' => array(
            'select[name="' . $fs . '[transcript][source]"]' => array('value' => '')
          ),
        ),
      ),
    ),
    'youtube' => array(
      '#type' => 'select',
      '#title' => t('Youtube link source field'),
      '#options' => $nope + $link_fields,
      '#default_value' => $options['youtube'],
    ),
  );
  return $form;
}

/**
 * Formats select options for field types
 * @param array $fields Array if fields info
 * @param array $allowed Array of allowed field types
 * @return array name=>label array of allowed field types
 */
function _video_508_field_options($fields, $allowed = array()) {
  $data = array_filter($fields, array(new _video_508_field_options($allowed), 'callback'));
  return array_combine(array_keys($data), array_column($data, 'label'));
}

/**
 * Helper class used to filter fields based on their types
 */
class _video_508_field_options {
  // array of included types
  private $allowed;

  /**
   * Constructor
   * Initializes arguments for the cb callback
   * @param $arr
   */
  public function __construct($arr) {
    $this->allowed = $arr;
  }

  /**
   * Callback method
   * @param $field
   * @return bool
   */
  public function callback($field) {
    return in_array($field['field_type'], $this->allowed);
  }
}
