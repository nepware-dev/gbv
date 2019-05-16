<?php

namespace Drupal\gbv_events\Plugin\Block;

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
      '#attached' => [
        'drupalSettings' => [
          'calendarEvents' => $calendarEvents
        ],
        'library' => ['gbv_events/eventcalendar'],
      ],
    ];
  }

}
