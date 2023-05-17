<?php

namespace Drupal\gbv_global_map\Controller;

use Drupal\Core\Controller\ControllerBase;
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
  public static function getData() {
    $serializer = \Drupal::service('serializer');
    $nids = \Drupal::entityQuery('node')
      ->condition('type', 'global_map')
      ->condition('status', 1)
      ->execute();
    $nodes = Node::loadMultiple($nids);

    $manager = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term');
    $terms = $manager->loadTree("global_gbv", 0, NULL, TRUE);
    $countryColors = [];
    foreach ($terms as $term) {
      $parent = $manager->loadParents($term->id());
      $parent = reset($parent);
      $countryColors[$term->field_country->value] = $term->field_map_color->color ?? ($parent->get('field_map_color')[0]->color ?? '#63337c');
    }

    $data = [];
    $mapData = [];
    $index = 0;
    foreach ($nodes as $key => $node) {
      $mapData[$index]['body'] = $node->get('field_global_gbv_description')
        ->getValue() ? $node->get('field_global_gbv_description')->getValue()[0]['value'] : NULL;
      $mapData[$index]['hrp_country'] = $node->get('field_hrp_country')
        ->getValue()[0]['value'];
      $mapData[$index]['country'] = $node->get('field_countries')
        ->getValue()[0]['value'];
      $mapData[$index]['uri'] = $node->get('field_global_country_page_url')
        ->getValue() ? $node->get('field_global_country_page_url')->getValue()[0]['uri'] : NULL;
      $mapData[$index]['color_code'] = $countryColors[$node->get('field_countries')
        ->getValue()[0]['value']] ?? NULL;
      $index++;
    }
    $data['mapData'] = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

  /**
   * {@inheritdoc}
   */
  public static function getRegionalData($tid) {
    $serializer = \Drupal::service('serializer');
    $countries = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadChildren($tid);
    $region = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties(['vid' => 'global_gbv', 'tid' => $tid]);
    if (empty($region)) {
      return NULL;
    }
    $region = reset($region);
    if ($region->parent->target_id != '0') {
      return NULL;
    }
    foreach ($countries as $country) {
      $countries_data[] = [
        'id' => $country->tid->value,
        'name' => $country->name->value,
        'iso-2' => $country->field_country->value,
        'color-code' => $country->field_map_color[0]->color ?? ($region->get('field_map_color')[0]->color ?? '#A991B6'),
      ];
    }
    $mapData['region'] = $region_data = [
      'name' => $region->label(),
      'description' => $region->get('description')->value,
      'color-code' => $region->get('field_map_color')[0]->color,
    ];
    $mapData['countries'] = $countries_data;
    $data['mapData'] = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

  /**
   * {@inheritdoc}
   */
  public static function getCountryData($tid) {
    $serializer = \Drupal::service('serializer');
    $country = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties(['vid' => 'global_gbv', 'tid' => $tid]);
    if (empty($country)) {
      return NULL;
    }
    $country = reset($country);
    if ($country->parent->target_id == '0') {
      return NULL;
    }
    $mapData = [
      'name' => $country->label(),
      'description' => $country->get('description')->value,
      'iso-2' => $country->get('field_country')->value,
      'hr_info' => $country->get('field_hr_info')->uri,
      'color-code' => $country->get('field_map_color')[0]->color ?? NULL,
    ];
    $data['mapData'] = $serializer->serialize($mapData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

}
