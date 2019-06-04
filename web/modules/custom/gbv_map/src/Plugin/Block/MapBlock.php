<?php

namespace Drupal\gbv_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\gbv_map\Controller\MapController;

/**
 * Provides a 'map' block.
 *
 * @Block(
 *   id = "map_block",
 *   admin_label = @Translation("Map block"),
 *   category = @Translation("Map block")
 * )
 */
class MapBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $items = [];
    $mapData = MapController::getData();
    return [
      '#items' => $items,
      '#theme' => 'gbv_map-map',
      '#attached' => [
        'drupalSettings' => [
          'mapData' => $mapData,
          'accessToken' => getenv(MAPBOX_ACCESS_TOKEN),
          'mapStyle' => getenv(MAPBOX_STYLE_URL),
        ],
        'library' => ['gbv_map/mapboxgl', 'gbv_map/gbvmap'],
      ],
    ];
  }

}
