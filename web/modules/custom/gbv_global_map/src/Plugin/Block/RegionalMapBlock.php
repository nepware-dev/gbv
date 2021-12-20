<?php

namespace Drupal\gbv_global_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\gbv_global_map\Controller\MapController;

/**
 * Provides a 'regional map' block.
 *
 * @Block(
 *   id = "regional_map_block",
 *   admin_label = @Translation("Regional Map block"),
 *   category = @Translation("Regional Map block")
 * )
 */
class RegionalMapBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $items = [];
    $tid = \Drupal::routeMatch()->getParameter('region');
    $data = MapController::getRegionalData($tid);
    return [
      '#items' => $items,
      '#theme' => 'gbv_global_map-map',
      '#attached' => [
        'drupalSettings' => [
          'mapData' => $data['mapData'],
          'accessToken' => getenv('MAPBOX_ACCESS_TOKEN'),
          'mapStyle' => getenv('MAPBOX_STYLE_URL'),
        ],
        'library' => [
          'gbv_global_map/mapboxgl',
          'gbv_global_map/gbvregionalmap',
        ],
      ],
    ];
  }

}
