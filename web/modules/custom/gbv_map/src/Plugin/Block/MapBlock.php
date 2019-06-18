<?php

namespace Drupal\gbv_map\Plugin\Block;

use Drupal\Core\Cache\Cache;
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
      '#cache' => [
        'tags' => $this->getCacheTags(),
        'contexts' => $this->getCacheContexts(),
      ],
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

  /**
   * {@inheritdoc}
   */
  public function getCacheTags() {
    // With this when your node change your block will rebuild.
    if ($node = \Drupal::routeMatch()->getParameter('node')) {
      // If there is node add its cachetag.
      return Cache::mergeTags(parent::getCacheTags(), ['node:' . $node->id()]);
    }
    else {
      // Return default tags instead.
      return parent::getCacheTags();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts() {
    // If you depends on \Drupal::routeMatch()
    // you must set context of this block with 'route' context tag.
    // Every new route this block will rebuild.
    return Cache::mergeContexts(parent::getCacheContexts(), ['route']);
  }

}
