<?php

namespace Drupal\gbv_global_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\gbv_global_map\Controller\MapController;

/**
 * Provides a 'global map' block.
 *
 * @Block(
 *   id = "global_map_block",
 *   admin_label = @Translation("Global Map block"),
 *   category = @Translation("Global Map block")
 * )
 */
class MapBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $items = [];
    $data = MapController::getData();

    return [
      '#items' => $items,
      '#theme' => 'gbv_global_map-map',
      '#attached' => [
        'drupalSettings' => [
          'mapData' => $data['mapData'],
          'accessToken' => getenv(MAPBOX_ACCESS_TOKEN),
          'mapStyle' => getenv(MAPBOX_STYLE_URL),
        ],
        'library' => ['gbv_global_map/mapboxgl', 'gbv_global_map/gbvglobalmap'],
      ],
    ];
  }

}
