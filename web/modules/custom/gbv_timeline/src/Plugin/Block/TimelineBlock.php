<?php

namespace Drupal\gbv_timeline\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'timeline' block.
 *
 * @Block(
 *   id = "timeline_block",
 *   admin_label = @Translation("Timeline block"),
 *   category = @Translation("Timeline block")
 * )
 */
class TimelineBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $items = [];
    return [
      '#items' => $items,
      '#theme' => 'gbv_timeline-timeline',
      '#attached' => [
        'library' => ['gbv_timeline/gbvtimeline'],
      ],
    ];
  }

}
