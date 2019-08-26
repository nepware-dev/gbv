<?php

namespace Drupal\gbv_reports_events\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal;
use DateTime;

/**
 * Class ReportsEventsController.
 *
 * @package Drupal\gbv_reports_events\Controller
 */
class ReportsEventsController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function getUpcomingEvent() {
    $event = NULL;
    $timezone = drupal_get_user_timezone();
    $start = new DateTime('now', new \DateTimezone($timezone));
    // To fix not fetching todays event.
    $start->modify('-1 day');
    $start->setTime(00, 00);
    $event_query = Drupal::entityQuery('node');
    $event_query
      ->condition('field_event_date', $start->format(DATETIME_DATETIME_STORAGE_FORMAT), '>=')
      ->condition('status', 1)
      ->sort('field_event_date', 'ASC');
    $event_results = $event_query->execute();
    if (count($event_results) > 0) {
      $event = Drupal::entityTypeManager()->getStorage('node')->load(reset($event_results));
    }
    return $event;
  }

  /**
   * {@inheritdoc}
   */
  public function getLatestReports() {
    $report_query = Drupal::entityQuery('node');
    $report_query->condition('type', 'gbv_reports')->sort('created', 'DESC')
      ->condition('status', 1)
      ->range(0, 3);
    $nids = $report_query->execute();
    $reports = Drupal::entityTypeManager()->getStorage('node')->loadMultiple($nids);
    return $reports;
  }

}
