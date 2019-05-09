<?php

namespace Drupal\gbv_map\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal;
use Drupal\node\Entity\Node;

/**
 * Class EventCalendarController.
 *
 * @package Drupal\event_calendar\Controller
 */
class MapController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function getData() {
    $serializer = Drupal::service('serializer');
    $nids = Drupal::entityQuery('node')->condition('type', 'gbv_map')->execute();
    $nodes = Node::loadMultiple($nids);
    $mapData = [];
    $index = 0;
    foreach ($nodes as $key => $node) {
      $mapData[$index]['body'] = $node->get('field_map_body')->getValue()[0]['value'];
      $mapData[$index]['country'] = $node->get('field_countries')->getValue()[0]['value'];
      $mapData[$index]['uri'] = $node->get('field_country_url')->getValue()[0]['uri'];
      $index++;
    }
    $data = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

}
