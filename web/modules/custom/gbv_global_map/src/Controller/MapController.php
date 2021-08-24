<?php

namespace Drupal\gbv_global_map\Controller;

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
    $nids = Drupal::entityQuery('node')
      ->condition('type', 'global_map')
      ->condition('status', 1)
      ->execute();
    $nodes = Node::loadMultiple($nids);
    $data = [];
    $mapData = [];
    $index = 0;
    foreach ($nodes as $key => $node) {
      $mapData[$index]['body'] = $node->get('field_global_gbv_description')
        ->getValue()[0]['value'];
      $mapData[$index]['hrp_country'] = $node->get('field_hrp_country')
        ->getValue()[0]['value'];
      $mapData[$index]['country'] = $node->get('field_countries')
        ->getValue()[0]['value'];
      $mapData[$index]['uri'] = $node->get('field_global_country_page_url')
        ->getValue()[0]['uri'];
      $index++;
    }
    $data['mapData'] = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

  /**
   * {@inheritdoc}
   */
  public function getRegionalData($tid) {
    $serializer = Drupal::service('serializer');
    $countries = Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadChildren($tid);
    $region = Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->load($tid);
    foreach ($countries as $country) {
      $countries_data[] = [
        'id' => $country->tid->value,
        'name' => $country->name->value,
        'iso-2' => $country->field_country->value,
      ];
    }
    $mapData['region'] = $region_data = [
      'name' => $region->name->value,
      'description' => $region->description->value,
    ];
    $mapData['countries'] = $countries_data;
    $data['mapData'] = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }
  
  public function getCountryData($tid) {
    $serializer = Drupal::service('serializer');
    $country = Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->load($tid);
    $mapData = [
      'name' => $country->name->value,
      'description' => $country->description->value,
      'iso-2' => $country->field_country->value,
    ];
    $data['mapData'] = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }
}
