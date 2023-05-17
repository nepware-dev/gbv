<?php

namespace Drupal\gbv_global_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\gbv_global_map\Controller\MapController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a 'country map' block.
 *
 * @Block(
 *   id = "country_map_block",
 *   admin_label = @Translation("Country Map block"),
 *   category = @Translation("Country Map block")
 * )
 */
class CountryMapBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $items = [];
    $tid = \Drupal::routeMatch()->getParameter('country');
    $data = MapController::getCountryData($tid);

    if (is_null($data)) {
      throw new NotFoundHttpException();
    }

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
          'gbv_global_map/gbvcountrymap',
        ],
      ],
    ];
  }

}
