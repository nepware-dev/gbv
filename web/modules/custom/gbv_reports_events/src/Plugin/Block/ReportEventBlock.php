<?php

namespace Drupal\gbv_reports_events\Plugin\Block;

use Drupal\Core\Cache\Cache;
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
      '#cache' => [
        'tags' => $this->getCacheTags(),
        'contexts' => $this->getCacheContexts(),
      ],
    ];
    return $build;
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
