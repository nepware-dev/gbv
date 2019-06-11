<?php

namespace Drupal\gbv_events\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal;
use Drupal\node\Entity\Node;

/**
 * Class EventCalendarController.
 *
 * @package Drupal\gbv_events\Controller
 */
class EventController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function getData() {
    $serializer = Drupal::service('serializer');
    $nids = Drupal::entityQuery('node')->condition('type', 'gbv_events')->execute();
    $nodes = Node::loadMultiple($nids);
    $eventData = [];
    $index = 0;
    foreach ($nodes as $key => $node) {
      $eventData[$index]['title'] = $node->get('title')->getValue()[0]["value"];
      $eventData[$index]['start'] = $node->get('field_event_date')->getValue()[0]["value"];
      $eventData[$index]['end'] = $node->get('field_event_date')->getValue()[0]["end_value"];
      $index++;
    }
    $data = $serializer->serialize($eventData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

}
