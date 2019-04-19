<?php

namespace Drupal\gbv_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;

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
    return [
      '#type' => 'markup',
      '#markup' => 'This block shows the map.',
    ];
  }

}
