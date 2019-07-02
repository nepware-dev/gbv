<?php

namespace Drupal\gbv_events\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal;
use Drupal\node\Entity\Node;

/**
 * Class EventCalendarController.
 *
 * @package Drupal\gbv_events\Controller
 */
class EventController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function getData() {
    $serializer = Drupal::service('serializer');
    $nids = Drupal::entityQuery('node')->condition('type', 'gbv_events')->condition('status', 1)->execute();
    $nodes = Node::loadMultiple($nids);
    $eventData = [];
    $index = 0;
    foreach ($nodes as $key => $node) {
      $eventData[$index]['title'] = $node->get('title')->getValue()[0]["value"];
      $eventData[$index]['start'] = $node->get('field_event_date')->getValue()[0]["value"];
      $eventData[$index]['end'] = $node->get('field_event_date')->getValue()[0]["end_value"];
      $eventData[$index]['body'] = $node->get('field_event_body')->getValue()[0]["value"];
      $eventData[$index]['uri'] = $node->get('field_event_url')->getValue()[0];
      $startDateStr = strtotime($eventData[$index]['start']);
      $endDateStr = strtotime($eventData[$index]['end']);
      $startDate = date("d", $startDateStr);
      $endDate = date("d", $startDateStr);
      $startMonth = date("M", $startDateStr);
      $endMonth = date("M", $endDateStr);
      if ($startDate === $endDate && $startMonth === $endMonth) {
        $eventData[$index]['dateContent'] = $startMonth . ' ' . date("d", $startDateStr) . ' ,' . date("Y", $endDateStr);
      }
      else {
        if ($startMonth === $endMonth) {
          $eventData[$index]['dateContent'] = $startMonth . ' ' . date("d", $startDateStr) . '-' . date("d", $endDateStr) . ' ,' . date("Y", $endDateStr);
        }
        else {
          $eventData[$index]['dateContent'] = $startMonth . ' ' . date("d", $startDateStr) . '-' . $endMonth . ' ' . date("d", $endDateStr) . ' ,' . date("Y", $endDateStr);
        }
      }
      $index++;
    }
    $data = $serializer->serialize($eventData, 'json', ['plugin_id' => 'entity']);
    return $data;
  }

}
