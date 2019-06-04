<?php

namespace Drupal\gbv_reports_events\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'events & news' block.
 *
 * @Block(
 *   id = "reports_events_block",
 *   admin_label = @Translation("Events & Report block"),
 *   category = @Translation("Events & Report block")
 * )
 */
class ReportEventBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [
      '#theme' => 'gbv_reports_events-block',
      '#attached' => [
        'library' => ['gbv_reports_events/gbvreportsevents'],
      ],
      '#cache' => ['max-age' => 0]
    ];
    return $build;
  }

}
