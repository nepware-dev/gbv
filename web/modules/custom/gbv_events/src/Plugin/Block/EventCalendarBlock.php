<?php

namespace Drupal\gbv_events\Plugin\Block;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Block\BlockBase;
use Drupal\gbv_events\Controller\EventController;

/**
 * Provides a 'calendar' block.
 *
 * @Block(
 *   id = "event_calendar_block",
 *   admin_label = @Translation("Event Calendar block"),
 *   category = @Translation("Event Calendar block")
 * )
 */
class EventCalendarBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $items = [];
    $calendarEvents = EventController::getData();
    return [
      '#items' => $items,
      '#theme' => 'gbv_events-events',
      '#cache' => [
        'tags' => $this->getCacheTags(),
        'contexts' => $this->getCacheContexts(),
      ],
      '#attached' => [
        'drupalSettings' => [
          'calendarEvents' => $calendarEvents
        ],
        'library' => ['gbv_events/eventcalendar'],
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
